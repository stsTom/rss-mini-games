import { createHeader } from '../shared/features/header/header.js';
import { createHero } from '../pages/home/hero/hero/hero.js';
import { createGamesCarousel } from '../pages/home/games-carousel/games-carousel/games-carousel.js';

const main = document.querySelector('main');

if (main) {
  main.append(createHeader(), createHero());
  main.append(await createGamesCarousel());
}
