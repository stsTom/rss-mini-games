import './hero.scss';
import { createHeroHeading } from './components/heading/heading.js';
import { createHeroText } from './components/text/text.js';
import { createBrowseLibraryButton } from './components/browse-library-button/browse-library-button.js';
import type { Router } from '../../../../shared/services/router.js';

interface HeroSectionOptions {
  router: Router;
}

export function createHero({ router }: HeroSectionOptions): HTMLElement {
  const hero = document.createElement('section');
  hero.classList.add('hero');

  const contentBox = document.createElement('div');
  contentBox.classList.add('hero-content');
  contentBox.append(createHeroHeading(), createHeroText(), createBrowseLibraryButton({ router }));

  hero.append(contentBox);

  return hero;
}
