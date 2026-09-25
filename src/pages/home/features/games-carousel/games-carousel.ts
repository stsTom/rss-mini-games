import './games-carousel.scss';
import { createGamesCarouselHeader } from './components/carousel-header/carousel-header.js';
import { createGamesCarouselSlot, type SlotRole } from './components/slot/slot.js';
import { fetchFeaturedGames } from './api/games-data.js';

const SLOT_ROLES: SlotRole[] = ['thumb-left', 'peek-left', 'focus', 'peek-right', 'thumb-right'];
const FOCUS_ROLE_INDEX = SLOT_ROLES.indexOf('focus');

function wrap(value: number, length: number): number {
  return ((value % length) + length) % length;
}

function ringOffset(position: number, index: number, length: number): number {
  const offset = wrap(position - index, length);
  return offset > length / 2 ? offset - length : offset;
}

export async function createGamesCarousel(): Promise<HTMLElement> {
  const games = await fetchFeaturedGames();
  const cards = games.map((game) => createGamesCarouselSlot(game));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let transition: ViewTransition | undefined;

  const section = document.createElement('section');
  section.classList.add('games-carousel');

  const content = document.createElement('div');
  content.classList.add('games-carousel-content');
  content.append(...cards);

  function render(): void {
    for (const [position, card] of cards.entries()) {
      const role = SLOT_ROLES[ringOffset(position, index, cards.length) + FOCUS_ROLE_INDEX];

      if (role) {
        card.dataset.slotRole = role;
      } else {
        delete card.dataset.slotRole;
      }
    }
  }

  function navigate(step: number): void {
    index = wrap(index + step, cards.length);

    if (!('startViewTransition' in document) || reducedMotion.matches) {
      render();
      return;
    }

    transition?.skipTransition();
    transition = document.startViewTransition(render);
  }

  render();

  section.append(
    createGamesCarouselHeader({
      onPrevious: () => navigate(-1),
      onNext: () => navigate(1),
    }),
    content
  );

  return section;
}
