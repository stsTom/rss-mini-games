import './developer-cta.scss';
import { createDeveloperCtaImage } from './components/image/image.js';
import { createDeveloperCtaHeading } from './components/heading/heading.js';

export function createDeveloperCta(): HTMLElement {
  const section = document.createElement('section');
  section.classList.add('developer-cta');

  const contentBox = document.createElement('div');
  contentBox.classList.add('developer-cta-content');
  contentBox.append(createDeveloperCtaHeading());

  section.append(createDeveloperCtaImage(), contentBox);

  return section;
}
