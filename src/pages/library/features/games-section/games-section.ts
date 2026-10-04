import './games-section.scss';
import { createSortDropdown } from './components/sort-dropdown/sort-dropdown.js';
import { CATEGORIES } from '../../constants.js';

export interface GamesSectionOptions {
  onCategoryChange: (category: string) => void;
}

export interface GamesSection {
  element: HTMLElement;
  setCategory: (category: string) => void;
}

export function createGamesSection({ onCategoryChange }: GamesSectionOptions): GamesSection {
  const chips = document.createElement('div');
  chips.classList.add('games-section-chips');
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', 'Categories');

  const buttons = CATEGORIES.map(({ label, value }) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.classList.add('games-section-chip');
    chip.textContent = label;
    chip.dataset.category = value;
    return chip;
  });

  chips.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('button') : undefined;
    if (target?.dataset.category) {
      onCategoryChange(target.dataset.category);
    }
  });

  chips.append(...buttons);

  const setCategory = (category: string): void => {
    for (const chip of buttons) {
      chip.ariaPressed = String(chip.dataset.category === category);
    }
  };

  const section = document.createElement('div');
  section.classList.add('games-section');
  section.append(chips, createSortDropdown());

  return { element: section, setCategory };
}
