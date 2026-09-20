import './header.scss';
import { createTitle } from './components/title/title.js';
import { createNav } from './components/nav/nav.js';
import { createBurger } from './components/burger/burger.js';
import { createBurgerMenu } from './components/burger-menu/burger-menu.js';
import { createSignInButton } from './components/sign-in-button/sign-in-button.js';
import { createSignUpButton } from './components/sign-up-button/sign-up-button.js';

export function createHeader(): HTMLElement {
  const header = document.createElement('header');

  const burgerMenu = createBurgerMenu();
  const burger = createBurger();
  burger.addEventListener('click', () => {
    burgerMenu.toggle();
  });

  const controls = document.createElement('div');
  controls.classList.add('header-controls');
  controls.append(createNav(), createSignInButton(), createSignUpButton(), burger);

  header.append(createTitle(), controls, burgerMenu.element);

  return header;
}
