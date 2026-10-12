import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../../../../src/pages/home/features/leaderboard/api/leaderboard-data.js';
import { createLeaderboard } from '../../../../../src/pages/home/features/leaderboard/leaderboard.js';
import { flush } from '../../../../helpers.js';

vi.mock('../../../../../src/pages/home/features/leaderboard/api/leaderboard-data.js');

const entry = (rank: number) => ({
  rank,
  playerName: `PlayerName${rank}`,
  gamesPlayed: rank * 10,
  totalScore: 12_345,
  streakDays: rank,
  favoriteGameSlug: 'tetris',
  favoriteGameName: 'Tetris',
});

const response = (count: number) => ({
  data: Array.from({ length: count }, (_, index) => entry(index + 1)),
  meta: { totalItems: count, description: '' },
});

describe('createLeaderboard', () => {
  beforeEach(() => {
    vi.mocked(api.fetchLeaderboard).mockReset();
  });

  it('shows placeholders while loading', () => {
    vi.mocked(api.fetchLeaderboard).mockReturnValue(new Promise(() => {}));

    const section = createLeaderboard();

    expect(section.querySelectorAll('.leaderboard-row-placeholder').length).toBeGreaterThanOrEqual(
      5
    );
    expect(section.querySelector('.leaderboard-header-row')).not.toBeNull();
    expect(section.querySelector('[aria-busy="true"]')).not.toBeNull();
  });

  it('renders a row per player', async () => {
    vi.mocked(api.fetchLeaderboard).mockResolvedValue(response(4));

    const section = createLeaderboard();
    await flush();

    const rows = section.querySelectorAll('.leaderboard-row:not(.leaderboard-header-row)');
    expect(rows).toHaveLength(4);
    expect(section.querySelector('[aria-busy]')).toBeNull();
    expect(rows[0]?.querySelector('.leaderboard-player-avatar')?.textContent).toBe('PN');
    expect(rows[0]?.querySelector('.leaderboard-cell-streak')?.textContent).toContain('1d');
    expect(rows[0]?.querySelector('[data-score-visibility="abbreviated"]')?.textContent).toBe(
      '12.3K'
    );
    expect(rows[0]?.querySelector('[data-score-visibility="full"]')?.textContent).toBe('12,345');
    expect((rows[0] as HTMLElement).dataset['leaderboardVisibility']).toBeUndefined();
    expect((rows[3] as HTMLElement).dataset['leaderboardVisibility']).toBe('desktop-only');
  });

  it('shows small scores unabbreviated', async () => {
    vi.mocked(api.fetchLeaderboard).mockResolvedValue({
      data: [{ ...entry(1), totalScore: 950 }],
      meta: { totalItems: 1, description: '' },
    });

    const section = createLeaderboard();
    await flush();

    expect(section.querySelector('[data-score-visibility="abbreviated"]')?.textContent).toBe('950');
  });

  it('shows an empty banner without players', async () => {
    vi.mocked(api.fetchLeaderboard).mockResolvedValue(response(0));

    const section = createLeaderboard();
    await flush();

    expect(section.querySelector('.empty-banner')).not.toBeNull();
  });

  it('shows an error that can be retried', async () => {
    vi.mocked(api.fetchLeaderboard).mockRejectedValueOnce(new Error('down'));
    vi.mocked(api.fetchLeaderboard).mockResolvedValueOnce(response(2));

    const section = createLeaderboard();
    await flush();
    section.querySelector<HTMLButtonElement>('.error-layout-retry')?.click();
    await flush();

    expect(api.fetchLeaderboard).toHaveBeenCalledTimes(2);
    expect(section.querySelectorAll('.leaderboard-row:not(.leaderboard-header-row)')).toHaveLength(
      2
    );
    expect(section.querySelectorAll('.leaderboard-header-row')).toHaveLength(1);
  });
});
