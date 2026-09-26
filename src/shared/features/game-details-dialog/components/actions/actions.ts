import './actions.scss';
import { GLYPH_HEART, GLYPH_HEART_OUTLINE } from '../../constants.js';

const FAVORITE_LABEL = 'Add to Favorites';

export function createGameDetailsActions(): HTMLElement {
  const actions = document.createElement('div');
  actions.classList.add('game-details-actions');

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.classList.add('game-details-action', 'game-details-action--play');
  playButton.textContent = 'Play Now';

  const glyph = document.createElement('span');
  glyph.textContent = GLYPH_HEART_OUTLINE;
  glyph.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.classList.add('game-details-action-label');
  label.textContent = FAVORITE_LABEL;

  const favoriteButton = document.createElement('button');
  favoriteButton.type = 'button';
  favoriteButton.classList.add('game-details-action', 'game-details-action--favorite');
  favoriteButton.setAttribute('aria-label', FAVORITE_LABEL);
  favoriteButton.setAttribute('aria-pressed', 'false');
  favoriteButton.append(glyph, label);
  favoriteButton.addEventListener('click', () => {
    const isActive = favoriteButton.classList.toggle('is-active');
    favoriteButton.setAttribute('aria-pressed', String(isActive));
    glyph.textContent = isActive ? GLYPH_HEART : GLYPH_HEART_OUTLINE;
  });

  actions.append(playButton, favoriteButton);

  return actions;
}
