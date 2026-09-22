import './heading.scss';

export function createDeveloperCtaHeading(): HTMLElement {
  const heading = document.createElement('h2');
  heading.textContent = 'Are You a Game Developer?';

  return heading;
}
