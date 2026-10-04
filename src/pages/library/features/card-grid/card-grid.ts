import './card-grid.scss';
import { createLibraryCard } from './components/library-card/library-card.js';
import { fetchGamesPage } from '../../../../shared/api/games-data.js';
import type {
  Game,
  FetchGamesRequestOptions,
  GamesPageMeta,
} from '../../../../shared/interfaces.js';
import { GAMES_PER_PAGE } from '../../constants.js';
import { createCardSkeleton } from '../../../../shared/components/card-skeleton/card-skeleton.js';
import { createErrorPlaceholder } from '../../../../shared/components/error-layout/error-layout.js';
import { createEmptyBanner } from '../../../../shared/components/empty-banner/emty-banner.js';

export interface CardGridOptions {
  onGameSelect: (game: Game) => void;
}

export interface CardGridLoadOptions {
  onLoad?: (meta: GamesPageMeta) => void;
}

export interface CardGrid {
  element: HTMLElement;
  load: (options: FetchGamesRequestOptions) => void;
}

export function createCardGrid({
  onGameSelect,
  onLoad,
}: CardGridOptions & CardGridLoadOptions): CardGrid {
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

  let latestRequest = 0;

  async function loadGames(options: FetchGamesRequestOptions) {
    latestRequest += 1;
    const request = latestRequest;
    showSkeletons();

    try {
      const { data: games, meta } = await fetchGamesPage({ ...options, limit: GAMES_PER_PAGE });

      if (request !== latestRequest) {
        return;
      }

      onLoad?.(meta);

      if (games.length === 0) {
        grid.replaceChildren(createEmptyBanner());
        return;
      }

      grid.replaceChildren(
        ...games.map((game) => createLibraryCard(game, () => onGameSelect(game)))
      );
    } catch {
      if (request === latestRequest) {
        grid.replaceChildren(createErrorPlaceholder(() => void loadGames(options)));
      }
    } finally {
      if (request === latestRequest) {
        grid.removeAttribute('aria-busy');
      }
    }
  }

  return { element: grid, load: (options) => void loadGames(options) };
}
