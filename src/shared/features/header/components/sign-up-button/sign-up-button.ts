import './sign-up-button.scss';
import { HEADER_VISIBILITY } from '../../dataset-values.js';

export function createSignUpButton(hasVisibility: boolean, onClick: () => void): HTMLElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Sign up';
  if (hasVisibility) {
    button.dataset.headerVisibility = HEADER_VISIBILITY.wide;
  }
  button.addEventListener('click', onClick);

  return button;
}
