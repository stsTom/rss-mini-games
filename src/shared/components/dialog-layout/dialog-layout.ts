import './dialog-layout.scss';

export interface DialogLayoutOptions {
  className: string;
  onClose?: () => void;
  canClose?: () => boolean;
}

export interface DialogLayout {
  element: HTMLDialogElement;
  card: HTMLElement;
  open: () => void;
  close: () => void;
}

export function createDialogLayout({
  className,
  onClose,
  canClose,
}: DialogLayoutOptions): DialogLayout {
  const dialog = document.createElement('dialog');
  dialog.classList.add('dialog-layout', className);

  const card = document.createElement('div');
  card.classList.add('dialog-layout-card');
  dialog.append(card);

  let isClosing = false;

  const hasTransition = (): boolean =>
    getComputedStyle(dialog)
      .transitionDuration.split(',')
      .some((duration) => duration.trim() !== '0s');

  const handleTransitionEnd = (event: TransitionEvent): void => {
    if (event.target !== dialog) {
      return;
    }

    dialog.removeEventListener('transitionend', handleTransitionEnd);
    dialog.close();
  };

  const open = (): void => {
    if (dialog.open) {
      return;
    }

    dialog.showModal();
    document.body.classList.add('dialog-open');
    dialog.classList.add('open');
  };

  const close = (): void => {
    if (isClosing || !dialog.open || canClose?.() === false) {
      return;
    }

    isClosing = true;
    dialog.classList.remove('open');

    if (hasTransition()) {
      dialog.addEventListener('transitionend', handleTransitionEnd);
    } else {
      dialog.close();
    }
  };

  dialog.addEventListener('close', () => {
    isClosing = false;
    dialog.removeEventListener('transitionend', handleTransitionEnd);
    dialog.classList.remove('open');
    document.body.classList.remove('dialog-open');
    onClose?.();
  });

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    close();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      close();
    }
  });

  return { element: dialog, card, open, close };
}
