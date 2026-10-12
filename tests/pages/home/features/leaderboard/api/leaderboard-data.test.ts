import { describe, expect, it, vi } from 'vitest';
import { fetchLeaderboard } from '../../../../../../src/pages/home/features/leaderboard/api/leaderboard-data.js';
import { API_BASE_URL } from '../../../../../../src/shared/constants.js';

describe('fetchLeaderboard', () => {
  it('fetches and parses the leaderboard', async () => {
    const body = { data: [], meta: { totalItems: 0, description: '' } };
    const fetchMock = vi.fn().mockResolvedValue({ json: () => Promise.resolve(body) });
    vi.stubGlobal('fetch', fetchMock);

    expect(await fetchLeaderboard()).toBe(body);
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/leaderboard`);
  });
});
