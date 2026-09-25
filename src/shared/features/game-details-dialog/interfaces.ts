export interface GameDetails {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
}

export interface GameDetailsResponse {
  data: GameDetails;
}
