import './card-grid.scss';
import { createLibraryCard } from './components/library-card/library-card.js';
import { fetchGames } from '../../../../shared/api/games-data.js';
import type { Game, FetchGamesRequestOptions } from '../../../../shared/interfaces.js';
import { GAMES_PER_PAGE } from '../../constants.js';
import { createCardSkeleton } from '../../../../shared/components/card-skeleton/card-skeleton.js';

export interface CardGridOptions {
  onGameSelect: (game: Game) => void;
}

export function createCardGrid({ onGameSelect }: CardGridOptions): HTMLElement {
  const grid = document.createElement('div');
  grid.classList.add('card-grid');
  grid.ariaBusy = 'true';

  for (let game = 0; game < GAMES_PER_PAGE; game++) {
    const cardSkeleton = createCardSkeleton();
    cardSkeleton.classList.add('library-card');

    grid.append(cardSkeleton);
  }

  async function loadGames() {
    try {
      const allGames = await fetchGames({ featured: false } as FetchGamesRequestOptions);
      const games = allGames.slice(0, GAMES_PER_PAGE);
      grid.replaceChildren(
        ...games.map((game) => createLibraryCard(game, () => onGameSelect(game)))
      );
    } catch {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Oops, smth went wrong. Please, try again'; // replace with an error layout

      grid.replaceChildren(errorDiv);
    } finally {
      grid.removeAttribute('aria-busy');
    }
  }

  void loadGames();

  return grid;
}
