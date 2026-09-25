export interface GameDetails {
  slug: string;
  name: string;
  heroImage: string;
}

export interface GameDetailsResponse {
  data: GameDetails;
}
