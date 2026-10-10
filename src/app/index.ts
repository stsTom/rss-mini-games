import '../../styles/global.scss';
import { createHeader } from '../shared/features/header/header.js';
import { createHomePage } from '../pages/home/home.js';
import { createLibraryPage } from '../pages/library/library.js';
import { createNotFoundPage } from '../pages/not-found/not-found.js';
import { createFooter } from '../shared/features/footer/footer.js';
import { createGameDetailsDialog } from '../shared/features/game-details-dialog/game-details-dialog.js';
import {
  createRouter,
  type PageType,
  type RouteGuard,
  type RouteState,
} from '../shared/services/router.js';
import { createAppSession } from '../shared/services/app-session.js';
import type { Game } from '../shared/interfaces.js';

const main = document.querySelector('main');

if (main) {
  const session = createAppSession();
  session.restore();

  const guard: RouteGuard = (next) => {
    if (!session.hasActiveSession() || !next.auth) {
      return next;
    }

    console.log('You are already signed in.'); // add snackbar
    return { ...next, auth: undefined };
  };

  const router = createRouter({ guard });
  const gameDetailsDialog = createGameDetailsDialog();
  let onGameDialogClose: (() => void) | undefined;

  const selectGame = (game: Game, onClose?: () => void): void => {
    onGameDialogClose = onClose;
    router.update({ game: game.slug });
  };

  const visibleGame = (state?: RouteState): string | undefined =>
    state?.auth ? undefined : state?.game;

  const syncGameDialog = (state: RouteState, previous?: RouteState): void => {
    const game = visibleGame(state);
    if (game === visibleGame(previous)) {
      return;
    }

    if (!game) {
      gameDetailsDialog.close();
      return;
    }

    gameDetailsDialog.open(game, () => {
      if (router.state.auth) {
        return;
      }

      onGameDialogClose?.();
      onGameDialogClose = undefined;

      if (router.state.game) {
        router.update({ game: undefined });
      }
    });
  };

  const pageRenderers: Record<PageType, () => HTMLElement | Promise<HTMLElement>> = {
    home: () => createHomePage({ onGameSelect: selectGame, router }),
    library: () => createLibraryPage({ onGameSelect: selectGame, router }),
    'not-found': () => createNotFoundPage({ router }),
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

  main.append(createHeader({ router, session }), currentPage);
  main.append(createFooter());
  main.append(gameDetailsDialog.element);
  syncGameDialog(router.state);
}
