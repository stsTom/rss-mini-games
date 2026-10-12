import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchGameComments,
  fetchGameDetails,
  fetchGames,
  fetchGamesPage,
  postGameComment,
  toggleCommentLike,
  toggleGameFavorite,
} from '../../../src/shared/api/games-data.js';
import { API_BASE_URL } from '../../../src/shared/constants.js';

const fetchMock = vi.fn();

const jsonResponse = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: () => Promise.resolve(body),
});

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('fetchGamesPage', () => {
  it('requests the bare url without options', async () => {
    const page = { data: [], meta: {} };
    fetchMock.mockResolvedValue(jsonResponse(page));

    const result = await fetchGamesPage({});

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/games`);
    expect(result).toBe(page);
  });

  it('serialises every option', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [] }));

    await fetchGamesPage({ featured: true, category: 'arcade', sort: 'rating', limit: 6, page: 2 });

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/games?featured=true&category=arcade&sort=rating&limit=6&page=2`
    );
  });
});

describe('fetchGames', () => {
  it('returns only the data array', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [{ slug: 'a' }], meta: {} }));

    expect(await fetchGames({})).toEqual([{ slug: 'a' }]);
  });
});

describe('fetchGameDetails', () => {
  it('unwraps data', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: { slug: 'tetris' } }));

    expect(await fetchGameDetails({ gameSlug: 'tetris' })).toEqual({ slug: 'tetris' });
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/games/tetris`);
  });
});

describe('fetchGameComments', () => {
  it('returns the parsed response', async () => {
    const body = { data: [], meta: { totalComments: 0 } };
    fetchMock.mockResolvedValue(jsonResponse(body));

    expect(await fetchGameComments({ gameSlug: 'tetris' })).toBe(body);
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/games/tetris/comments`);
  });
});

describe('post helpers', () => {
  it('toggleGameFavorite posts the email', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));

    await toggleGameFavorite({ gameSlug: 'tetris', userEmail: 'j@x' });

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/games/tetris/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: 'j@x' }),
    });
  });

  it('postGameComment posts the comment', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));

    await postGameComment({ gameSlug: 'tetris', userEmail: 'j@x', authorName: 'J', text: 'hi' });

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/games/tetris/comment`,
      expect.objectContaining({
        body: JSON.stringify({ userEmail: 'j@x', authorName: 'J', text: 'hi' }),
      })
    );
  });

  it('toggleCommentLike posts to the comment', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));

    await toggleCommentLike({ commentId: 'c1', userEmail: 'j@x' });

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/comments/c1/like`, expect.anything());
  });

  it('throws on a failed response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, false, 500));

    await expect(toggleCommentLike({ commentId: 'c1', userEmail: 'j@x' })).rejects.toThrow(
      'Request failed with status 500'
    );
  });
});
