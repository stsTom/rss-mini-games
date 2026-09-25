import './hero.scss';
import { GLYPH_CLOSE } from '../../constants.js';
import type { GameDetails } from '../../interfaces.js';

export interface GameDetailsHeroOptions {
  game: GameDetails;
  onClose: () => void;
}

export function createGameDetailsHero({ game, onClose }: GameDetailsHeroOptions): HTMLElement {
  const hero = document.createElement('div');
  hero.classList.add('game-details-hero');
  hero.style.backgroundImage = `url("${game.heroImage}")`;
  hero.setAttribute('role', 'img');
  hero.setAttribute('aria-label', game.name);

  const glyph = document.createElement('span');
  glyph.textContent = GLYPH_CLOSE;
  glyph.setAttribute('aria-hidden', 'true');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('game-details-hero-close');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.append(glyph);
  closeButton.addEventListener('click', onClose);

  hero.append(closeButton);

  return hero;
}
