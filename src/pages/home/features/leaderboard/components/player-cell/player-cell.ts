import './player-cell.scss';
import type { LeaderboardEntry } from '../../interfaces.js';

function deriveInitials(playerName: string): string {
  const segments = playerName.split(/[^a-zA-Z0-9]+/).filter(Boolean);

  return segments
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join('');
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
