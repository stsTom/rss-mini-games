import type { Game } from '../interfaces.js';
import type {
  GameDetails,
  GameCommentsResponse,
} from '../features/game-details-dialog/interfaces.js';

interface GamesSeedResponse {
  data: Game[];
}

interface GameDetailsResponse {
  data: GameDetails;
}

export interface FetchGamesRequestOptions {
  featured: boolean;
}

export interface FetchGameDetailsRequestOptions {
  gameSlug: string;
}

const API_BASE_URL = 'https://faxb76kxra.execute-api.eu-central-1.amazonaws.com/api';

export async function fetchGames({ featured }: FetchGamesRequestOptions): Promise<Game[]> {
  const response = featured
    ? await fetch(`${API_BASE_URL}/games?featured=true`)
    : await fetch(`${API_BASE_URL}/games`);
  const { data } = (await response.json()) as GamesSeedResponse;

  return data;
}

export async function fetchGameDetails({ gameSlug }: FetchGameDetailsRequestOptions) {
  const response = await fetch(`${API_BASE_URL}/games/${gameSlug}`);
  const { data } = (await response.json()) as GameDetailsResponse;

  return data;
}

export async function fetchGameComments({ gameSlug }: FetchGameDetailsRequestOptions) {
  const response = await fetch(`${API_BASE_URL}/games/${gameSlug}/comments`);
  const parsedResponse = (await response.json()) as GameCommentsResponse;

  return parsedResponse;
}
