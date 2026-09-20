import './burger-menu.scss';
import { createNav } from '../nav/nav.js';
import { createSignInButton } from '../sign-in-button/sign-in-button.js';
import { createSignUpButton } from '../sign-up-button/sign-up-button.js';

export interface BurgerMenu {
  element: HTMLElement;
  open: () => void;
  close: () => void;
}

export interface BurgerMenuOptions {
  onSignIn: () => void;
  onSignUp: () => void;
}

export function createBurgerMenu(options: BurgerMenuOptions): BurgerMenu {
  const panel = document.createElement('div');
  panel.classList.add('burger-menu');
  panel.dataset.burgerMenu = 'closed';

  const top = document.createElement('div');
  top.classList.add('burger-menu-top');

  const heading = document.createElement('h2');
  heading.textContent = 'MiniGames';

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = 'Close';

  top.append(heading, closeButton);

  const nav = createNav(false);

  const bottom = document.createElement('div');
  bottom.classList.add('burger-menu-bottom');

  const open = (): void => {
    panel.dataset.burgerMenu = 'open';
  };

  const close = (): void => {
    panel.dataset.burgerMenu = 'closed';
  };

  const signInButton = createSignInButton(false, () => {
    close();
    options.onSignIn();
  });
  const signUpButton = createSignUpButton(false, () => {
    close();
    options.onSignUp();
  });
  bottom.append(signInButton, signUpButton);

  panel.append(top, nav, bottom);

  closeButton.addEventListener('click', () => {
    close();
  });

  return { element: panel, open, close };
}
