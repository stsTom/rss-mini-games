import { signOut, type User } from 'firebase/auth';
import { auth } from '../../firebase.js';

export const APP_SESSION_KEY = 'minigames:rss-mini-games:app-session';
export const APP_SESSION_LIFETIME_MS = 5 * 60 * 1000;

export interface AppSessionData {
  displayName: string;
  email: string;
  authenticatedAt: number;
  avatarUrl?: string;
}

type SessionListener = (session: AppSessionData | undefined) => void;

export interface AppSession {
  readonly current: AppSessionData | undefined;
  start: (user: User, displayName?: string) => void;
  restore: () => void;
  hasActiveSession: () => boolean;
  logout: () => void;
  subscribe: (callback: SessionListener) => () => void;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

export function isAppSessionData(value: unknown): value is AppSessionData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { displayName, email, authenticatedAt, avatarUrl } = value as Record<string, unknown>;

  return (
    isNonEmptyString(displayName) &&
    isNonEmptyString(email) &&
    typeof authenticatedAt === 'number' &&
    Number.isFinite(authenticatedAt) &&
    (avatarUrl === undefined || typeof avatarUrl === 'string')
  );
}

function isExpired({ authenticatedAt }: AppSessionData): boolean {
  return Date.now() - authenticatedAt >= APP_SESSION_LIFETIME_MS;
}

function parseStoredSession(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function createAppSession(): AppSession {
  let current: AppSessionData | undefined;
  let expiryTimer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<SessionListener>();

  const notify = (): void => {
    for (const listener of listeners) {
      listener(current);
    }
  };

  const clear = (): void => {
    clearTimeout(expiryTimer);
    expiryTimer = undefined;
    localStorage.removeItem(APP_SESSION_KEY);
    void signOut(auth);

    const wasActive = current !== undefined;
    current = undefined;
    if (wasActive) {
      notify();
    }
  };

  const expire = (): void => {
    clear();
    console.log('Your session has expired. Please sign in again.'); //add snackbar
  };

  const scheduleExpiry = (session: AppSessionData): void => {
    clearTimeout(expiryTimer);
    const remaining = session.authenticatedAt + APP_SESSION_LIFETIME_MS - Date.now();
    expiryTimer = setTimeout(expire, Math.max(remaining, 0));
  };

  const activate = (session: AppSessionData): void => {
    current = session;
    scheduleExpiry(session);
    notify();
  };

  const hasActiveSession = (): boolean => {
    if (!current) {
      return false;
    }

    if (isExpired(current)) {
      expire();
      return false;
    }

    return true;
  };

  const restore = (): void => {
    const raw = localStorage.getItem(APP_SESSION_KEY);
    const stored = raw === null ? undefined : parseStoredSession(raw);

    // Missing or invalid: Firebase's own persistence must not bring the user back
    if (!isAppSessionData(stored)) {
      clear();
      return;
    }

    if (isExpired(stored)) {
      expire();
      return;
    }

    activate(stored);
  };

  const start = (user: User, displayName?: string): void => {
    const email = user.email ?? '';
    const session: AppSessionData = {
      displayName: displayName || user.displayName || email.split('@', 1)[0] || email,
      email,
      authenticatedAt: Date.now(),
    };
    if (user.photoURL) {
      session.avatarUrl = user.photoURL;
    }

    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
    activate(session);
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      hasActiveSession();
    }
  });
  globalThis.addEventListener('focus', hasActiveSession);
  globalThis.addEventListener('storage', (event) => {
    if (event.key === APP_SESSION_KEY || event.key === null) {
      restore();
    }
  });

  return {
    get current() {
      return current;
    },
    start,
    restore,
    hasActiveSession,
    logout: clear,
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}
