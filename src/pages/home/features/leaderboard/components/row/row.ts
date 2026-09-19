import './row.scss';
import { createPlayerCell } from '../player-cell/player-cell.js';
import type { LeaderboardEntry } from '../../interfaces.js';

export function createLeaderboardRow(entry: LeaderboardEntry): HTMLElement {
  const row = document.createElement('div');
  row.classList.add('leaderboard-row');

  const rank = document.createElement('div');
  rank.classList.add('leaderboard-cell', 'leaderboard-cell-rank');
  rank.textContent = String(entry.rank);

  const player = document.createElement('div');
  player.classList.add('leaderboard-cell', 'leaderboard-cell-player');
  player.append(createPlayerCell(entry));

  const gamesPlayed = document.createElement('div');
  gamesPlayed.classList.add('leaderboard-cell', 'leaderboard-cell-games');
  gamesPlayed.dataset.leaderboardVisibility = 'wide-and-up';
  gamesPlayed.textContent = String(entry.gamesPlayed);

  const totalScore = document.createElement('div');
  totalScore.classList.add('leaderboard-cell', 'leaderboard-cell-score');
  totalScore.textContent = String(entry.totalScore);

  const streak = document.createElement('div');
  streak.classList.add('leaderboard-cell', 'leaderboard-cell-streak');
  streak.textContent = String(entry.streakDays);

  const favoriteGame = document.createElement('div');
  favoriteGame.classList.add('leaderboard-cell', 'leaderboard-cell-favorite-game');
  favoriteGame.dataset.leaderboardVisibility = 'desktop-only';
  favoriteGame.textContent = entry.favoriteGameName;

  row.append(rank, player, gamesPlayed, totalScore, streak, favoriteGame);

  return row;
}
