import { API_BASE_URL } from '../constants.js';
import type {
  Game,
  GameDetails,
  FetchGameDetailsRequestOptions,
  FetchGamesRequestOptions,
  GameCommentsResponse,
  GamesPage,
} from '../interfaces.js';

interface GameDetailsResponse {
  data: GameDetails;
}

const GAMES_API_BASE_URL = `${API_BASE_URL}/games`;

export async function fetchGamesPage({
  featured,
  category,
  sort,
  limit,
  page,
}: FetchGamesRequestOptions): Promise<GamesPage> {
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
  if (page) {
    query.set('page', String(page));
  }

  const queryString = query.toString();
  const response = await fetch(
    queryString ? `${GAMES_API_BASE_URL}?${queryString}` : GAMES_API_BASE_URL
  );

  return (await response.json()) as GamesPage;
}

export async function fetchGames(options: FetchGamesRequestOptions): Promise<Game[]> {
  const { data } = await fetchGamesPage(options);

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
