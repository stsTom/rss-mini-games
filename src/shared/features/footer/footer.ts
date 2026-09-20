import './footer.scss';
import { createFooterHeading } from './components/heading/heading.js';
import { createFooterTagline } from './components/tagline/tagline.js';
import { createExploreLinks } from './components/explore-links/explore-links.js';
import { createCompanyLinks } from './components/company-links/company-links.js';
import { createCommunityActions } from './components/community-actions/community-actions.js';
import { createCopyright } from './components/copyright/copyright.js';
import { createRssLink } from './components/rss-link/rss-link.js';
import { createGithubLink } from './components/github-link/github-link.js';
import { createAttribution } from './components/attribution/attribution.js';

function createBrandBlock(): HTMLElement {
  const brandBlock = document.createElement('div');
  brandBlock.classList.add('brand-block');
  brandBlock.append(createFooterHeading(), createFooterTagline());

  return brandBlock;
}

function createLinksBlock(): HTMLElement {
  const linksBlock = document.createElement('div');
  linksBlock.classList.add('links-block');
  linksBlock.append(createExploreLinks(), createCompanyLinks(), createCommunityActions());

  return linksBlock;
}

function createLowerFooter(): HTMLElement {
  const lowerFooter = document.createElement('div');
  lowerFooter.classList.add('lower-footer');

  const linksWrapper = document.createElement('div');
  linksWrapper.classList.add('lower-footer-links');
  linksWrapper.append(createRssLink(), createGithubLink());

  lowerFooter.append(createCopyright(), linksWrapper, createAttribution());

  return lowerFooter;
}

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');

  const upperFooter = document.createElement('div');
  upperFooter.classList.add('upper-footer');
  upperFooter.append(createBrandBlock(), createLinksBlock());

  footer.append(upperFooter, createLowerFooter());

  return footer;
}
