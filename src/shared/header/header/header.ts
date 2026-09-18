import './header.scss';
import { createTitle } from '../title/title.js';
import { createNav } from '../nav/nav.js';
import { createBurger } from '../burger/burger.js';
import { createSignInButton } from '../sign-in-button/sign-in-button.js';
import { createSignUpButton } from '../sign-up-button/sign-up-button.js';

export function createHeader(): HTMLElement {
  const header = document.createElement('header');

  const controls = document.createElement('div');
  controls.classList.add('header-controls');
  controls.append(createNav(), createSignInButton(), createSignUpButton(), createBurger());

  header.append(createTitle(), controls);

  return header;
}
