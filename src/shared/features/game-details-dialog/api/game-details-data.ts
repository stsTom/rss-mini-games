import type { GameDetails, GameDetailsResponse } from '../interfaces.js';

export async function fetchGameDetails(): Promise<GameDetails> {
  const response = await fetch('/mock-data/game-tukoni-forest-keepers.json');
  const { data } = (await response.json()) as GameDetailsResponse;

  return data;
}
