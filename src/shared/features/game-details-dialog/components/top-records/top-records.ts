import './top-records.scss';
import { GLYPH_TROPHY, MEDALS } from '../../constants.js';
import { formatScore, formatTimeAgo } from '../../utils/format.js';
import type { GameRecord } from '../../../../interfaces.js';

function createRecordRow(record: GameRecord, medal: string): HTMLElement {
  const row = document.createElement('li');
  row.classList.add('game-details-record');

  const player = document.createElement('span');
  player.classList.add('game-details-record-player');

  const medalElement = document.createElement('span');
  medalElement.classList.add('game-details-record-medal');
  medalElement.textContent = medal;
  medalElement.setAttribute('aria-hidden', 'true');

  const name = document.createElement('span');
  name.classList.add('game-details-record-name');
  name.textContent = record.playerName;
  player.append(medalElement, name);

  const result = document.createElement('span');
  result.classList.add('game-details-record-result');

  const score = document.createElement('span');
  score.classList.add('game-details-record-score');
  score.textContent = formatScore(record.score);

  const time = document.createElement('time');
  time.classList.add('game-details-record-time');
  time.dateTime = record.achievedAt;
  time.textContent = formatTimeAgo(record.achievedAt);
  result.append(score, time);

  row.append(player, result);
  return row;
}

export function createGameDetailsTopRecords(records: GameRecord[]): HTMLElement {
  const section = document.createElement('section');
  section.classList.add('game-details-section');

  const heading = document.createElement('h3');
  heading.classList.add('game-details-section-heading');

  const glyph = document.createElement('span');
  glyph.textContent = GLYPH_TROPHY;
  glyph.setAttribute('aria-hidden', 'true');
  heading.append(glyph, 'Top Records');

  const list = document.createElement('ol');
  list.classList.add('game-details-records');
  list.append(
    ...records
      .toSorted((first, second) => first.position - second.position)
      .map((record, index) => createRecordRow(record, MEDALS[index] ?? ''))
  );

  section.append(heading, list);

  return section;
}
