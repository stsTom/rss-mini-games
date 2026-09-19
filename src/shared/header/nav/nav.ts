import './nav.scss';

const NAV_ITEMS = ['home', 'library', 'tournaments', 'community'];

export function createNav(): HTMLElement {
  const nav = document.createElement('nav');
  nav.dataset.headerVisibility = 'desktop';

  for (const id of NAV_ITEMS) {
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = id.charAt(0).toUpperCase() + id.slice(1);
    nav.append(link);
  }

  return nav;
}
