export interface GameSpecs {
  genre: string;
  players: string;
  duration: string;
  price: string;
}

export interface GameDetails {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  fullDescription: string;
  specs: GameSpecs;
}

export interface GameDetailsResponse {
  data: GameDetails;
}
