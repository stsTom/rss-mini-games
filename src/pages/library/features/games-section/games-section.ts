import './games-section.scss';

const CATEGORIES = ['All Games', 'Puzzle', 'Card', 'Match', 'Farm', 'Strategy', 'Arcade'];

function createChips(): HTMLElement {
  const chips = document.createElement('div');
  chips.classList.add('games-section-chips');
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', 'Categories');

  const buttons = CATEGORIES.map((label, index) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.classList.add('games-section-chip');
    chip.textContent = label;
    chip.ariaPressed = String(index === 0);
    return chip;
  });

  chips.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('button') : undefined;
    if (!target) {
      return;
    }

    for (const chip of buttons) {
      chip.ariaPressed = String(chip === target);
    }
  });

  chips.append(...buttons);
  return chips;
}

export function createGamesSection(): HTMLElement {
  const section = document.createElement('div');
  section.classList.add('games-section');
  section.append(createChips());

  return section;
}
