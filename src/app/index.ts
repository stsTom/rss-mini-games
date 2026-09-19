import { createHeader } from '../shared/features/header/header.js';
import { createHero } from '../pages/home/features/hero/hero.js';
import { createGamesCarousel } from '../pages/home/features/games-carousel/games-carousel.js';

const main = document.querySelector('main');

if (main) {
  main.append(createHeader(), createHero());
  main.append(await createGamesCarousel());
}
