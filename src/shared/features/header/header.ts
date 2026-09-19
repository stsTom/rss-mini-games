import './header.scss';
import { createTitle } from './components/title/title.js';
import { createNav } from './components/nav/nav.js';
import { createBurger } from './components/burger/burger.js';
import { createSignInButton } from './components/sign-in-button/sign-in-button.js';
import { createSignUpButton } from './components/sign-up-button/sign-up-button.js';

export function createHeader(): HTMLElement {
  const header = document.createElement('header');

  const controls = document.createElement('div');
  controls.classList.add('header-controls');
  controls.append(createNav(), createSignInButton(), createSignUpButton(), createBurger());

  header.append(createTitle(), controls);

  return header;
}
