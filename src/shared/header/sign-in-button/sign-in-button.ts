import './sign-in-button.scss';

export function createSignInButton(): HTMLElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Sign in';
  button.dataset.headerVisibility = 'desktop';

  return button;
}
