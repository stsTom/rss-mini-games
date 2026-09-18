import { createTitle } from '../title/title.js';
import { createNav } from '../nav/nav.js';
import { createBurger } from '../burger/burger.js';
import { createSignInButton } from '../sign-in-button/sign-in-button.js';
import { createSignUpButton } from '../sign-up-button/sign-up-button.js';

export function createHeader(): HTMLElement {
  const header = document.createElement('header');

  header.append(
    createTitle(),
    createNav(),
    createSignInButton(),
    createSignUpButton(),
    createBurger()
  );

  return header;
}
