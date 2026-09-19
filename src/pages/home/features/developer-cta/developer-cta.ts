import './developer-cta.scss';
import { createDeveloperCtaImage } from './components/image/image.js';
import { createDeveloperCtaHeading } from './components/heading/heading.js';
import { createDeveloperCtaText } from './components/text/text.js';
import { createDeveloperCtaSubmitButton } from './components/submit-button/submit-button.js';
import { createDeveloperCtaContactText } from './components/contact-text/contact-text.js';

export function createDeveloperCta(): HTMLElement {
  const section = document.createElement('section');
  section.classList.add('developer-cta');

  const contentBox = document.createElement('div');
  contentBox.classList.add('developer-cta-content');
  contentBox.append(
    createDeveloperCtaHeading(),
    createDeveloperCtaText(),
    createDeveloperCtaSubmitButton(),
    createDeveloperCtaContactText()
  );

  section.append(createDeveloperCtaImage(), contentBox);

  return section;
}
