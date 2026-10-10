import { signInWithPopup, type UserCredential } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../../firebase.js';

const CANCELLED_CODES = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

export async function signInWithGoogle(): Promise<UserCredential | undefined> {
  try {
    return await signInWithPopup(auth, googleAuthProvider);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (!code || !CANCELLED_CODES.has(code)) {
      console.log('oops, smth went wrong'); //add shackbar
    }
    return undefined;
  }
}
