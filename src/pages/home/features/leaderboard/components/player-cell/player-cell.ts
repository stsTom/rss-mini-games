import './player-cell.scss';
import type { LeaderboardEntry } from '../../interfaces.js';

function deriveInitials(playerName: string): string {
  const first = playerName.charAt(0).toUpperCase();
  const secondUppercase = /[A-Z]/.exec(playerName.slice(1))?.[0] ?? '';

  return `${first}${secondUppercase}`;
}

export function createPlayerCell(entry: LeaderboardEntry): HTMLElement {
  const cell = document.createElement('div');
  cell.classList.add('leaderboard-player-cell');

  const avatar = document.createElement('span');
  avatar.classList.add('leaderboard-player-avatar');
  avatar.textContent = deriveInitials(entry.playerName);

  const name = document.createElement('span');
  name.classList.add('leaderboard-player-name');
  name.textContent = entry.playerName;

  cell.append(avatar, name);

  return cell;
}
