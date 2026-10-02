import type { LeaderboardResponse } from '../interfaces.js';
import { API_BASE_URL } from '../../../../../shared/constants.js';

const LEADERBOARD_API_BASE_URL = `${API_BASE_URL}/leaderboard`;

export async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  const response = await fetch(LEADERBOARD_API_BASE_URL);

  return (await response.json()) as LeaderboardResponse;
}
