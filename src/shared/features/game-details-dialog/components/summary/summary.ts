import './summary.scss';
import { GLYPH_HEART, GLYPH_STAR } from '../../constants.js';
import { formatCompactCount } from '../../utils/format.js';
import type { GameDetails } from '../../interfaces.js';

function createRatingItem(glyph: string, value: string): HTMLElement {
  const item = document.createElement('span');
  item.classList.add('game-details-summary-item');

  const glyphElement = document.createElement('span');
  glyphElement.textContent = glyph;
  glyphElement.setAttribute('aria-hidden', 'true');

  const valueElement = document.createElement('span');
  valueElement.textContent = value;

  item.append(glyphElement, valueElement);
  return item;
}

export function createGameDetailsSummary(game: GameDetails): HTMLElement {
  const summary = document.createElement('div');
  summary.classList.add('game-details-summary');

  const title = document.createElement('h2');
  title.classList.add('game-details-summary-title');
  title.textContent = game.name;

  const ratings = document.createElement('div');
  ratings.classList.add('game-details-summary-ratings');
  ratings.append(
    createRatingItem(GLYPH_STAR, String(game.rating)),
    createRatingItem(GLYPH_HEART, formatCompactCount(game.likesCount))
  );

  summary.append(title, ratings);

  return summary;
}
