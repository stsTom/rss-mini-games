import { API_BASE_URL } from '../constants.js';
import type {
  Game,
  GameDetails,
  FetchGameDetailsRequestOptions,
  FetchGamesRequestOptions,
  GameCommentsResponse,
} from '../interfaces.js';

interface GamesSeedResponse {
  data: Game[];
}

interface GameDetailsResponse {
  data: GameDetails;
}

const GAMES_API_BASE_URL = `${API_BASE_URL}/games`;

export async function fetchGames({ featured }: FetchGamesRequestOptions): Promise<Game[]> {
  const response = featured
    ? await fetch(`${GAMES_API_BASE_URL}?featured=true`)
    : await fetch(`${GAMES_API_BASE_URL}`);
  const { data } = (await response.json()) as GamesSeedResponse;

  return data;
}

export async function fetchGameDetails({ gameSlug }: FetchGameDetailsRequestOptions) {
  const response = await fetch(`${GAMES_API_BASE_URL}/${gameSlug}`);
  const { data } = (await response.json()) as GameDetailsResponse;

  return data;
}

export async function fetchGameComments({ gameSlug }: FetchGameDetailsRequestOptions) {
  const response = await fetch(`${GAMES_API_BASE_URL}/${gameSlug}/comments`);
  const parsedResponse = (await response.json()) as GameCommentsResponse;

  return parsedResponse;
}
