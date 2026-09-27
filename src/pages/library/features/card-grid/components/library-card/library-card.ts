import { createGameCard } from '../../../../../../shared/components/game-card/game-card.js';
import type { Game } from '../../../../../../shared/interfaces.js';

const PRICE_FREE = 'Free';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createTags(game: Game): HTMLElement {
  const tags = document.createElement('div');
  tags.classList.add('library-card-tags');

  const category = document.createElement('span');
  category.classList.add('library-card-category');
  category.textContent = capitalize(game.category);

  const price = document.createElement('span');
  price.classList.add('library-card-price');
  price.textContent = game.price;
  price.classList.toggle('library-card-price--free', game.price === PRICE_FREE);

  tags.append(category, price);
  return tags;
}

export function createLibraryCard(game: Game): HTMLElement {
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

  card.querySelector('.game-card-title')?.after(createTags(game), description);
  card.prepend(image);

  return card;
}
