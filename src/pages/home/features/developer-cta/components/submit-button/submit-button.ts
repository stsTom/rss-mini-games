import './submit-button.scss';

export function createDeveloperCtaSubmitButton(): HTMLElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Submit Form';

  return button;
}
