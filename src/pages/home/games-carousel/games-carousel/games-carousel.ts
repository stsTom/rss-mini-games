import './games-carousel.scss';
import { createGamesCarouselHeader } from '../header/header.js';
import { createGamesCarouselSlot, type SlotRole } from '../slot/slot.js';

const SLOT_ROLES: SlotRole[] = ['thumb-left', 'peek-left', 'focus', 'peek-right', 'thumb-right'];

export function createGamesCarousel(): HTMLElement {
  const section = document.createElement('section');
  section.classList.add('games-carousel');

  const content = document.createElement('div');
  content.classList.add('games-carousel-content');
  content.append(...SLOT_ROLES.map((role) => createGamesCarouselSlot(role)));

  section.append(createGamesCarouselHeader(), content);

  return section;
}
