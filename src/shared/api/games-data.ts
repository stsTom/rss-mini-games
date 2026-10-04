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

export async function fetchGames({
  featured,
  category,
  sort,
  limit,
}: FetchGamesRequestOptions): Promise<Game[]> {
  const query = new URLSearchParams();
  if (featured) {
    query.set('featured', 'true');
  }
  if (category) {
    query.set('category', category);
  }
  if (sort) {
    query.set('sort', sort);
  }
  if (limit) {
    query.set('limit', String(limit));
  }

  const queryString = query.toString();
  const response = await fetch(
    queryString ? `${GAMES_API_BASE_URL}?${queryString}` : GAMES_API_BASE_URL
  );
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
