import type { Router } from './router.js';
import type { AppSession } from './app-session.js';
import type { Snackbar } from '../components/snackbar/snackbar.js';

export type GuardAction = (action: () => void | Promise<void>) => () => void;

export function createActionsGuard(
  router: Router,
  session: AppSession,
  snackbar: Snackbar
): GuardAction {
  return (action) => () => {
    if (session.hasActiveSession()) {
      void action();
      return;
    }

    snackbar.show('Please sign in to continue.');
    router.update({ auth: 'login' });
  };
}
