import './burger-menu.scss';
import { createNav } from '../nav/nav.js';
import { createSignInButton } from '../sign-in-button/sign-in-button.js';
import { createSignUpButton } from '../sign-up-button/sign-up-button.js';

export interface BurgerMenu {
  element: HTMLElement;
  open: () => void;
  close: () => void;
}

export function createBurgerMenu(): BurgerMenu {
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
  bottom.append(createSignInButton(false), createSignUpButton(false));

  panel.append(top, nav, bottom);

  const open = (): void => {
    panel.dataset.burgerMenu = 'open';
  };

  const close = (): void => {
    panel.dataset.burgerMenu = 'closed';
  };

  closeButton.addEventListener('click', () => {
    close();
  });

  return { element: panel, open, close };
}
