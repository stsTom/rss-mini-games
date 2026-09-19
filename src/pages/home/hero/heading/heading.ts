import './heading.scss';

export function createHeroHeading(): HTMLElement {
  const heading = document.createElement('h2');
  heading.textContent = 'Take a Short Break & Have Fun';

  return heading;
}
