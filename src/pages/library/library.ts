import './library.scss';
import { createLibraryHeader } from './features/library-header/library-header.js';
import { createGamesSection } from './features/games-section/games-section.js';
import { createCardGrid, type CardGridOptions } from './features/card-grid/card-grid.js';
import { createPagination } from './features/pagination/pagination.js';
import { CATEGORIES, DEFAULT_CATEGORY } from './constants.js';
import type { RouteState, Router } from '../../shared/services/router.js';

export interface LibraryPageOptions extends CardGridOptions {
  router: Router;
}

function resolveCategory(category: string | undefined): string {
  return category && CATEGORIES.some(({ value }) => value === category)
    ? category
    : DEFAULT_CATEGORY;
}

export async function createLibraryPage({
  onGameSelect,
  router,
}: LibraryPageOptions): Promise<HTMLElement> {
  const cardGrid = createCardGrid({ onGameSelect });
  const gamesSection = createGamesSection({
    onCategoryChange: (category) =>
      router.update({ category: category === DEFAULT_CATEGORY ? undefined : category }),
  });

  const applyState = (state: RouteState): void => {
    const category = resolveCategory(state.category);
    gamesSection.setCategory(category);
    cardGrid.load({ category });
  };

  applyState(router.state);
  const unsubscribe = router.subscribe((state, previous) => {
    if (state.page !== 'library') {
      unsubscribe();
      return;
    }

    if (state.category !== previous.category) {
      applyState(state);
    }
  });

  const page = document.createElement('div');
  page.classList.add('library');
  page.append(createLibraryHeader(), gamesSection.element, cardGrid.element, createPagination());

  return page;
}
