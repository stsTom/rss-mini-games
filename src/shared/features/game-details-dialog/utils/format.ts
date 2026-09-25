import { COMPACT_COUNT_SUFFIX, LIKES_ABBREVIATION_THRESHOLD } from '../constants.js';

export function formatCompactCount(count: number): string {
  if (count < LIKES_ABBREVIATION_THRESHOLD) {
    return String(count);
  }

  return `${(count / LIKES_ABBREVIATION_THRESHOLD).toFixed(1)}${COMPACT_COUNT_SUFFIX}`;
}
