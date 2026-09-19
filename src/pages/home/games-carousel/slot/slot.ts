import './slot.scss';

export type SlotRole = 'thumb-left' | 'peek-left' | 'focus' | 'peek-right' | 'thumb-right';

export function createGamesCarouselSlot(role: SlotRole): HTMLElement {
  const slot = document.createElement('div');
  slot.classList.add('games-carousel-slot');
  slot.dataset.slotRole = role;

  return slot;
}
