import './browse-library-button.scss';
import {
  buildUrl,
  isModifiedClick,
  type Router,
} from '../../../../../../shared/services/router.js';

interface BrowseLibraryButtonOptions {
  router: Router;
}

export function createBrowseLibraryButton({ router }: BrowseLibraryButtonOptions): HTMLElement {
  const link = document.createElement('a');
  link.href = buildUrl({ page: 'library' });
  link.textContent = 'Browse Library';
  link.addEventListener('click', (event) => {
    if (isModifiedClick(event)) {
      return;
    }

    event.preventDefault();
    router.goTo('library');
  });

  return link;
}
