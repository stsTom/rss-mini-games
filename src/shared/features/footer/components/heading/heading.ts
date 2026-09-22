import './heading.scss';

export function createFooterHeading(): HTMLElement {
  const heading = document.createElement('h2');
  heading.textContent = 'MiniGames';

  return heading;
}
