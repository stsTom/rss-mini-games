import { vi } from 'vitest';
import type { GuardAction } from '../src/shared/services/actions-guard.js';
import type { AppSession, AppSessionData } from '../src/shared/services/app-session.js';
import type { Snackbar } from '../src/shared/components/snackbar/snackbar.js';
import type { Game, GameComment, GameDetails } from '../src/shared/interfaces.js';

export const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

export const makeSnackbar = (): Snackbar => ({
  element: document.createElement('div'),
  show: vi.fn(),
});

export const passthroughGuard: GuardAction = (action) => () => {
  void action();
};

export const makeSession = (current?: AppSessionData): AppSession => ({
  current,
  start: vi.fn(),
  restore: vi.fn(),
  hasActiveSession: () => current !== undefined,
  logout: vi.fn(),
  subscribe: vi.fn(() => () => true),
});

export const signedIn: AppSessionData = {
  displayName: 'Jane',
  email: 'jane@example.com',
  authenticatedAt: Date.now(),
};

export const makeDetails = (overrides: Partial<GameDetails> = {}): GameDetails => ({
  slug: 'tetris',
  name: 'Tetris',
  heroImage: '/hero.png',
  rating: 4.5,
  likesCount: 1500,
  fullDescription: 'Stack blocks.',
  specs: { genre: 'Puzzle', players: '1', duration: '10 min', price: 'Free' },
  topRecords: [
    { position: 2, playerName: 'Bob', score: 2000, achievedAt: '2026-01-01T00:00:00Z' },
    { position: 1, playerName: 'Ann', score: 5000, achievedAt: '2026-01-02T00:00:00Z' },
  ],
  ...overrides,
});

export const makeComment = (overrides: Partial<GameComment> = {}): GameComment => ({
  commentId: 'c1',
  authorName: 'ann',
  text: 'Great game',
  likesCount: 3,
  createdAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

export const makeGame = (overrides: Partial<Game> = {}): Game => ({
  slug: 'tetris',
  name: 'Tetris',
  category: 'puzzle',
  price: 'Free',
  shortDescription: 'Stack blocks.',
  rating: 4.5,
  likesCount: 1500,
  cardImage: '/tetris.png',
  ...overrides,
});
