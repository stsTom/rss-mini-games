import './snackbar.scss';

export type SnackbarVariant = 'error' | 'info';

export interface Snackbar {
  element: HTMLElement;
  show: (message: string, variant?: SnackbarVariant) => void;
}

const HIDE_DELAY_MS = 4000;

export function createSnackbar(): Snackbar {
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  const element = document.createElement('div');
  element.classList.add('snackbar');
  element.setAttribute('popover', 'manual');

  const hide = (): void => {
    clearTimeout(hideTimer);
    hideTimer = undefined;
    if (element.matches(':popover-open')) {
      element.hidePopover();
    }
  };

  const show = (message: string, variant: SnackbarVariant = 'info'): void => {
    clearTimeout(hideTimer);

    element.dataset.variant = variant;
    element.setAttribute('role', variant === 'error' ? 'alert' : 'status');
    element.textContent = message;

    if (element.matches(':popover-open')) {
      element.hidePopover();
    }
    element.showPopover();

    hideTimer = setTimeout(hide, HIDE_DELAY_MS);
  };

  element.addEventListener('click', hide);

  return { element, show };
}
