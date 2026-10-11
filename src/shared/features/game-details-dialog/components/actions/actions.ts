import './actions.scss';
import { GLYPH_HEART, GLYPH_HEART_OUTLINE } from '../../constants.js';
import { toggleGameFavorite } from '../../../../api/games-data.js';
import type { GuardAction } from '../../../../services/actions-guard.js';
import type { AppSession } from '../../../../services/app-session.js';

const FAVORITE_LABEL = 'Add to Favorites';

export interface GameDetailsActionsOptions {
  guardAction: GuardAction;
  session: AppSession;
  gameSlug: string;
  price?: string | undefined;
}

export function createGameDetailsActions({
  guardAction,
  session,
  gameSlug,
  price,
}: GameDetailsActionsOptions): HTMLElement {
  const actions = document.createElement('div');
  actions.classList.add('game-details-actions');

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.classList.add('game-details-action', 'game-details-action--play');
  playButton.textContent = price === 'Free' ? 'Play Now' : `${price}`;
  playButton.addEventListener(
    'click',
    guardAction(() => {})
  );

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
  favoriteButton.addEventListener(
    'click',
    guardAction(async () => {
      const userEmail = session.current?.email;
      if (!userEmail || favoriteButton.disabled) {
        return;
      }

      favoriteButton.disabled = true;
      try {
        await toggleGameFavorite({ gameSlug, userEmail });

        const isActive = favoriteButton.classList.toggle('is-active');
        favoriteButton.setAttribute('aria-pressed', String(isActive));
        glyph.textContent = isActive ? GLYPH_HEART : GLYPH_HEART_OUTLINE;
      } catch {
        console.log('Could not update favorites. Please try again.'); // add snackbar
      } finally {
        favoriteButton.disabled = false;
      }
    })
  );

  actions.append(playButton, favoriteButton);

  return actions;
}
