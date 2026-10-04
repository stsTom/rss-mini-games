import '../../styles/global.scss';
import { createHeader } from '../shared/features/header/header.js';
import { createHomePage } from '../pages/home/home.js';
import { createLibraryPage } from '../pages/library/library.js';
import { createFooter } from '../shared/features/footer/footer.js';
import { createGameDetailsDialog } from '../shared/features/game-details-dialog/game-details-dialog.js';
import { createRouter, type PageType, type RouteState } from '../shared/services/router.js';
import type { Game } from '../shared/interfaces.js';

const main = document.querySelector('main');

if (main) {
  const router = createRouter();
  const gameDetailsDialog = createGameDetailsDialog();
  let onGameDialogClose: (() => void) | undefined;

  const selectGame = (game: Game, onClose?: () => void): void => {
    onGameDialogClose = onClose;
    router.update({ game: game.slug });
  };

  const syncGameDialog = ({ game }: RouteState, previous?: RouteState): void => {
    if (game === previous?.game) {
      return;
    }

    if (!game) {
      gameDetailsDialog.close();
      return;
    }

    gameDetailsDialog.open(game, () => {
      onGameDialogClose?.();
      onGameDialogClose = undefined;

      if (router.state.game) {
        router.update({ game: undefined });
      }
    });
  };

  const pageRenderers: Record<PageType, () => HTMLElement | Promise<HTMLElement>> = {
    home: () => createHomePage({ onGameSelect: selectGame, router }),
    library: () => createLibraryPage({ onGameSelect: selectGame }),
  };

  let currentPage = await pageRenderers[router.state.page]!();

  router.subscribe(async ({ page }, previous) => {
    if (page === previous.page) {
      return;
    }

    const nextPage = await pageRenderers[page]!();

    if (router.state.page !== page) {
      return;
    }

    currentPage.replaceWith(nextPage);
    currentPage = nextPage;
    window.scrollTo(0, 0);
  });
  router.subscribe(syncGameDialog);

  main.append(createHeader({ router }), currentPage);
  main.append(createFooter());
  main.append(gameDetailsDialog.element);
  syncGameDialog(router.state);
}
