import './row.scss';
import { createPlayerCell } from '../player-cell/player-cell.js';
import type { LeaderboardEntry } from '../../interfaces.js';
import { LEADERBOARD_VISIBILITY, SCORE_VISIBILITY } from '../../dataset-values.js';

const TOP_RANKS_VISIBLE_BELOW_DESKTOP = 3;

function formatScoreAbbreviated(score: number): string {
  if (score < 1000) {
    return String(score);
  }

  return `${(Math.floor(score / 100) / 10).toFixed(1)}K`;
}

function formatScoreFull(score: number): string {
  return score.toLocaleString('en-US');
}

function createScoreValue(score: number): HTMLElement[] {
  const abbreviated = document.createElement('span');
  abbreviated.classList.add('leaderboard-score-value');
  abbreviated.dataset.scoreVisibility = SCORE_VISIBILITY.abbreviated;
  abbreviated.textContent = formatScoreAbbreviated(score);

  const full = document.createElement('span');
  full.classList.add('leaderboard-score-value');
  full.dataset.scoreVisibility = SCORE_VISIBILITY.full;
  full.textContent = formatScoreFull(score);

  return [abbreviated, full];
}

export function createLeaderboardRow(entry: LeaderboardEntry): HTMLElement {
  const row = document.createElement('div');
  row.classList.add('leaderboard-row');

  if (entry.rank > TOP_RANKS_VISIBLE_BELOW_DESKTOP) {
    row.dataset.leaderboardVisibility = LEADERBOARD_VISIBILITY.desktopOnly;
  }

  const rank = document.createElement('div');
  rank.classList.add('leaderboard-cell', 'leaderboard-cell-rank');
  rank.textContent = String(entry.rank);

  const player = document.createElement('div');
  player.classList.add('leaderboard-cell', 'leaderboard-cell-player');
  player.append(createPlayerCell(entry));

  const gamesPlayed = document.createElement('div');
  gamesPlayed.classList.add('leaderboard-cell', 'leaderboard-cell-games');
  gamesPlayed.dataset.leaderboardVisibility = LEADERBOARD_VISIBILITY.wideAndUp;
  gamesPlayed.textContent = String(entry.gamesPlayed);

  const totalScore = document.createElement('div');
  totalScore.classList.add('leaderboard-cell', 'leaderboard-cell-score');
  totalScore.append(...createScoreValue(entry.totalScore));

  const streak = document.createElement('div');
  streak.classList.add('leaderboard-cell', 'leaderboard-cell-streak');
  streak.textContent = `\u{1F525} ${entry.streakDays}d`;

  const favoriteGame = document.createElement('div');
  favoriteGame.classList.add('leaderboard-cell', 'leaderboard-cell-favorite-game');
  favoriteGame.dataset.leaderboardVisibility = LEADERBOARD_VISIBILITY.desktopOnly;
  favoriteGame.textContent = entry.favoriteGameName;

  row.append(rank, player, gamesPlayed, totalScore, streak, favoriteGame);

  return row;
}
