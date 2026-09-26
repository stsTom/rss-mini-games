import {
  COMPACT_COUNT_SUFFIX,
  DAYS_PER_MONTH,
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  LIKES_ABBREVIATION_THRESHOLD,
  MILLISECONDS_PER_SECOND,
  MINUTES_PER_HOUR,
  RELATIVE_TIME_LOCALE,
  SCORE_LOCALE,
  SCORE_SUFFIX,
  SECONDS_PER_MINUTE,
} from '../constants.js';

export function formatCompactCount(count: number): string {
  if (count < LIKES_ABBREVIATION_THRESHOLD) {
    return String(count);
  }

  return `${(count / LIKES_ABBREVIATION_THRESHOLD).toFixed(1)}${COMPACT_COUNT_SUFFIX}`;
}

export function formatScore(score: number): string {
  return `${score.toLocaleString(SCORE_LOCALE)} ${SCORE_SUFFIX}`;
}

const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const SECONDS_PER_DAY = SECONDS_PER_HOUR * HOURS_PER_DAY;

const TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['month', SECONDS_PER_DAY * DAYS_PER_MONTH],
  ['week', SECONDS_PER_DAY * DAYS_PER_WEEK],
  ['day', SECONDS_PER_DAY],
  ['hour', SECONDS_PER_HOUR],
  ['minute', SECONDS_PER_MINUTE],
];

const relativeTimeFormat = new Intl.RelativeTimeFormat(RELATIVE_TIME_LOCALE, { numeric: 'always' });

export function formatTimeAgo(isoDate: string, now = Date.now()): string {
  const elapsedSeconds = Math.floor((now - Date.parse(isoDate)) / MILLISECONDS_PER_SECOND);
  const [unit, unitSeconds] = TIME_UNITS.find(([, seconds]) => elapsedSeconds >= seconds) ?? [
    'second',
    1,
  ];

  return relativeTimeFormat.format(-Math.floor(elapsedSeconds / unitSeconds), unit);
}
