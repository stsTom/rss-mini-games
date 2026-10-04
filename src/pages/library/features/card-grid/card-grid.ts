import './card-grid.scss';
import { createLibraryCard } from './components/library-card/library-card.js';
import { fetchGames } from '../../../../shared/api/games-data.js';
import type { Game, FetchGamesRequestOptions } from '../../../../shared/interfaces.js';
import { GAMES_PER_PAGE } from '../../constants.js';
import { createCardSkeleton } from '../../../../shared/components/card-skeleton/card-skeleton.js';
import { createErrorPlaceholder } from '../../../../shared/components/error-layout/error-layout.js';
import { createEmptyBanner } from '../../../../shared/components/empty-banner/emty-banner.js';

export interface CardGridOptions {
  onGameSelect: (game: Game) => void;
}

export function createCardGrid({ onGameSelect }: CardGridOptions): HTMLElement {
  const grid = document.createElement('div');
  grid.classList.add('card-grid');

  function showSkeletons() {
    grid.ariaBusy = 'true';
    grid.replaceChildren(
      ...Array.from({ length: GAMES_PER_PAGE }, () => {
        const cardSkeleton = createCardSkeleton();
        cardSkeleton.classList.add('library-card');
        return cardSkeleton;
      })
    );
  }

  async function loadGames() {
    showSkeletons();

    try {
      const allGames = await fetchGames({ featured: false } as FetchGamesRequestOptions);
      const games = allGames.slice(0, GAMES_PER_PAGE);

      if (games.length === 0) {
        grid.replaceChildren(createEmptyBanner());
        return;
      }

      grid.replaceChildren(
        ...games.map((game) => createLibraryCard(game, () => onGameSelect(game)))
      );
    } catch {
      grid.replaceChildren(createErrorPlaceholder(() => void loadGames()));
    } finally {
      grid.removeAttribute('aria-busy');
    }
  }

  void loadGames();

  return grid;
}
