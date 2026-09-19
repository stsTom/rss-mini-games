import './image.scss';

export function createDeveloperCtaImage(): HTMLElement {
  const image = document.createElement('img');
  image.classList.add('developer-cta-image');
  image.src = '/developer-image.png';
  image.alt = 'Game developer';

  return image;
}
