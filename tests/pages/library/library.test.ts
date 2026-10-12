import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../../src/shared/api/games-data.js';
import { createLibraryPage } from '../../../src/pages/library/library.js';
import { createRouter } from '../../../src/shared/services/router.js';
import { flush, makeGame } from '../../helpers.js';

vi.mock('../../../src/shared/api/games-data.js');

const page = (pageNumber: number, totalPages: number) => ({
  data: [makeGame()],
  meta: { page: pageNumber, limit: 6, totalItems: 12, totalPages },
});

describe('createLibraryPage', () => {
  beforeEach(() => {
    vi.mocked(api.fetchGamesPage).mockReset();
    vi.mocked(api.fetchGamesPage).mockResolvedValue(page(1, 2));
    history.replaceState(null, '', '/library');
  });

  it('loads with defaults and renders sections', async () => {
    const router = createRouter();

    const element = await createLibraryPage({ onGameSelect: vi.fn(), router });
    await flush();

    expect(api.fetchGamesPage).toHaveBeenCalledWith({
      category: 'all',
      sort: 'rating-desc',
      page: 1,
      limit: 6,
    });
    expect(element.querySelector('.library-header')).not.toBeNull();
    expect(element.querySelectorAll('.library-card')).toHaveLength(1);
    expect(element.querySelector<HTMLElement>('.pagination')?.hidden).toBe(false);
  });

  it('falls back for unknown category and sort', async () => {
    history.replaceState(null, '', '/library?category=nope&sort=nope');
    const router = createRouter();

    await createLibraryPage({ onGameSelect: vi.fn(), router });

    expect(api.fetchGamesPage).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'all', sort: 'rating-desc' })
    );
  });

  it('updates the router from chips, sort and pagination', async () => {
    const router = createRouter();
    const element = await createLibraryPage({ onGameSelect: vi.fn(), router });
    await flush();

    element.querySelector<HTMLElement>('[data-category="arcade"]')?.click();
    expect(router.state.category).toBe('arcade');
    await flush();

    element.querySelector<HTMLElement>('[data-category="all"]')?.click();
    expect(router.state.category).toBeUndefined();

    element.querySelector<HTMLElement>('[data-value="name-asc"]')?.click();
    expect(router.state.sort).toBe('name-asc');

    element.querySelector<HTMLElement>('[data-value="rating-desc"]')?.click();
    expect(router.state.sort).toBeUndefined();
    await flush();

    vi.mocked(api.fetchGamesPage).mockResolvedValue(page(2, 2));
    element.querySelector<HTMLButtonElement>('[aria-label="Next page"]')?.click();
    expect(router.state.pageNumber).toBe(2);
    await flush();

    element.querySelector<HTMLButtonElement>('[aria-label="Previous page"]')?.click();
    expect(router.state.pageNumber).toBeUndefined();
  });

  it('redirects when the page is past the last one', async () => {
    history.replaceState(null, '', '/library?page=9');
    vi.mocked(api.fetchGamesPage).mockResolvedValueOnce(page(9, 3));
    const router = createRouter();

    await createLibraryPage({ onGameSelect: vi.fn(), router });
    await flush();

    expect(router.state.pageNumber).toBe(3);
  });

  it('stops reacting after leaving the library', async () => {
    const router = createRouter();
    await createLibraryPage({ onGameSelect: vi.fn(), router });
    await flush();
    const calls = vi.mocked(api.fetchGamesPage).mock.calls.length;

    router.goTo('home');
    router.update({ category: 'card' });

    expect(vi.mocked(api.fetchGamesPage).mock.calls).toHaveLength(calls);
  });
});
