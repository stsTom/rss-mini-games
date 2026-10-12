import { describe, expect, it, vi } from 'vitest';
import { createPagination } from '../../../../../src/pages/library/features/pagination/pagination.js';

describe('createPagination', () => {
  it('is hidden until rendered with several pages', () => {
    const { element, render } = createPagination({ onPageChange: vi.fn() });
    expect(element.hidden).toBe(true);

    render(1, 1);
    expect(element.hidden).toBe(true);

    render(1, 5);
    expect(element.hidden).toBe(false);
  });

  it('marks the current page and disables arrows at the edges', () => {
    const { element, render } = createPagination({ onPageChange: vi.fn() });

    render(1, 5);
    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons).toHaveLength(7);
    expect(buttons[0]?.disabled).toBe(true);
    expect(buttons[1]?.ariaCurrent).toBe('page');
    expect(buttons[2]?.ariaCurrent).toBe('false');

    render(5, 5);
    const last = element.querySelectorAll<HTMLButtonElement>('button');
    expect(last[6]?.disabled).toBe(true);
    expect(last[5]?.dataset['mobileHidden']).toBe('false');
    expect(last[1]?.dataset['mobileHidden']).toBe('true');
  });

  it('reports page changes', () => {
    const onPageChange = vi.fn();
    const { element, render } = createPagination({ onPageChange });
    render(3, 5);

    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    buttons[0]?.click();
    buttons[6]?.click();
    buttons[4]?.click();

    expect(onPageChange).toHaveBeenNthCalledWith(1, 2);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4);
    expect(onPageChange).toHaveBeenNthCalledWith(3, 4);
  });
});
