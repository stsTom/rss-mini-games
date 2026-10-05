import './sort-dropdown.scss';
import { SORT_OPTIONS } from '../../../../constants.js';

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

export interface SortDropdownOptions {
  onSortChange: (sort: string) => void;
}

export interface SortDropdown {
  element: HTMLElement;
  setSort: (sort: string) => void;
}

export function createSortDropdown({ onSortChange }: SortDropdownOptions): SortDropdown {
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

  const options = SORT_OPTIONS.map((sortOption) => {
    const option = document.createElement('li');
    option.classList.add('sort-dropdown-option');
    option.setAttribute('role', 'option');
    option.tabIndex = PROGRAMMATIC_FOCUS_ONLY;
    option.dataset.value = sortOption.value;

    const text = document.createElement('span');
    text.textContent = sortOption.label;

    option.append(createIcon('sort-dropdown-check', ICON_CHECK), text);
    option.addEventListener('click', () => {
      setOpen(false);
      onSortChange(sortOption.value);
    });
    return option;
  });

  function setSort(sort: string): void {
    const label = SORT_OPTIONS.find((sortOption) => sortOption.value === sort)?.label ?? '';
    value.textContent = `${SORT_LABEL_PREFIX} ${label}`;
    for (const option of options) {
      option.ariaSelected = String(option.dataset.value === sort);
    }
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
  setOpen(false);

  return { element: dropdown, setSort };
}
