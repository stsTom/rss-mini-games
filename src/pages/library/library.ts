import './library.scss';
import { createLibraryHeader } from './features/library-header/library-header.js';
import { createGamesSection } from './features/games-section/games-section.js';
import { createCardGrid, type CardGridOptions } from './features/card-grid/card-grid.js';
import { createPagination } from './features/pagination/pagination.js';

export async function createLibraryPage(options: CardGridOptions): Promise<HTMLElement> {
  const page = document.createElement('div');
  page.classList.add('library');
  page.append(
    createLibraryHeader(),
    createGamesSection(),
    await createCardGrid(options),
    createPagination()
  );

  return page;
}
