import type { GameCommentsResponse, GameDetails, GameDetailsResponse } from '../interfaces.js';

export async function fetchGameDetails(): Promise<GameDetails> {
  const response = await fetch('/mock-data/game-tukoni-forest-keepers.json');
  const { data } = (await response.json()) as GameDetailsResponse;

  return data;
}

export async function fetchGameComments(): Promise<GameCommentsResponse> {
  const response = await fetch('/mock-data/comments-tukoni-forest-keepers.json');

  return (await response.json()) as GameCommentsResponse;
}
