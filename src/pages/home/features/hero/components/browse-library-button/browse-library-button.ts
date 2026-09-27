import './browse-library-button.scss';
import type { Router } from '../../../../../../shared/services/router.js';

interface BrowseLibraryButtonOptions {
  router: Router;
}

export function createBrowseLibraryButton({ router }: BrowseLibraryButtonOptions): HTMLElement {
  const link = document.createElement('a');
  link.textContent = 'Browse Library';
  link.addEventListener('click', () => {
    router.onPageChange('library');
  });

  return link;
}
