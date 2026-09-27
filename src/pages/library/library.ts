import './library.scss';
import { createLibraryHeader } from './features/library-header/library-header.js';

export function createLibraryPage(): HTMLElement {
  const page = document.createElement('div');
  page.classList.add('library');
  page.append(createLibraryHeader());

  return page;
}
