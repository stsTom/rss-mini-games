import type { Game } from '../../../../../shared/interfaces.js';

interface GamesSeedResponse {
  data: Game[];
}

export async function fetchFeaturedGames(): Promise<Game[]> {
  const response = await fetch('/mock-data/all-games-seed.json');
  const { data } = (await response.json()) as GamesSeedResponse;

  return data.filter((game) => game.featured);
}
