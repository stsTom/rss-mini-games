import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../../../../../src/shared/api/games-data.js';
import { createGameDetailsCommentCard } from '../../../../../../src/shared/features/game-details-dialog/components/comment-card/comment-card.js';
import {
  flush,
  makeComment,
  makeSession,
  makeSnackbar,
  passthroughGuard,
  signedIn,
} from '../../../../../helpers.js';

vi.mock('../../../../../../src/shared/api/games-data.js');

const setup = (user: typeof signedIn | null = signedIn, index = 0) => {
  const snackbar = makeSnackbar();
  const card = createGameDetailsCommentCard({
    comment: makeComment(),
    index,
    guardAction: passthroughGuard,
    session: makeSession(user ?? undefined),
    snackbar,
  });
  const like = card.querySelector<HTMLButtonElement>('.game-details-comment-like');
  if (!like) {
    throw new Error('like missing');
  }
  return { card, like, snackbar };
};

describe('createGameDetailsCommentCard', () => {
  beforeEach(() => {
    vi.mocked(api.toggleCommentLike).mockReset();
  });

  it('renders author, text and cycling avatar colour', () => {
    const { card } = setup(signedIn, 6);

    expect(card.querySelector('.game-details-comment-avatar')?.textContent).toBe('A');
    expect(
      card.querySelector<HTMLElement>('.game-details-comment-avatar')?.dataset['avatarColor']
    ).toBe('2');
    expect(card.querySelector('.game-details-comment-text')?.textContent).toBe('Great game');
    expect(card.querySelector('time')?.dateTime).toBe('2026-01-01T00:00:00Z');
  });

  it('likes and unlikes', async () => {
    vi.mocked(api.toggleCommentLike).mockResolvedValue();
    const { like } = setup();

    like.click();
    await flush();
    expect(like.getAttribute('aria-label')).toBe('Like, 4 likes');
    expect(like.getAttribute('aria-pressed')).toBe('true');

    like.click();
    await flush();
    expect(like.getAttribute('aria-label')).toBe('Like, 3 likes');
  });

  it('reports failures', async () => {
    vi.mocked(api.toggleCommentLike).mockRejectedValue(new Error('x'));
    const { like, snackbar } = setup();

    like.click();
    await flush();

    expect(snackbar.show).toHaveBeenCalledWith(expect.any(String), 'error');
  });

  it('ignores clicks without a user', async () => {
    const { like } = setup(null);

    like.click();
    await flush();

    expect(api.toggleCommentLike).not.toHaveBeenCalled();
  });
});
