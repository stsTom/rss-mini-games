import './card-info.scss';
import type { Game } from '../games-data/games-data.js';

export function createCardInfo(game: Game): HTMLElement {
  const footer = document.createElement('div');
  footer.classList.add('games-carousel-card-info');

  const heading = document.createElement('h3');
  heading.textContent = game.name;

  const meta = document.createElement('div');
  meta.classList.add('games-carousel-card-meta');

  const rating = document.createElement('span');
  rating.classList.add('games-carousel-card-rating');
  rating.textContent = String(game.rating);

  const likes = document.createElement('span');
  likes.classList.add('games-carousel-card-likes');
  likes.textContent = `${game.likesCount} likes`;

  meta.append(rating, likes);
  footer.append(heading, meta);

  return footer;
}
