import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC8rniz1ax2COtU2CFpTKzHiRgtMt86yZM',
  authDomain: 'rss-mini-games.firebaseapp.com',
  projectId: 'rss-mini-games',
  storageBucket: 'rss-mini-games.firebasestorage.app',
  messagingSenderId: '1051540877814',
  appId: '1:1051540877814:web:32bb74112827d69b56d7d7',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
