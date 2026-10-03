import { createHero } from './features/hero/hero.js';
import { createGamesCarousel } from './features/games-carousel/games-carousel.js';
// import { createLeaderboard } from './features/leaderboard/leaderboard.js';
import { createDeveloperCta } from './features/developer-cta/developer-cta.js';
import type { Game } from '../../shared/interfaces.js';
import type { Router } from '../../shared/services/router.js';

export interface HomePageOptions {
  onGameSelect: (game: Game, onClose: () => void) => void;
  router: Router;
}

export async function createHomePage({
  onGameSelect,
  router,
}: HomePageOptions): Promise<HTMLElement> {
  const page = document.createElement('div');
  page.append(
    createHero({ router }),
    createGamesCarousel({ onGameSelect }),
    // await createLeaderboard(),
    createDeveloperCta()
  );

  return page;
}
