import { describe, expect, it, vi } from 'vitest';
import { createSortDropdown } from '../../../../../../../src/pages/library/features/games-section/components/sort-dropdown/sort-dropdown.js';

const setup = () => {
  const onSortChange = vi.fn();
  const dropdown = createSortDropdown({ onSortChange });
  document.body.append(dropdown.element);
  const trigger = dropdown.element.querySelector<HTMLButtonElement>('.sort-dropdown-trigger');
  const list = dropdown.element.querySelector<HTMLElement>('.sort-dropdown-list');
  if (!trigger || !list) {
    throw new Error('parts missing');
  }
  return { ...dropdown, onSortChange, trigger, list };
};

describe('createSortDropdown', () => {
  it('starts closed and toggles on trigger click', () => {
    const { trigger, list } = setup();
    expect(list.hidden).toBe(true);

    trigger.click();
    expect(list.hidden).toBe(false);
    expect(trigger.ariaExpanded).toBe('true');

    trigger.click();
    expect(list.hidden).toBe(true);
  });

  it('shows the selected sort label and marks the option', () => {
    const { setSort, element } = setup();

    setSort('name-asc');

    expect(element.querySelector('.sort-dropdown-trigger span')?.textContent).toBe(
      'Sort by: Name A→Z'
    );
    const selected = element.querySelector<HTMLElement>('[aria-selected="true"]');
    expect(selected?.dataset['value']).toBe('name-asc');
  });

  it('uses an empty label for unknown values', () => {
    const { setSort, element } = setup();

    setSort('unknown');

    expect(element.querySelector('.sort-dropdown-trigger span')?.textContent).toBe('Sort by: ');
  });

  it('reports a chosen option and closes', () => {
    const { trigger, list, onSortChange } = setup();
    trigger.click();

    list.querySelector<HTMLElement>('[data-value="name-desc"]')?.click();

    expect(onSortChange).toHaveBeenCalledWith('name-desc');
    expect(list.hidden).toBe(true);
  });

  it('closes on escape and when focus leaves', () => {
    const { element, trigger, list } = setup();

    trigger.click();
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(list.hidden).toBe(false);
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(list.hidden).toBe(true);

    trigger.click();
    element.dispatchEvent(new FocusEvent('focusout', { relatedTarget: list }));
    expect(list.hidden).toBe(false);
    element.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    expect(list.hidden).toBe(true);
  });
});
