import { createHeader } from '../shared/features/header/header.js';
import { createHero } from '../pages/home/features/hero/hero.js';
import { createGamesCarousel } from '../pages/home/features/games-carousel/games-carousel.js';
import { createLeaderboard } from '../pages/home/features/leaderboard/leaderboard.js';
import { createDeveloperCta } from '../pages/home/features/developer-cta/developer-cta.js';

const main = document.querySelector('main');

if (main) {
  main.append(createHeader(), createHero());
  main.append(await createGamesCarousel());
  main.append(await createLeaderboard());
  main.append(createDeveloperCta());
}
