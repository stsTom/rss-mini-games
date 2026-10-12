import { describe, expect, it, vi } from 'vitest';
import { createLibraryCard } from '../../../../../../../src/pages/library/features/card-grid/components/library-card/library-card.js';
import { makeGame } from '../../../../../../helpers.js';

describe('createLibraryCard', () => {
  it('builds the card with image, category, price and description', () => {
    const card = createLibraryCard(makeGame(), vi.fn());

    expect(card.classList.contains('library-card')).toBe(true);
    expect(card.querySelector('img')?.getAttribute('alt')).toBe('Tetris');
    expect(card.querySelector('.library-card-category')?.textContent).toBe('Puzzle');
    expect(card.querySelector('.library-card-price')?.textContent).toBe('Free');
    expect(card.querySelector('.library-card-price--free')).not.toBeNull();
    expect(card.querySelector('.library-card-description')?.textContent).toBe('Stack blocks.');
  });

  it('does not style paid games as free', () => {
    const card = createLibraryCard(makeGame({ price: '$4.99' }), vi.fn());

    expect(card.querySelector('.library-card-price--free')).toBeNull();
  });

  it('calls onDetails from the details button', () => {
    const onDetails = vi.fn();
    const card = createLibraryCard(makeGame(), onDetails);

    card.querySelector<HTMLButtonElement>('.library-card-details')?.click();

    expect(onDetails).toHaveBeenCalledOnce();
  });
});
