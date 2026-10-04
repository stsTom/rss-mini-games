export interface Game {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
  featured?: boolean;
}

export interface GameSpecs {
  genre: string;
  players: string;
  duration: string;
  price: string;
}

export interface GameRecord {
  position: number;
  playerName: string;
  score: number;
  achievedAt: string;
}

export interface GameDetails {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  fullDescription: string;
  specs: GameSpecs;
  topRecords: GameRecord[];
}

export interface GameComment {
  commentId: string;
  authorName: string;
  text: string;
  likesCount: number;
  createdAt: string;
}

export interface GameCommentsResponse {
  data: GameComment[];
  meta: {
    totalComments: number;
  };
}

export interface FetchGamesRequestOptions {
  featured?: boolean | undefined;
  category?: string | undefined;
  sort?: string | undefined;
  limit?: number | undefined;
}

export interface FetchGameDetailsRequestOptions {
  gameSlug: string;
}
