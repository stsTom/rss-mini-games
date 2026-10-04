import './library.scss';
import { createLibraryHeader } from './features/library-header/library-header.js';
import { createGamesSection } from './features/games-section/games-section.js';
import { createCardGrid, type CardGridOptions } from './features/card-grid/card-grid.js';
import { createPagination } from './features/pagination/pagination.js';
import { CATEGORIES, DEFAULT_CATEGORY, DEFAULT_SORT, SORT_OPTIONS } from './constants.js';
import type { RouteState, Router } from '../../shared/services/router.js';

export interface LibraryPageOptions extends CardGridOptions {
  router: Router;
}

function resolveOption(
  options: { value: string }[],
  selected: string | undefined,
  fallback: string
): string {
  return selected && options.some(({ value }) => value === selected) ? selected : fallback;
}

export async function createLibraryPage({
  onGameSelect,
  router,
}: LibraryPageOptions): Promise<HTMLElement> {
  const cardGrid = createCardGrid({ onGameSelect });
  const gamesSection = createGamesSection({
    onCategoryChange: (category) =>
      router.update({ category: category === DEFAULT_CATEGORY ? undefined : category }),
    onSortChange: (sort) => router.update({ sort: sort === DEFAULT_SORT ? undefined : sort }),
  });

  const applyState = (state: RouteState): void => {
    const category = resolveOption(CATEGORIES, state.category, DEFAULT_CATEGORY);
    const sort = resolveOption(SORT_OPTIONS, state.sort, DEFAULT_SORT);
    gamesSection.setCategory(category);
    gamesSection.setSort(sort);
    cardGrid.load({ category, sort });
  };

  applyState(router.state);
  const unsubscribe = router.subscribe((state, previous) => {
    if (state.page !== 'library') {
      unsubscribe();
      return;
    }

    if (state.category !== previous.category || state.sort !== previous.sort) {
      applyState(state);
    }
  });

  const page = document.createElement('div');
  page.classList.add('library');
  page.append(createLibraryHeader(), gamesSection.element, cardGrid.element, createPagination());

  return page;
}
