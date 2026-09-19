import './text.scss';

export function createHeroText(): HTMLElement {
  const text = document.createElement('p');
  text.textContent =
    'Discover hundreds of curated casual mini-games. Play instantly in your browser — puzzle, match 3, farm, and board classics.';

  return text;
}
