import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../../../../../src/shared/api/games-data.js';
import { createGameDetailsCommentForm } from '../../../../../../src/shared/features/game-details-dialog/components/comment-form/comment-form.js';
import {
  flush,
  makeSession,
  makeSnackbar,
  passthroughGuard,
  signedIn,
} from '../../../../../helpers.js';

vi.mock('../../../../../../src/shared/api/games-data.js');

const setup = (user: typeof signedIn | null = signedIn) => {
  const snackbar = makeSnackbar();
  const onCommentPosted = vi.fn();
  const form = createGameDetailsCommentForm({
    guardAction: passthroughGuard,
    session: makeSession(user ?? undefined),
    snackbar,
    gameSlug: 'tetris',
    onCommentPosted,
  });
  const textarea = form.querySelector('textarea');
  if (!textarea) {
    throw new Error('textarea missing');
  }
  const submit = () => form.dispatchEvent(new Event('submit', { cancelable: true }));
  return { form, textarea, snackbar, onCommentPosted, submit };
};

describe('createGameDetailsCommentForm', () => {
  beforeEach(() => {
    vi.mocked(api.postGameComment).mockReset();
  });

  it('shows the user initial or a fallback', () => {
    expect(setup().form.querySelector('.game-details-comment-form-avatar')?.textContent).toBe('J');
    expect(setup(null).form.querySelector('.game-details-comment-form-avatar')?.textContent).toBe(
      'U'
    );
  });

  it('auto-grows on input', () => {
    const { textarea } = setup();

    textarea.dispatchEvent(new Event('input'));

    expect(textarea.style.overflowY).toBe('hidden');
  });

  it('posts a trimmed comment, clears and notifies', async () => {
    vi.mocked(api.postGameComment).mockResolvedValue();
    const { textarea, submit, onCommentPosted } = setup();
    textarea.value = '  Nice game  ';

    submit();
    await flush();

    expect(api.postGameComment).toHaveBeenCalledWith({
      gameSlug: 'tetris',
      userEmail: 'jane@example.com',
      authorName: 'Jane',
      text: 'Nice game',
    });
    expect(textarea.value).toBe('');
    expect(onCommentPosted).toHaveBeenCalledOnce();
  });

  it('ignores empty comments and missing users', async () => {
    const empty = setup();
    empty.submit();
    const anonymous = setup(null);
    anonymous.textarea.value = 'hi';
    anonymous.submit();
    await flush();

    expect(api.postGameComment).not.toHaveBeenCalled();
  });

  it('reports failures and re-enables the input', async () => {
    vi.mocked(api.postGameComment).mockRejectedValue(new Error('x'));
    const { textarea, submit, snackbar, onCommentPosted } = setup();
    textarea.value = 'hi';

    submit();
    await flush();

    expect(snackbar.show).toHaveBeenCalledWith(expect.any(String), 'error');
    expect(textarea.disabled).toBe(false);
    expect(onCommentPosted).not.toHaveBeenCalled();
  });
});
