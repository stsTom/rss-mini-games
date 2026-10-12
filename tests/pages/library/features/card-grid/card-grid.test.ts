import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../../../../src/shared/api/games-data.js';
import { createCardGrid } from '../../../../../src/pages/library/features/card-grid/card-grid.js';
import { flush, makeGame } from '../../../../helpers.js';

vi.mock('../../../../../src/shared/api/games-data.js');

const meta = { page: 1, limit: 6, totalItems: 2, totalPages: 1 };

describe('createCardGrid', () => {
  beforeEach(() => {
    vi.mocked(api.fetchGamesPage).mockReset();
  });

  it('shows skeletons, then cards, and reports meta', async () => {
    vi.mocked(api.fetchGamesPage).mockResolvedValue({
      data: [makeGame(), makeGame({ slug: 'snake', name: 'Snake' })],
      meta,
    });
    const onLoad = vi.fn();
    const onGameSelect = vi.fn();
    const { element, load } = createCardGrid({ onGameSelect, onLoad });

    load({ category: 'puzzle' });
    expect(element.querySelectorAll('.card-skeleton')).toHaveLength(6);
    expect(element.getAttribute('aria-busy')).toBe('true');
    await flush();

    expect(api.fetchGamesPage).toHaveBeenCalledWith({ category: 'puzzle', limit: 6 });
    expect(element.querySelectorAll('.library-card')).toHaveLength(2);
    expect(element.hasAttribute('aria-busy')).toBe(false);
    expect(onLoad).toHaveBeenCalledWith(meta);

    element.querySelector<HTMLButtonElement>('.library-card-details')?.click();
    expect(onGameSelect).toHaveBeenCalledWith(expect.objectContaining({ slug: 'tetris' }));
  });

  it('shows an empty banner without games', async () => {
    vi.mocked(api.fetchGamesPage).mockResolvedValue({ data: [], meta });
    const { element, load } = createCardGrid({ onGameSelect: vi.fn() });

    load({});
    await flush();

    expect(element.querySelector('.empty-banner')).not.toBeNull();
  });

  it('shows an error that can be retried', async () => {
    vi.mocked(api.fetchGamesPage).mockRejectedValueOnce(new Error('down'));
    vi.mocked(api.fetchGamesPage).mockResolvedValueOnce({ data: [makeGame()], meta });
    const { element, load } = createCardGrid({ onGameSelect: vi.fn() });

    load({});
    await flush();
    element.querySelector<HTMLButtonElement>('.error-layout-retry')?.click();
    await flush();

    expect(api.fetchGamesPage).toHaveBeenCalledTimes(2);
    expect(element.querySelectorAll('.library-card')).toHaveLength(1);
  });

  it('ignores stale responses', async () => {
    let resolveFirst: (value: {
      data: ReturnType<typeof makeGame>[];
      meta: typeof meta;
    }) => void = () => {};
    vi.mocked(api.fetchGamesPage)
      .mockReturnValueOnce(new Promise((resolve) => (resolveFirst = resolve)))
      .mockResolvedValueOnce({ data: [makeGame({ slug: 'second', name: 'Second' })], meta });
    const { element, load } = createCardGrid({ onGameSelect: vi.fn() });

    load({ page: 1 });
    load({ page: 2 });
    await flush();
    resolveFirst({ data: [makeGame({ name: 'First' })], meta });
    await flush();

    expect(element.querySelector('.game-card-title')?.textContent).toBe('Second');
  });
});
