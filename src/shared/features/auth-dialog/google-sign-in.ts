import { signInWithPopup, type UserCredential } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../../firebase.js';
import type { Snackbar } from '../../components/snackbar/snackbar.js';

const CANCELLED_CODES = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

export async function signInWithGoogle(snackbar: Snackbar): Promise<UserCredential | undefined> {
  try {
    return await signInWithPopup(auth, googleAuthProvider);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (!code || !CANCELLED_CODES.has(code)) {
      snackbar.show('Could not sign in with Google. Please try again.', 'error');
    }
    return undefined;
  }
}
