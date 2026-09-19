import './hero.scss';
import { createHeroHeading } from '../heading/heading.js';
import { createHeroText } from '../text/text.js';
import { createBrowseLibraryButton } from '../browse-library-button/browse-library-button.js';

export function createHero(): HTMLElement {
  const hero = document.createElement('section');
  hero.classList.add('hero');

  const contentBox = document.createElement('div');
  contentBox.classList.add('hero-content');
  contentBox.append(createHeroHeading(), createHeroText(), createBrowseLibraryButton());

  hero.append(contentBox);

  return hero;
}
