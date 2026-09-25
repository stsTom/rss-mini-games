import './games-carousel.scss';
import { createGamesCarouselHeader } from './components/carousel-header/carousel-header.js';
import { createGamesCarouselSlot, type SlotRole } from './components/slot/slot.js';
import { fetchFeaturedGames } from './api/games-data.js';

const SLOT_ROLES: SlotRole[] = ['thumb-left', 'peek-left', 'focus', 'peek-right', 'thumb-right'];
const FOCUS_ROLE_INDEX = SLOT_ROLES.indexOf('focus');
const SWIPE_THRESHOLD_PX = 50;
const AUTOPLAY_DELAY_MS = 4000;

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

  let autoplayTimer: ReturnType<typeof setTimeout> | undefined;

  function stopAutoplay(): void {
    clearTimeout(autoplayTimer);
  }

  function scheduleAutoplay(): void {
    stopAutoplay();
    autoplayTimer = setTimeout(() => {
      if (section.isConnected) {
        navigate(1);
      }
    }, AUTOPLAY_DELAY_MS);
  }

  function navigate(step: number): void {
    scheduleAutoplay();
    index = wrap(index + step, cards.length);

    if (!('startViewTransition' in document) || reducedMotion.matches) {
      render();
      return;
    }

    const root = document.documentElement;
    const { left, right } = content.getBoundingClientRect();
    root.style.setProperty('--games-carousel-clip-left', `${left}px`);
    root.style.setProperty('--games-carousel-clip-right', `${right}px`);
    root.dataset.gamesCarouselDirection = step > 0 ? 'next' : 'previous';

    transition?.skipTransition();
    section.classList.remove('games-carousel--capturing');

    const current = document.startViewTransition(() => {
      section.classList.add('games-carousel--capturing');
      render();
    });
    transition = current;
    void current.finished.finally(() => {
      if (transition === current) {
        section.classList.remove('games-carousel--capturing');
      }
    });
  }

  let swipeStart: { x: number; y: number } | undefined;

  content.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary) {
      return;
    }

    stopAutoplay();
    swipeStart = { x: event.clientX, y: event.clientY };
    content.setPointerCapture(event.pointerId);
  });

  content.addEventListener('pointerup', (event) => {
    if (!swipeStart || !event.isPrimary) {
      return;
    }

    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = undefined;

    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
      navigate(dx < 0 ? 1 : -1);
    } else {
      scheduleAutoplay();
    }
  });

  content.addEventListener('pointercancel', () => {
    swipeStart = undefined;
    scheduleAutoplay();
  });

  render();
  scheduleAutoplay();

  section.append(
    createGamesCarouselHeader({
      onPrevious: () => navigate(-1),
      onNext: () => navigate(1),
    }),
    content
  );

  return section;
}
