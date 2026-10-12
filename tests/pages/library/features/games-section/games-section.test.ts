import { describe, expect, it, vi } from 'vitest';
import { createGamesSection } from '../../../../../src/pages/library/features/games-section/games-section.js';

describe('createGamesSection', () => {
  it('renders a chip per category and reports clicks', () => {
    const onCategoryChange = vi.fn();
    const { element } = createGamesSection({ onCategoryChange, onSortChange: vi.fn() });

    const chips = element.querySelectorAll<HTMLButtonElement>('.games-section-chip');
    expect(chips).toHaveLength(7);

    chips[2]?.click();
    expect(onCategoryChange).toHaveBeenCalledWith('card');

    element.querySelector('.games-section-chips')?.dispatchEvent(new MouseEvent('click'));
    expect(onCategoryChange).toHaveBeenCalledOnce();
  });

  it('marks the active category', () => {
    const { element, setCategory } = createGamesSection({
      onCategoryChange: vi.fn(),
      onSortChange: vi.fn(),
    });

    setCategory('arcade');

    const pressed = element.querySelectorAll<HTMLElement>('[aria-pressed="true"]');
    expect(pressed).toHaveLength(1);
    expect(pressed[0]?.dataset['category']).toBe('arcade');
  });

  it('forwards sort changes', () => {
    const onSortChange = vi.fn();
    const { element, setSort } = createGamesSection({ onCategoryChange: vi.fn(), onSortChange });
    setSort('rating-asc');

    element.querySelector<HTMLElement>('[data-value="name-asc"]')?.click();

    expect(onSortChange).toHaveBeenCalledWith('name-asc');
  });
});
