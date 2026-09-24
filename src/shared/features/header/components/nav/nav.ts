import './nav.scss';

const NAV_ITEMS = ['home', 'library', 'tournaments', 'community'];

export function createNav(hasVisibility = true): HTMLElement {
  const nav = document.createElement('nav');
  if (hasVisibility) {
    nav.dataset.headerVisibility = 'desktop';
  }

  for (const id of NAV_ITEMS) {
    const label = id.charAt(0).toUpperCase() + id.slice(1);
    const link = document.createElement('a');
    link.textContent = label;
    link.dataset.text = label;
    link.href = '/';
    nav.append(link);
  }

  return nav;
}
