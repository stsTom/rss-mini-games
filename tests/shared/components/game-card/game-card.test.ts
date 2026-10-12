import { describe, expect, it } from 'vitest';
import { createGameCard } from '../../../../src/shared/components/game-card/game-card.js';
import { makeGame } from '../../../helpers.js';

describe('createGameCard', () => {
  it('renders title, rating and abbreviated likes', () => {
    const card = createGameCard(makeGame());

    expect(card.dataset['gameSlug']).toBe('tetris');
    expect(card.querySelector('.game-card-title')?.textContent).toBe('Tetris');
    expect(card.querySelector('.game-card-rating')?.textContent).toBe('4.5');
    expect(card.querySelector('.game-card-likes')?.textContent).toBe('1.5k');
  });

  it('keeps small like counts as is', () => {
    const card = createGameCard(makeGame({ likesCount: 42 }));

    expect(card.querySelector('.game-card-likes')?.textContent).toBe('42');
  });
});
