import './header.scss';

export function createGamesCarouselHeader(): HTMLElement {
  const header = document.createElement('div');
  header.classList.add('games-carousel-header');

  const heading = document.createElement('h2');
  heading.textContent = 'New Games';

  const previousButton = document.createElement('button');
  previousButton.type = 'button';
  previousButton.textContent = 'prev';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.textContent = 'next';

  const controls = document.createElement('div');
  controls.classList.add('games-carousel-header-controls');
  controls.append(previousButton, nextButton);

  header.append(heading, controls);

  return header;
}
