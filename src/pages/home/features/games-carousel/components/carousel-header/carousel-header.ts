import './carousel-header.scss';

export function createGamesCarouselHeader(): HTMLElement {
  const header = document.createElement('div');
  header.classList.add('games-carousel-header');

  const titleGroup = document.createElement('div');
  titleGroup.classList.add('games-carousel-header-title');

  const accentBar = document.createElement('span');
  accentBar.classList.add('games-carousel-header-accent');

  const heading = document.createElement('h2');
  heading.textContent = 'New Games';

  titleGroup.append(accentBar, heading);

  const previousButton = document.createElement('button');
  previousButton.type = 'button';
  previousButton.textContent = '<';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.textContent = '>';

  const controls = document.createElement('div');
  controls.classList.add('games-carousel-header-controls');
  controls.append(previousButton, nextButton);

  header.append(titleGroup, controls);

  return header;
}
