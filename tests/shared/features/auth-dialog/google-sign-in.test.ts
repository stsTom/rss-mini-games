import { signInWithPopup } from 'firebase/auth';
import { describe, expect, it, vi } from 'vitest';
import { signInWithGoogle } from '../../../../src/shared/features/auth-dialog/google-sign-in.js';

vi.mock('firebase/auth', () => ({ signInWithPopup: vi.fn() }));
vi.mock('../../../../src/firebase.js', () => ({ auth: {}, googleAuthProvider: {} }));

const makeSnackbar = () => ({ element: document.createElement('div'), show: vi.fn() });

describe('signInWithGoogle', () => {
  it('returns the credential on success', async () => {
    const credential = { user: { email: 'j@x' } };
    vi.mocked(signInWithPopup).mockResolvedValue(credential as never);
    const snackbar = makeSnackbar();

    expect(await signInWithGoogle(snackbar)).toBe(credential);
    expect(snackbar.show).not.toHaveBeenCalled();
  });

  it('stays silent when the popup is cancelled', async () => {
    vi.mocked(signInWithPopup).mockRejectedValue({ code: 'auth/popup-closed-by-user' });
    const snackbar = makeSnackbar();

    expect(await signInWithGoogle(snackbar)).toBeUndefined();
    expect(snackbar.show).not.toHaveBeenCalled();
  });

  it('shows an error for other failures', async () => {
    vi.mocked(signInWithPopup).mockRejectedValue(new Error('boom'));
    const snackbar = makeSnackbar();

    expect(await signInWithGoogle(snackbar)).toBeUndefined();
    expect(snackbar.show).toHaveBeenCalledWith(expect.any(String), 'error');
  });
});
