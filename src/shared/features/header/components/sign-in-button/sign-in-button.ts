import './sign-in-button.scss';

export function createSignInButton(hasVisibility: boolean, onClick: () => void): HTMLElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Sign in';
  if (hasVisibility) {
    button.dataset.headerVisibility = 'desktop';
  }
  button.addEventListener('click', onClick);

  return button;
}
