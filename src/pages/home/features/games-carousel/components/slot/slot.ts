import './slot.scss';
import { createCardSkeleton } from '../../../../../../shared/components/card-skeleton/card-skeleton.js';
import { createGameCard } from '../../../../../../shared/components/game-card/game-card.js';
import type { Game } from '../../../../../../shared/interfaces.js';

export type SlotRole = 'thumb-left' | 'peek-left' | 'focus' | 'peek-right' | 'thumb-right';

export function createGamesCarouselSkeletonSlot(role: SlotRole): HTMLElement {
  const slot = document.createElement('div');
  slot.classList.add('games-carousel-slot');
  slot.dataset.slotRole = role;
  slot.append(createCardSkeleton());

  return slot;
}

export function createGamesCarouselSlot(game: Game): HTMLElement {
  const slot = document.createElement('div');
  slot.classList.add('games-carousel-slot');
  slot.style.viewTransitionName = `game-${game.slug}`;

  const image = document.createElement('img');
  image.classList.add('games-carousel-slot-image');
  image.src = game.cardImage;
  image.alt = game.name;
  image.draggable = false;

  const info = createGameCard(game);
  info.classList.add('games-carousel-card-info');
  slot.append(image, info);

  return slot;
}
