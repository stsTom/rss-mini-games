import './library.scss';
import { createLibraryHeader } from './features/library-header/library-header.js';
import { createGamesSection } from './features/games-section/games-section.js';

export function createLibraryPage(): HTMLElement {
  const page = document.createElement('div');
  page.classList.add('library');
  page.append(createLibraryHeader(), createGamesSection());

  return page;
}
