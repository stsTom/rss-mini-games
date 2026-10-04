import '../../styles/global.scss';
import { createHeader } from '../shared/features/header/header.js';
import { createHomePage } from '../pages/home/home.js';
import { createLibraryPage } from '../pages/library/library.js';
import { createFooter } from '../shared/features/footer/footer.js';
import { createGameDetailsDialog } from '../shared/features/game-details-dialog/game-details-dialog.js';
import { createRouter, type PageType } from '../shared/services/router.js';

const main = document.querySelector('main');

if (main) {
  const router = createRouter();
  const gameDetailsDialog = createGameDetailsDialog();

  const pageRenderers: Record<PageType, () => HTMLElement | Promise<HTMLElement>> = {
    home: () => createHomePage({ onGameSelect: gameDetailsDialog.open, router }),
    library: () => createLibraryPage({ onGameSelect: gameDetailsDialog.open }),
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

  main.append(createHeader({ router }), currentPage);
  main.append(createFooter());
  main.append(gameDetailsDialog.element);
}
