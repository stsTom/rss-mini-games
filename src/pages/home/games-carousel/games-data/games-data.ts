import type { SlotRole } from '../slot/slot.js';

export interface Game {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
  featured: boolean;
}

interface GamesSeedResponse {
  data: Game[];
}

// Hardcoded until carousel navigation exists; navigation will change this to mutable state.
const FOCUSED_INDEX = 0;

function gameAtOffset(featured: Game[], offset: number): Game {
  const index = (((FOCUSED_INDEX + offset) % featured.length) + featured.length) % featured.length;
  const game = featured[index];

  if (!game) {
    throw new Error(`games-carousel: no featured game at index ${index}`);
  }

  return game;
}

export async function fetchCarouselGames(): Promise<Record<SlotRole, Game>> {
  const response = await fetch('/mock-data/all-games-seed.json');
  const { data } = (await response.json()) as GamesSeedResponse;
  const featured = data.filter((game) => game.featured);

  return {
    'thumb-left': gameAtOffset(featured, -2),
    'peek-left': gameAtOffset(featured, -1),
    focus: gameAtOffset(featured, 0),
    'peek-right': gameAtOffset(featured, 1),
    'thumb-right': gameAtOffset(featured, 2),
  };
}
