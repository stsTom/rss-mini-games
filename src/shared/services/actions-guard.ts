import type { Router } from './router.js';
import type { AppSession } from './app-session.js';

export type GuardAction = (action: () => void | Promise<void>) => () => void;

export function createActionsGuard(router: Router, session: AppSession): GuardAction {
  return (action) => () => {
    if (session.hasActiveSession()) {
      void action();
      return;
    }

    router.update({ auth: 'login' });
  };
}
