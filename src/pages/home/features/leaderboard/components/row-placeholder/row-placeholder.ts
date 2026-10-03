import './row-placeholder.scss';
import { LEADERBOARD_VISIBILITY } from '../../dataset-values.js';

const TOP_ROWS_VISIBLE_BELOW_DESKTOP = 3;

function createBar(modifier: string): HTMLElement {
  const bar = document.createElement('span');
  bar.classList.add('leaderboard-placeholder-bar', `leaderboard-placeholder-bar-${modifier}`);

  return bar;
}

function createCell(cellClass: string, content: HTMLElement, visibility?: string): HTMLElement {
  const cell = document.createElement('div');
  cell.classList.add('leaderboard-cell', cellClass);

  if (visibility) {
    cell.dataset.leaderboardVisibility = visibility;
  }

  cell.append(content);

  return cell;
}

export function createLeaderboardRowPlaceholder(position: number): HTMLElement {
  const row = document.createElement('div');
  row.classList.add('leaderboard-row', 'leaderboard-row-placeholder');
  row.setAttribute('aria-hidden', 'true');

  if (position > TOP_ROWS_VISIBLE_BELOW_DESKTOP) {
    row.dataset.leaderboardVisibility = LEADERBOARD_VISIBILITY.desktopOnly;
  }

  const playerCell = document.createElement('div');
  playerCell.classList.add('leaderboard-player-cell');
  playerCell.append(createBar('avatar'), createBar('name'));

  row.append(
    createCell('leaderboard-cell-rank', createBar('short')),
    createCell('leaderboard-cell-player', playerCell),
    createCell('leaderboard-cell-games', createBar('short'), LEADERBOARD_VISIBILITY.wideAndUp),
    createCell('leaderboard-cell-score', createBar('medium')),
    createCell('leaderboard-cell-streak', createBar('medium')),
    createCell(
      'leaderboard-cell-favorite-game',
      createBar('long'),
      LEADERBOARD_VISIBILITY.desktopOnly
    )
  );

  return row;
}
