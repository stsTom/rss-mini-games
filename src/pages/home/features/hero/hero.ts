import './hero.scss';
import { createHeroHeading } from './components/heading/heading.js';
import { createHeroText } from './components/text/text.js';
import { createBrowseLibraryButton } from './components/browse-library-button/browse-library-button.js';

export function createHero(): HTMLElement {
  const hero = document.createElement('section');
  hero.classList.add('hero');

  const contentBox = document.createElement('div');
  contentBox.classList.add('hero-content');
  contentBox.append(createHeroHeading(), createHeroText(), createBrowseLibraryButton());

  hero.append(contentBox);

  return hero;
}
