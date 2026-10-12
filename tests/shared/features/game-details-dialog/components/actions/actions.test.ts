import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../../../../../src/shared/api/games-data.js';
import { createGameDetailsActions } from '../../../../../../src/shared/features/game-details-dialog/components/actions/actions.js';
import {
  flush,
  makeSession,
  makeSnackbar,
  passthroughGuard,
  signedIn,
} from '../../../../../helpers.js';

vi.mock('../../../../../../src/shared/api/games-data.js');

const setup = (price = 'Free', user: typeof signedIn | null = signedIn) => {
  const snackbar = makeSnackbar();
  const element = createGameDetailsActions({
    guardAction: passthroughGuard,
    session: makeSession(user ?? undefined),
    snackbar,
    gameSlug: 'tetris',
    price,
  });
  const favorite = element.querySelector<HTMLButtonElement>('.game-details-action--favorite');
  const play = element.querySelector<HTMLButtonElement>('.game-details-action--play');
  if (!favorite || !play) {
    throw new Error('buttons missing');
  }
  return { element, favorite, play, snackbar };
};

describe('createGameDetailsActions', () => {
  beforeEach(() => {
    vi.mocked(api.toggleGameFavorite).mockReset();
  });

  it('labels the play button by price', () => {
    expect(setup('Free').play.textContent).toBe('Play Now');
    expect(setup('$4.99').play.textContent).toBe('$4.99');
  });

  it('toggles favorite on and off', async () => {
    vi.mocked(api.toggleGameFavorite).mockResolvedValue();
    const { favorite } = setup();

    favorite.click();
    await flush();
    expect(api.toggleGameFavorite).toHaveBeenCalledWith({
      gameSlug: 'tetris',
      userEmail: 'jane@example.com',
    });
    expect(favorite.getAttribute('aria-pressed')).toBe('true');
    expect(favorite.classList.contains('is-active')).toBe(true);

    favorite.click();
    await flush();
    expect(favorite.getAttribute('aria-pressed')).toBe('false');
  });

  it('reports failures', async () => {
    vi.mocked(api.toggleGameFavorite).mockRejectedValue(new Error('x'));
    const { favorite, snackbar } = setup();

    favorite.click();
    await flush();

    expect(snackbar.show).toHaveBeenCalledWith(expect.any(String), 'error');
    expect(favorite.disabled).toBe(false);
  });

  it('does nothing without a user', async () => {
    const { favorite } = setup('Free', null);

    favorite.click();
    await flush();

    expect(api.toggleGameFavorite).not.toHaveBeenCalled();
  });

  it('play click goes through the guard', () => {
    const { play } = setup();

    expect(() => play.click()).not.toThrow();
  });
});
