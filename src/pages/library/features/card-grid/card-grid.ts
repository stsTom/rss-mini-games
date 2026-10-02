import './card-grid.scss';
import { createLibraryCard } from './components/library-card/library-card.js';
import { fetchGames, type FetchGamesRequestOptions } from '../../../../shared/api/games-data.js';
import type { Game } from '../../../../shared/interfaces.js';
import { GAMES_PER_PAGE } from '../../constants.js';

export interface CardGridOptions {
  onGameSelect: (game: Game) => void;
}

const allGames = await fetchGames({ featured: false } as FetchGamesRequestOptions);

export const GAMES_COUNT = allGames.length;

export async function createCardGrid({ onGameSelect }: CardGridOptions): Promise<HTMLElement> {
  const games = allGames.slice(0, GAMES_PER_PAGE);

  const grid = document.createElement('div');
  grid.classList.add('card-grid');
  grid.append(...games.map((game) => createLibraryCard(game, () => onGameSelect(game))));

  return grid;
}
