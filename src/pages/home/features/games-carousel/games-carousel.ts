import './games-carousel.scss';
import { createGamesCarouselHeader } from './components/carousel-header/carousel-header.js';
import { createGamesCarouselSlot, type SlotRole } from './components/slot/slot.js';
import { fetchCarouselGames } from './api/games-data.js';

const SLOT_ROLES: SlotRole[] = ['thumb-left', 'peek-left', 'focus', 'peek-right', 'thumb-right'];

export async function createGamesCarousel(): Promise<HTMLElement> {
  const games = await fetchCarouselGames();

  const section = document.createElement('section');
  section.classList.add('games-carousel');

  const content = document.createElement('div');
  content.classList.add('games-carousel-content');
  content.append(...SLOT_ROLES.map((role) => createGamesCarouselSlot(role, games[role])));

  section.append(createGamesCarouselHeader(), content);

  return section;
}
