const NAV_ITEMS = ['Home', 'Library', 'Tournaments', 'Community'];

export function createNav(): HTMLElement {
  const nav = document.createElement('nav');
  nav.dataset.headerVisibility = 'desktop';

  for (const label of NAV_ITEMS) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = label;
    nav.append(link);
  }

  return nav;
}
