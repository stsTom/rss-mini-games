import './contact-text.scss';

export function createDeveloperCtaContactText(): HTMLElement {
  const contactText = document.createElement('p');
  contactText.textContent = 'or contact us at developers@minigames.com';

  return contactText;
}
