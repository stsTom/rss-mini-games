import './footer.scss';
import { createFooterHeading } from './components/heading/heading.js';
import { createFooterTagline } from './components/tagline/tagline.js';

function createBrandBlock(): HTMLElement {
  const brandBlock = document.createElement('div');
  brandBlock.classList.add('brand-block');
  brandBlock.append(createFooterHeading(), createFooterTagline());

  return brandBlock;
}

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');

  const upperFooter = document.createElement('div');
  upperFooter.classList.add('upper-footer');
  upperFooter.append(createBrandBlock());

  const lowerFooter = document.createElement('div');
  lowerFooter.classList.add('lower-footer');

  footer.append(upperFooter, lowerFooter);

  return footer;
}
