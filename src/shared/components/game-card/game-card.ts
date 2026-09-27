import './game-card.scss';
import type { Game } from '../../interfaces.js';

const LIKES_ABBREVIATION_THRESHOLD = 1000;
const LIKES_FRACTION_DIGITS = 1;
const LIKES_SUFFIX = 'k';

function formatLikes(count: number): string {
  if (count < LIKES_ABBREVIATION_THRESHOLD) {
    return String(count);
  }

  return `${(count / LIKES_ABBREVIATION_THRESHOLD).toFixed(LIKES_FRACTION_DIGITS)}${LIKES_SUFFIX}`;
}

function createMetaItem(itemClass: string, icon: 'star' | 'heart', value: string): HTMLElement {
  const item = document.createElement('span');
  item.classList.add(itemClass);

  const iconElement = document.createElement('span');
  iconElement.classList.add('game-card-icon', `game-card-icon--${icon}`);
  iconElement.setAttribute('aria-hidden', 'true');

  const valueElement = document.createElement('span');
  valueElement.textContent = value;

  item.append(iconElement, valueElement);
  return item;
}

export function createGameCard(game: Game): HTMLElement {
  const card = document.createElement('div');
  card.classList.add('game-card');

  const heading = document.createElement('h3');
  heading.classList.add('game-card-title');
  heading.textContent = game.name;

  const meta = document.createElement('div');
  meta.classList.add('game-card-meta');

  const rating = createMetaItem('game-card-rating', 'star', String(game.rating));
  const likes = createMetaItem('game-card-likes', 'heart', formatLikes(game.likesCount));

  meta.append(rating, likes);
  card.append(heading, meta);

  return card;
}
