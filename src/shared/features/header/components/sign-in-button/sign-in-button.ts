import './sign-in-button.scss';
import { HEADER_VISIBILITY } from '../../dataset-values.js';

export function createSignInButton(hasVisibility: boolean, onClick: () => void): HTMLElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Sign in';
  if (hasVisibility) {
    button.dataset.headerVisibility = HEADER_VISIBILITY.desktop;
  }
  button.addEventListener('click', onClick);

  return button;
}
