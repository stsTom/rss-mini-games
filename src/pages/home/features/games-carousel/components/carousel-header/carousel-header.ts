import './carousel-header.scss';

const SVG_NS = 'http://www.w3.org/2000/svg';

function createArrowIcon(direction: 'previous' | 'next'): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', direction === 'previous' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  svg.append(path);
  return svg;
}

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
  previousButton.classList.add(
    'games-carousel-header-control',
    'games-carousel-header-control--prev'
  );
  previousButton.setAttribute('aria-label', 'Previous');
  previousButton.append(createArrowIcon('previous'));

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.classList.add('games-carousel-header-control', 'games-carousel-header-control--next');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.append(createArrowIcon('next'));

  const controls = document.createElement('div');
  controls.classList.add('games-carousel-header-controls');
  controls.append(previousButton, nextButton);

  header.append(titleGroup, controls);

  return header;
}
