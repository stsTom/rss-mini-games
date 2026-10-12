import { describe, expect, it } from 'vitest';
import {
  formatCompactCount,
  formatScore,
  formatTimeAgo,
} from '../../../../../src/shared/features/game-details-dialog/utils/format.js';

describe('formatCompactCount', () => {
  it('keeps small numbers', () => {
    expect(formatCompactCount(999)).toBe('999');
  });

  it('abbreviates thousands', () => {
    expect(formatCompactCount(1000)).toBe('1.0K');
    expect(formatCompactCount(2550)).toBe('2.5K');
  });
});

describe('formatScore', () => {
  it('groups digits and appends suffix', () => {
    expect(formatScore(12_345)).toBe('12,345 pts');
  });
});

describe('formatTimeAgo', () => {
  const now = Date.parse('2026-06-01T12:00:00Z');
  const ago = (seconds: number) => new Date(now - seconds * 1000).toISOString();

  it('formats each unit', () => {
    expect(formatTimeAgo(ago(30), now)).toBe('30 seconds ago');
    expect(formatTimeAgo(ago(120), now)).toBe('2 minutes ago');
    expect(formatTimeAgo(ago(3 * 3600), now)).toBe('3 hours ago');
    expect(formatTimeAgo(ago(2 * 86_400), now)).toBe('2 days ago');
    expect(formatTimeAgo(ago(14 * 86_400), now)).toBe('2 weeks ago');
    expect(formatTimeAgo(ago(65 * 86_400), now)).toBe('2 months ago');
  });

  it('defaults to the current time', () => {
    expect(formatTimeAgo(new Date().toISOString())).toMatch(/second/);
  });
});
