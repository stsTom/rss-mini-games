import './nav.scss';
import { HEADER_VISIBILITY } from '../../dataset-values.js';
import type { PageType } from '../../../../services/router.js';

const NAV_ITEMS = ['home', 'library', 'tournaments', 'community'];
const SPA_PAGES = new Set<string>(['home', 'library'] satisfies PageType[]);

export interface NavOptions {
  hasVisibility?: boolean;
  onPageChange: (page: PageType) => void;
}

function isSpaPage(id: string): id is PageType {
  return SPA_PAGES.has(id);
}

export function createNav({ hasVisibility = true, onPageChange }: NavOptions): HTMLElement {
  const nav = document.createElement('nav');
  if (hasVisibility) {
    nav.dataset.headerVisibility = HEADER_VISIBILITY.desktop;
  }

  for (const id of NAV_ITEMS) {
    const label = id.charAt(0).toUpperCase() + id.slice(1);
    const link = document.createElement('a');
    link.href = '/';
    link.textContent = label;
    link.dataset.text = label;

    if (isSpaPage(id)) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        onPageChange(id);
      });
    }

    nav.append(link);
  }

  return nav;
}
