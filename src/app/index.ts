import '../../styles/global.scss';
import { createHeader } from '../shared/features/header/header.js';
import { createHero } from '../pages/home/features/hero/hero.js';
import { createGamesCarousel } from '../pages/home/features/games-carousel/games-carousel.js';
import { createLeaderboard } from '../pages/home/features/leaderboard/leaderboard.js';
import { createDeveloperCta } from '../pages/home/features/developer-cta/developer-cta.js';
import { createFooter } from '../shared/features/footer/footer.js';
import { createGameDetailsDialog } from '../shared/features/game-details-dialog/game-details-dialog.js';

const main = document.querySelector('main');

if (main) {
  const gameDetailsDialog = createGameDetailsDialog();

  main.append(createHeader(), createHero());
  main.append(await createGamesCarousel({ onGameSelect: gameDetailsDialog.open }));
  main.append(await createLeaderboard());
  main.append(createDeveloperCta());
  main.append(createFooter());
  main.append(gameDetailsDialog.element);
}
