import './sign-up-button.scss';

export function createSignUpButton(hasVisibility: boolean, onClick: () => void): HTMLElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Sign up';
  if (hasVisibility) {
    button.dataset.headerVisibility = 'wide';
  }
  button.addEventListener('click', onClick);

  return button;
}
