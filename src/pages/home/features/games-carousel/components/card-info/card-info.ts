import './card-info.scss';
import type { Game } from '../../../../../../shared/interfaces.js';

function formatLikes(count: number): string {
  if (count < 1000) {
    return String(count);
  }

  return `${(count / 1000).toFixed(1)}k`;
}

function createMetaItem(itemClass: string, icon: 'star' | 'heart', value: string): HTMLElement {
  const item = document.createElement('span');
  item.classList.add(itemClass);

  const iconElement = document.createElement('span');
  iconElement.classList.add('games-carousel-card-icon', `games-carousel-card-icon--${icon}`);
  iconElement.setAttribute('aria-hidden', 'true');

  const valueElement = document.createElement('span');
  valueElement.textContent = value;

  item.append(iconElement, valueElement);
  return item;
}

export function createCardInfo(game: Game): HTMLElement {
  const footer = document.createElement('div');
  footer.classList.add('games-carousel-card-info');

  const heading = document.createElement('h3');
  heading.textContent = game.name;

  const meta = document.createElement('div');
  meta.classList.add('games-carousel-card-meta');

  const rating = createMetaItem('games-carousel-card-rating', 'star', String(game.rating));
  const likes = createMetaItem('games-carousel-card-likes', 'heart', formatLikes(game.likesCount));

  meta.append(rating, likes);
  footer.append(heading, meta);

  return footer;
}
