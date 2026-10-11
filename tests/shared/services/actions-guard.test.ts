import { describe, expect, it, vi } from 'vitest';
import type { AppSession } from '../../../src/shared/services/app-session.js';
import { createActionsGuard } from '../../../src/shared/services/actions-guard.js';
import type { Router } from '../../../src/shared/services/router.js';

const setup = (active: boolean) => {
  const router = { update: vi.fn() } as unknown as Router;
  const session = { hasActiveSession: () => active } as unknown as AppSession;
  const snackbar = { element: document.createElement('div'), show: vi.fn() };
  const guard = createActionsGuard(router, session, snackbar);

  return { router, snackbar, guard };
};

describe('createActionsGuard', () => {
  it('runs the action for an active session', () => {
    const { guard, router, snackbar } = setup(true);
    const action = vi.fn();

    guard(action)();

    expect(action).toHaveBeenCalledOnce();
    expect(snackbar.show).not.toHaveBeenCalled();
    expect(router.update).not.toHaveBeenCalled();
  });

  it('redirects to login otherwise', () => {
    const { guard, router, snackbar } = setup(false);
    const action = vi.fn();

    guard(action)();

    expect(action).not.toHaveBeenCalled();
    expect(snackbar.show).toHaveBeenCalledWith('Please sign in to continue.');
    expect(router.update).toHaveBeenCalledWith({ auth: 'login' });
  });
});
