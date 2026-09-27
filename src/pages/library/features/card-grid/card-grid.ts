import './card-grid.scss';
import { createLibraryCard } from './components/library-card/library-card.js';
import { fetchAllGames } from '../../../../shared/api/games-data.js';
import type { Game } from '../../../../shared/interfaces.js';

export interface CardGridOptions {
  onGameSelect: (game: Game) => void;
}

const GAMES_PER_PAGE = 6;

export async function createCardGrid({ onGameSelect }: CardGridOptions): Promise<HTMLElement> {
  const allGames = await fetchAllGames();
  const games = allGames.slice(0, GAMES_PER_PAGE);

  const grid = document.createElement('div');
  grid.classList.add('card-grid');
  grid.append(...games.map((game) => createLibraryCard(game, () => onGameSelect(game))));

  return grid;
}
