import type { Game } from '../interfaces.js';

interface GamesSeedResponse {
  data: Game[];
}

export async function fetchAllGames(): Promise<Game[]> {
  const response = await fetch('/mock-data/all-games-seed.json');
  const { data } = (await response.json()) as GamesSeedResponse;

  return data;
}

export async function fetchFeaturedGames(): Promise<Game[]> {
  const games = await fetchAllGames();

  return games.filter((game) => game.featured);
}
