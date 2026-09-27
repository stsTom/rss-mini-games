import './library-card.scss';
import { createGameCard } from '../../../../../../shared/components/game-card/game-card.js';
import type { Game } from '../../../../../../shared/interfaces.js';

const PRICE_FREE = 'Free';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createHeading(card: HTMLElement, game: Game): HTMLElement | undefined {
  const title = card.querySelector('.game-card-title');
  if (!title) {
    return;
  }

  const heading = document.createElement('div');
  heading.classList.add('library-card-heading');

  const titleGroup = document.createElement('div');
  titleGroup.classList.add('library-card-title-group');

  const category = document.createElement('span');
  category.classList.add('library-card-category');
  category.textContent = capitalize(game.category);

  const price = document.createElement('span');
  price.classList.add('library-card-price');
  price.textContent = game.price;
  price.classList.toggle('library-card-price--free', game.price === PRICE_FREE);

  title.replaceWith(heading);
  titleGroup.append(title, category);
  heading.append(titleGroup, price);
  return heading;
}

function createFooter(card: HTMLElement, onDetails: () => void): void {
  const meta = card.querySelector('.game-card-meta');
  if (!meta) {
    return;
  }

  const footer = document.createElement('div');
  footer.classList.add('library-card-footer');

  const details = document.createElement('button');
  details.type = 'button';
  details.classList.add('library-card-details');
  details.textContent = 'Details';
  details.addEventListener('click', onDetails);

  meta.replaceWith(footer);
  footer.append(meta, details);
}

export function createLibraryCard(game: Game, onDetails: () => void): HTMLElement {
  const card = createGameCard(game);
  card.classList.add('library-card');

  const image = document.createElement('img');
  image.classList.add('library-card-image');
  image.src = game.cardImage;
  image.alt = game.name;
  image.loading = 'lazy';

  const description = document.createElement('p');
  description.classList.add('library-card-description');
  description.textContent = game.shortDescription;

  createHeading(card, game)?.after(description);
  card.prepend(image);
  createFooter(card, onDetails);

  return card;
}
