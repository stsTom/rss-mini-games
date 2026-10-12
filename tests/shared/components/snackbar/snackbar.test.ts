import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSnackbar } from '../../../../src/shared/components/snackbar/snackbar.js';

describe('createSnackbar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('shows an info message by default', () => {
    const { element, show } = createSnackbar();

    show('Hello');

    expect(element.textContent).toBe('Hello');
    expect(element.dataset['variant']).toBe('info');
    expect(element.getAttribute('role')).toBe('status');
    expect(element.showPopover).toHaveBeenCalled();
  });

  it('marks errors as alerts', () => {
    const { element, show } = createSnackbar();

    show('Oops', 'error');

    expect(element.dataset['variant']).toBe('error');
    expect(element.getAttribute('role')).toBe('alert');
  });

  it('hides itself after the delay', () => {
    const { element, show } = createSnackbar();
    vi.spyOn(element, 'matches').mockReturnValue(true);

    show('Hello');
    vi.advanceTimersByTime(4000);

    expect(element.hidePopover).toHaveBeenCalled();
  });

  it('hides on click and re-opens an already open popover', () => {
    const { element, show } = createSnackbar();
    const matches = vi.spyOn(element, 'matches').mockReturnValue(true);

    show('First');
    show('Second');
    expect(element.hidePopover).toHaveBeenCalledTimes(2);

    matches.mockReturnValue(false);
    element.click();
    expect(element.hidePopover).toHaveBeenCalledTimes(2);
  });
});
