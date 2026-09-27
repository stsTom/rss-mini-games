import './header.scss';
import { createTitle } from './components/title/title.js';
import { createNav } from './components/nav/nav.js';
import { createBurger } from './components/burger/burger.js';
import { createBurgerMenu } from './components/burger-menu/burger-menu.js';
import { createSignInButton } from './components/sign-in-button/sign-in-button.js';
import { createSignUpButton } from './components/sign-up-button/sign-up-button.js';
import { createAuthDialog } from '../auth-dialog/auth-dialog.js';
import type { PageType } from '../../services/router.js';

export interface HeaderOptions {
  onPageChange: (page: PageType) => void;
}

export function createHeader({ onPageChange }: HeaderOptions): HTMLElement {
  const header = document.createElement('header');

  const authDialog = createAuthDialog();

  const burgerMenu = createBurgerMenu({
    onSignIn: authDialog.openLogin,
    onSignUp: authDialog.openRegister,
    onPageChange,
  });
  const burger = createBurger();
  burger.addEventListener('click', () => {
    burgerMenu.open();
  });

  const controls = document.createElement('div');
  controls.classList.add('header-controls');
  controls.append(
    createNav({ onPageChange }),
    createSignInButton(true, authDialog.openLogin),
    createSignUpButton(true, authDialog.openRegister),
    burger
  );

  header.append(createTitle(), controls, burgerMenu.element, authDialog.element);

  return header;
}
