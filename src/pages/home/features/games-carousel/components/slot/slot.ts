import './slot.scss';
import { createCardInfo } from '../card-info/card-info.js';
import type { Game } from '../../../../../../shared/interfaces.js';

export type SlotRole = 'thumb-left' | 'peek-left' | 'focus' | 'peek-right' | 'thumb-right';

export function createGamesCarouselSlot(game: Game): HTMLElement {
  const slot = document.createElement('div');
  slot.classList.add('games-carousel-slot');
  slot.style.viewTransitionName = `game-${game.slug}`;

  const image = document.createElement('img');
  image.classList.add('games-carousel-slot-image');
  image.src = game.cardImage;
  image.alt = game.name;
  image.draggable = false;
  slot.append(image, createCardInfo(game));

  return slot;
}
