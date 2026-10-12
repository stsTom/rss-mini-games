import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../../../src/shared/api/games-data.js';
import { createGameDetailsDialog } from '../../../../src/shared/features/game-details-dialog/game-details-dialog.js';
import {
  flush,
  makeComment,
  makeDetails,
  makeSession,
  makeSnackbar,
  passthroughGuard,
  signedIn,
} from '../../../helpers.js';

vi.mock('../../../../src/shared/api/games-data.js');

const commentsResponse = (count: number) => ({
  data: Array.from({ length: count }, (_, index) =>
    makeComment({ commentId: `c${index}`, authorName: `user${index}` })
  ),
  meta: { totalComments: count },
});

const setup = (signedInUser = true) => {
  const dialog = createGameDetailsDialog({
    guardAction: passthroughGuard,
    session: makeSession(signedInUser ? signedIn : undefined),
    snackbar: makeSnackbar(),
  });
  document.body.append(dialog.element);
  return dialog;
};

describe('createGameDetailsDialog', () => {
  beforeEach(() => {
    vi.mocked(api.fetchGameDetails).mockResolvedValue(makeDetails());
    vi.mocked(api.fetchGameComments).mockResolvedValue(commentsResponse(2));
  });

  it('shows a skeleton while loading, then the game', async () => {
    const dialog = setup();

    const opening = dialog.open('tetris');
    expect(dialog.element.querySelector('.game-details-skeleton-bar-hero')).not.toBeNull();
    expect(dialog.element.querySelector('[aria-busy="true"]')).not.toBeNull();

    await opening;

    expect(dialog.element.querySelector('.game-details-summary-title')?.textContent).toBe('Tetris');
    expect(dialog.element.querySelector('.game-details-description')?.textContent).toBe(
      'Stack blocks.'
    );
    expect(dialog.element.querySelectorAll('.game-details-comment')).toHaveLength(2);
    expect(dialog.element.querySelector('[aria-busy]')).toBeNull();
  });

  it('shows empty banners when there are no records or comments', async () => {
    vi.mocked(api.fetchGameDetails).mockResolvedValue(makeDetails({ topRecords: [] }));
    vi.mocked(api.fetchGameComments).mockResolvedValue(commentsResponse(0));
    const dialog = setup();

    await dialog.open('tetris');

    expect(dialog.element.querySelectorAll('.empty-banner')).toHaveLength(2);
  });

  it('shows an empty banner when details are missing', async () => {
    vi.mocked(api.fetchGameDetails).mockResolvedValue(undefined as never);
    const dialog = setup();

    await dialog.open('tetris');

    expect(dialog.element.querySelector('.empty-banner')).not.toBeNull();
  });

  it('shows an error with retry on failure', async () => {
    vi.mocked(api.fetchGameDetails).mockRejectedValueOnce(new Error('down'));
    const dialog = setup();

    await dialog.open('tetris');
    const retry = dialog.element.querySelector<HTMLButtonElement>('.error-layout-retry');
    expect(retry).not.toBeNull();

    retry?.click();
    await flush();

    expect(api.fetchGameDetails).toHaveBeenCalledTimes(2);
    expect(dialog.element.querySelector('.game-details-summary-title')).not.toBeNull();
  });

  it('ignores stale responses', async () => {
    let resolveFirst: (value: ReturnType<typeof makeDetails>) => void = () => {};
    vi.mocked(api.fetchGameDetails)
      .mockReturnValueOnce(new Promise((resolve) => (resolveFirst = resolve)))
      .mockResolvedValueOnce(makeDetails({ name: 'Second' }));
    const dialog = setup();

    const first = dialog.open('first');
    await dialog.open('second');
    resolveFirst(makeDetails({ name: 'First' }));
    await first;

    expect(dialog.element.querySelector('.game-details-summary-title')?.textContent).toBe('Second');
  });

  it('calls the close callback once and closes via the hero button', async () => {
    const dialog = setup();
    const onClose = vi.fn();

    await dialog.open('tetris', onClose);
    dialog.element.querySelector<HTMLButtonElement>('.game-details-hero-close')?.click();

    expect(onClose).toHaveBeenCalledOnce();
    dialog.element.dispatchEvent(new Event('close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('refreshes comments after posting one', async () => {
    const dialog = setup();
    await dialog.open('tetris');
    vi.mocked(api.postGameComment).mockResolvedValue();
    vi.mocked(api.fetchGameComments).mockResolvedValue(commentsResponse(3));

    const textarea = dialog.element.querySelector('textarea');
    if (!textarea) {
      throw new Error('textarea missing');
    }
    textarea.value = 'Nice';
    dialog.element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    await flush();

    expect(api.postGameComment).toHaveBeenCalled();
    expect(dialog.element.querySelectorAll('.game-details-comment')).toHaveLength(3);
    expect(dialog.element.querySelector('.game-details-section-heading')?.textContent).toContain(
      'Top Records'
    );
  });

  it('exposes close', async () => {
    const dialog = setup();
    await dialog.open('tetris');

    dialog.close();

    expect(dialog.element.close).toHaveBeenCalled();
  });
});
