import type { LeaderboardResponse } from '../interfaces.js';

export async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  const response = await fetch('/mock-data/leaderboard.json');

  return (await response.json()) as LeaderboardResponse;
}
