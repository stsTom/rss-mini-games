import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  APP_SESSION_KEY,
  APP_SESSION_LIFETIME_MS,
  createAppSession,
  isAppSessionData,
} from '../../../src/shared/services/app-session.js';

vi.mock('firebase/auth', () => ({ signOut: vi.fn() }));
vi.mock('../../../src/firebase.js', () => ({ auth: {} }));

const NOW = new Date('2026-01-01T12:00:00Z').getTime();

const makeSnackbar = () => ({ element: document.createElement('div'), show: vi.fn() });

const makeUser = (overrides: Partial<User> = {}) =>
  ({ email: 'jane@example.com', displayName: null, photoURL: null, ...overrides }) as User;

const storeSession = (data: unknown) => {
  localStorage.setItem(APP_SESSION_KEY, JSON.stringify(data));
};

describe('isAppSessionData', () => {
  it('accepts valid data', () => {
    expect(isAppSessionData({ displayName: 'J', email: 'j@x', authenticatedAt: 1 })).toBe(true);
    expect(
      isAppSessionData({ displayName: 'J', email: 'j@x', authenticatedAt: 1, avatarUrl: 'u' })
    ).toBe(true);
  });

  it('rejects invalid data', () => {
    expect(isAppSessionData(null)).toBe(false);
    expect(isAppSessionData('x')).toBe(false);
    expect(isAppSessionData({ displayName: ' ', email: 'j@x', authenticatedAt: 1 })).toBe(false);
    expect(isAppSessionData({ displayName: 'J', email: 'j@x', authenticatedAt: NaN })).toBe(false);
    expect(
      isAppSessionData({ displayName: 'J', email: 'j@x', authenticatedAt: 1, avatarUrl: 5 })
    ).toBe(false);
  });
});

describe('createAppSession', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    vi.mocked(signOut).mockClear();
  });

  it('starts a session, persists it and notifies', () => {
    const session = createAppSession(makeSnackbar());
    const listener = vi.fn();
    session.subscribe(listener);

    session.start(makeUser({ photoURL: 'http://img' }), 'Jane');

    expect(session.current).toEqual({
      displayName: 'Jane',
      email: 'jane@example.com',
      authenticatedAt: NOW,
      avatarUrl: 'http://img',
    });
    expect(localStorage.getItem(APP_SESSION_KEY)).not.toBeNull();
    expect(listener).toHaveBeenCalledWith(session.current);
  });

  it('derives display name from user or email', () => {
    const session = createAppSession(makeSnackbar());

    session.start(makeUser({ displayName: 'Firebase Name' }));
    expect(session.current?.displayName).toBe('Firebase Name');

    session.start(makeUser());
    expect(session.current?.displayName).toBe('jane');
    expect(session.current?.avatarUrl).toBeUndefined();
  });

  it('expires after the lifetime and shows a snackbar', () => {
    const snackbar = makeSnackbar();
    const session = createAppSession(snackbar);
    session.start(makeUser());

    vi.advanceTimersByTime(APP_SESSION_LIFETIME_MS);

    expect(session.current).toBeUndefined();
    expect(snackbar.show).toHaveBeenCalledWith(expect.stringContaining('expired'), 'error');
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
    expect(signOut).toHaveBeenCalled();
  });

  it('restores a valid stored session', () => {
    storeSession({ displayName: 'Jane', email: 'j@x', authenticatedAt: NOW - 1000 });
    const session = createAppSession(makeSnackbar());

    session.restore();

    expect(session.current?.displayName).toBe('Jane');
  });

  it('clears invalid, missing and corrupt stored sessions on restore', () => {
    const session = createAppSession(makeSnackbar());

    session.restore();
    expect(session.current).toBeUndefined();

    localStorage.setItem(APP_SESSION_KEY, '{bad json');
    session.restore();
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
  });

  it('expires a stale stored session on restore', () => {
    const snackbar = makeSnackbar();
    storeSession({
      displayName: 'Jane',
      email: 'j@x',
      authenticatedAt: NOW - APP_SESSION_LIFETIME_MS - 1,
    });
    const session = createAppSession(snackbar);

    session.restore();

    expect(session.current).toBeUndefined();
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('hasActiveSession reflects state', () => {
    const snackbar = makeSnackbar();
    const session = createAppSession(snackbar);
    expect(session.hasActiveSession()).toBe(false);

    session.start(makeUser());
    expect(session.hasActiveSession()).toBe(true);

    storeSession({ displayName: 'Other', email: 'o@x', authenticatedAt: NOW + 5 });
    expect(session.hasActiveSession()).toBe(false);
    expect(session.current).toBeUndefined();
  });

  it('hasActiveSession detects expiry by clock', () => {
    const snackbar = makeSnackbar();
    const session = createAppSession(snackbar);
    session.start(makeUser());

    vi.setSystemTime(NOW + APP_SESSION_LIFETIME_MS);

    expect(session.hasActiveSession()).toBe(false);
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('logout clears and notifies once', () => {
    const session = createAppSession(makeSnackbar());
    const listener = vi.fn();
    session.start(makeUser());
    session.subscribe(listener);

    session.logout();
    session.logout();

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(undefined);
  });

  it('unsubscribes listeners', () => {
    const session = createAppSession(makeSnackbar());
    const listener = vi.fn();
    const unsubscribe = session.subscribe(listener);

    unsubscribe();
    session.start(makeUser());

    expect(listener).not.toHaveBeenCalled();
  });

  it('re-validates on focus and visibility change', () => {
    const session = createAppSession(makeSnackbar());
    session.start(makeUser());
    localStorage.removeItem(APP_SESSION_KEY);

    document.dispatchEvent(new Event('visibilitychange'));

    expect(session.current).toBeUndefined();

    session.start(makeUser());
    localStorage.removeItem(APP_SESSION_KEY);
    globalThis.dispatchEvent(new Event('focus'));

    expect(session.current).toBeUndefined();
  });

  it('restores on storage events for its key', () => {
    const session = createAppSession(makeSnackbar());
    storeSession({ displayName: 'Tab', email: 't@x', authenticatedAt: NOW });

    globalThis.dispatchEvent(new StorageEvent('storage', { key: 'unrelated' }));
    expect(session.current).toBeUndefined();

    globalThis.dispatchEvent(new StorageEvent('storage', { key: APP_SESSION_KEY }));
    expect(session.current?.displayName).toBe('Tab');
  });
});
