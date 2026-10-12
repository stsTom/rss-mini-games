import { describe, expect, it, vi } from 'vitest';
import { createDialogLayout } from '../../../../src/shared/components/dialog-layout/dialog-layout.js';

const setup = (options: Partial<Parameters<typeof createDialogLayout>[0]> = {}) => {
  const layout = createDialogLayout({ className: 'test', ...options });
  document.body.append(layout.element);
  return layout;
};

describe('createDialogLayout', () => {
  it('builds a dialog with a card', () => {
    const { element, card } = setup();

    expect(element.classList.contains('dialog-layout')).toBe(true);
    expect(element.classList.contains('test')).toBe(true);
    expect(element.contains(card)).toBe(true);
  });

  it('opens once and marks body', () => {
    const { element, open } = setup();

    open();
    open();

    expect(element.showModal).toHaveBeenCalledOnce();
    expect(document.body.classList.contains('dialog-open')).toBe(true);
    expect(element.classList.contains('open')).toBe(true);
  });

  it('closes and calls onClose', () => {
    const onClose = vi.fn();
    const { element, open, close } = setup({ onClose });
    open();

    close();

    expect(element.close).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledOnce();
    expect(document.body.classList.contains('dialog-open')).toBe(false);
  });

  it('ignores close when not open or when canClose is false', () => {
    const closed = setup();
    closed.close();
    expect(closed.element.close).not.toHaveBeenCalled();

    const blocked = setup({ canClose: () => false });
    blocked.open();
    blocked.close();
    expect(blocked.element.close).not.toHaveBeenCalled();
  });

  it('waits for the transition when one is running', () => {
    const { element, card, open, close } = setup();
    open();
    vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
      transitionDuration: '0.3s',
    } as CSSStyleDeclaration);

    close();
    expect(element.close).not.toHaveBeenCalled();

    card.dispatchEvent(new Event('transitionend', { bubbles: true }));
    expect(element.close).not.toHaveBeenCalled();

    element.dispatchEvent(new Event('transitionend'));
    expect(element.close).toHaveBeenCalled();
  });

  it('closes on escape, cancel and backdrop click', () => {
    const { element, open } = setup();

    open();
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(element.close).not.toHaveBeenCalled();
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(element.close).toHaveBeenCalledTimes(1);

    open();
    element.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(element.close).toHaveBeenCalledTimes(2);

    open();
    element.click();
    expect(element.close).toHaveBeenCalledTimes(3);
  });
});
