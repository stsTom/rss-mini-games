import './leaderboard.scss';
import { fetchLeaderboard } from './api/leaderboard-data.js';
import { createLeaderboardRow } from './components/row/row.js';

function createLabelPair(shortText: string, longText: string): HTMLElement[] {
  const short = document.createElement('span');
  short.classList.add('leaderboard-label');
  short.dataset.leaderboardVisibility = 'short-label';
  short.textContent = shortText;

  const long = document.createElement('span');
  long.classList.add('leaderboard-label');
  long.dataset.leaderboardVisibility = 'long-label';
  long.textContent = longText;

  return [short, long];
}

function createHeaderRow(): HTMLElement {
  const headerRow = document.createElement('div');
  headerRow.classList.add('leaderboard-row', 'leaderboard-header-row');

  const rank = document.createElement('div');
  rank.classList.add('leaderboard-cell', 'leaderboard-cell-rank');
  rank.textContent = 'Rank';

  const player = document.createElement('div');
  player.classList.add('leaderboard-cell', 'leaderboard-cell-player');
  player.textContent = 'Player';

  const games = document.createElement('div');
  games.classList.add('leaderboard-cell', 'leaderboard-cell-games');
  games.dataset.leaderboardVisibility = 'wide-and-up';
  games.append(...createLabelPair('Games', 'Games Played'));

  const score = document.createElement('div');
  score.classList.add('leaderboard-cell', 'leaderboard-cell-score');
  score.append(...createLabelPair('Score', 'Total Score'));

  const streak = document.createElement('div');
  streak.classList.add('leaderboard-cell', 'leaderboard-cell-streak');
  streak.textContent = 'Streak';

  const favoriteGame = document.createElement('div');
  favoriteGame.classList.add('leaderboard-cell', 'leaderboard-cell-favorite-game');
  favoriteGame.dataset.leaderboardVisibility = 'desktop-only';
  favoriteGame.textContent = 'Favorite Game';

  headerRow.append(rank, player, games, score, streak, favoriteGame);

  return headerRow;
}

export async function createLeaderboard(): Promise<HTMLElement> {
  const { data, meta } = await fetchLeaderboard();

  const section = document.createElement('section');
  section.classList.add('leaderboard');

  const headingRow = document.createElement('div');
  headingRow.classList.add('leaderboard-heading-row');

  const accentBar = document.createElement('span');
  accentBar.classList.add('leaderboard-accent-bar');

  const heading = document.createElement('h2');
  heading.classList.add('leaderboard-heading');
  heading.textContent = meta.description;

  headingRow.append(accentBar, heading);

  const table = document.createElement('div');
  table.classList.add('leaderboard-table');
  table.append(createHeaderRow(), ...data.map((entry) => createLeaderboardRow(entry)));

  section.append(headingRow, table);

  return section;
}
