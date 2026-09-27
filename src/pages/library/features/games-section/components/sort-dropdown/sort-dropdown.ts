import './sort-dropdown.scss';

const SORT_OPTIONS = ['Rating ↑', 'Rating ↓', 'Name A→Z', 'Name Z→A'];
const DEFAULT_SORT_OPTION = 'Rating ↓';
const SORT_LABEL_PREFIX = 'Sort by:';
const PROGRAMMATIC_FOCUS_ONLY = -1;

const ICON_FONT_CLASS = 'material-symbols-outlined';
const ICON_CHEVRON = 'expand_more';
const ICON_CHECK = 'check';

function createIcon(className: string, name: string): HTMLElement {
  const icon = document.createElement('span');
  icon.classList.add(ICON_FONT_CLASS, className);
  icon.textContent = name;
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

export function createSortDropdown(): HTMLElement {
  const dropdown = document.createElement('div');
  dropdown.classList.add('sort-dropdown');

  const value = document.createElement('span');

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.classList.add('sort-dropdown-trigger');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.append(value, createIcon('sort-dropdown-chevron', ICON_CHEVRON));

  const list = document.createElement('ul');
  list.classList.add('sort-dropdown-list');
  list.setAttribute('role', 'listbox');

  const setOpen = (isOpen: boolean): void => {
    trigger.ariaExpanded = String(isOpen);
    list.hidden = !isOpen;
  };

  const options = SORT_OPTIONS.map((label) => {
    const option = document.createElement('li');
    option.classList.add('sort-dropdown-option');
    option.setAttribute('role', 'option');
    option.tabIndex = PROGRAMMATIC_FOCUS_ONLY;
    option.dataset.value = label;

    const text = document.createElement('span');
    text.textContent = label;

    option.append(createIcon('sort-dropdown-check', ICON_CHECK), text);
    option.addEventListener('click', () => select(label));
    return option;
  });

  function select(label: string): void {
    value.textContent = `${SORT_LABEL_PREFIX} ${label}`;
    for (const option of options) {
      option.ariaSelected = String(option.dataset.value === label);
    }
    setOpen(false);
  }

  trigger.addEventListener('click', () => setOpen(list.hidden));
  dropdown.addEventListener('focusout', (event) => {
    if (!(event.relatedTarget instanceof Node && dropdown.contains(event.relatedTarget))) {
      setOpen(false);
    }
  });
  dropdown.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    setOpen(false);
    trigger.focus();
  });

  list.append(...options);
  dropdown.append(trigger, list);
  select(DEFAULT_SORT_OPTION);

  return dropdown;
}
