import './leaderboard.scss';
import { fetchLeaderboard } from './api/leaderboard-data.js';
import { createLeaderboardRow } from './components/row/row.js';
import { createLeaderboardRowPlaceholder } from './components/row-placeholder/row-placeholder.js';
import { LEADERBOARD_LABEL, LEADERBOARD_VISIBILITY } from './dataset-values.js';
import { createErrorPlaceholder } from '../../../../shared/components/error-layout/error-layout.js';
import { createEmptyBanner } from '../../../../shared/components/empty-banner/emty-banner.js';

const PLACEHOLDER_ROWS_COUNT = 5;

function createLabelPair(shortText: string, longText: string): HTMLElement[] {
  const short = document.createElement('span');
  short.classList.add('leaderboard-label');
  short.dataset.leaderboardVisibility = LEADERBOARD_LABEL.short;
  short.textContent = shortText;

  const long = document.createElement('span');
  long.classList.add('leaderboard-label');
  long.dataset.leaderboardVisibility = LEADERBOARD_LABEL.long;
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
  games.dataset.leaderboardVisibility = LEADERBOARD_VISIBILITY.wideAndUp;
  games.append(...createLabelPair('Games', 'Games Played'));

  const score = document.createElement('div');
  score.classList.add('leaderboard-cell', 'leaderboard-cell-score');
  score.append(...createLabelPair('Score', 'Total Score'));

  const streak = document.createElement('div');
  streak.classList.add('leaderboard-cell', 'leaderboard-cell-streak');
  streak.textContent = 'Streak';

  const favoriteGame = document.createElement('div');
  favoriteGame.classList.add('leaderboard-cell', 'leaderboard-cell-favorite-game');
  favoriteGame.dataset.leaderboardVisibility = LEADERBOARD_VISIBILITY.desktopOnly;
  favoriteGame.textContent = 'Favorite Game';

  headerRow.append(rank, player, games, score, streak, favoriteGame);

  return headerRow;
}

export function createLeaderboard(): HTMLElement {
  const section = document.createElement('section');
  section.classList.add('leaderboard');

  const headingRow = document.createElement('div');
  headingRow.classList.add('leaderboard-heading-row');

  const accentBar = document.createElement('span');
  accentBar.classList.add('leaderboard-accent-bar');

  const heading = document.createElement('h2');
  heading.classList.add('leaderboard-heading');
  heading.textContent = 'Top Players This Week';

  headingRow.append(accentBar, heading);

  const table = document.createElement('div');
  table.classList.add('leaderboard-table');
  table.ariaBusy = 'true';

  function populateLeaderboard() {
    const placeholders = Array.from({ length: PLACEHOLDER_ROWS_COUNT }, (_, index) =>
      createLeaderboardRowPlaceholder(index + 1)
    );

    table.append(createHeaderRow(), ...placeholders);
    section.replaceChildren(headingRow, table);
  }

  async function loadTableData() {
    populateLeaderboard();

    try {
      const { data } = await fetchLeaderboard();

      if (data.length === 0) {
        section.replaceChildren(headingRow, createEmptyBanner());
        return;
      }

      table.replaceChildren(createHeaderRow(), ...data.map((entry) => createLeaderboardRow(entry)));
    } catch {
      section.replaceChildren(createErrorPlaceholder(() => void loadTableData()));
    } finally {
      table.removeAttribute('aria-busy');
    }
  }

  populateLeaderboard();
  void loadTableData();

  return section;
}
