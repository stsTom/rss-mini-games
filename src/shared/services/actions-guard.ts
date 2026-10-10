import type { Router } from './router.js';
import type { AppSession } from './app-session.js';

export type GuardAction = (action: () => void) => () => void;

export function createActionsGuard(router: Router, session: AppSession): GuardAction {
  return (action) => () => {
    if (session.hasActiveSession()) {
      action();
      return;
    }

    router.update({ auth: 'login' });
  };
}
