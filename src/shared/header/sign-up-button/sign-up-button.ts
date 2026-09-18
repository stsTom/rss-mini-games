export function createSignUpButton(): HTMLElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Sign up';
  button.dataset.headerVisibility = 'wide';

  return button;
}
