import './nav.scss';
import { HEADER_VISIBILITY } from '../../dataset-values.js';
import {
  buildUrl,
  isModifiedClick,
  type PageType,
  type RouteState,
  type Router,
} from '../../../../services/router.js';

const NAV_ITEMS = ['home', 'library', 'tournaments', 'community'];
const SPA_PAGES = new Set<string>(['home', 'library'] satisfies PageType[]);

export interface NavOptions {
  hasVisibility?: boolean;
  router: Router;
}

function isSpaPage(id: string): id is PageType {
  return SPA_PAGES.has(id);
}

export function createNav({ hasVisibility = true, router }: NavOptions): HTMLElement {
  const nav = document.createElement('nav');
  if (hasVisibility) {
    nav.dataset.headerVisibility = HEADER_VISIBILITY.desktop;
  }

  const navLinks = new Map<PageType, HTMLAnchorElement>();

  for (const id of NAV_ITEMS) {
    const label = id.charAt(0).toUpperCase() + id.slice(1);
    const link = document.createElement('a');
    link.href = '/';
    link.textContent = label;
    link.dataset.text = label;

    if (isSpaPage(id)) {
      navLinks.set(id, link);
      link.href = buildUrl({ page: id });
      link.addEventListener('click', (event) => {
        if (isModifiedClick(event)) {
          return;
        }

        event.preventDefault();
        router.goTo(id);
      });
    }

    nav.append(link);
  }

  const markActive = ({ page }: RouteState): void => {
    for (const [id, link] of navLinks) {
      link.ariaCurrent = id === page ? 'true' : 'false';
    }
  };

  markActive(router.state);
  router.subscribe(markActive);

  return nav;
}
