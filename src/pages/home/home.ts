import { createHero } from './features/hero/hero.js';
import { createGamesCarousel } from './features/games-carousel/games-carousel.js';
import { createLeaderboard } from './features/leaderboard/leaderboard.js';
import { createDeveloperCta } from './features/developer-cta/developer-cta.js';
import type { Game } from '../../shared/interfaces.js';

export interface HomePageOptions {
  onGameSelect: (game: Game, onClose: () => void) => void;
}

export async function createHomePage({ onGameSelect }: HomePageOptions): Promise<HTMLElement> {
  const page = document.createElement('div');
  page.append(
    createHero(),
    await createGamesCarousel({ onGameSelect }),
    await createLeaderboard(),
    createDeveloperCta()
  );

  return page;
}
