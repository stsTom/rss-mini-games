import './games-carousel.scss';
import { createGamesCarouselHeader } from '../header/header.js';
import { createGamesCarouselSlot, type SlotRole } from '../slot/slot.js';
import { fetchCarouselGames } from '../games-data/games-data.js';

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
