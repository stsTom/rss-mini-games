import './sign-in-button.scss';

export function createSignInButton(hasVisibility = true): HTMLElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Sign in';
  if (hasVisibility) {
    button.dataset.headerVisibility = 'desktop';
  }

  return button;
}
