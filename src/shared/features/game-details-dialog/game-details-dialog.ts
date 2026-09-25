import './game-details-dialog.scss';
import { createDialogLayout } from '../../components/dialog-layout/dialog-layout.js';
import type { Game } from '../../interfaces.js';

export interface GameDetailsDialog {
  element: HTMLDialogElement;
  open: (game: Game, onClose?: () => void) => void;
}

export function createGameDetailsDialog(): GameDetailsDialog {
  let handleClose: (() => void) | undefined;

  const layout = createDialogLayout({
    className: 'game-details-dialog',
    onClose: () => {
      const callback = handleClose;
      handleClose = undefined;
      callback?.();
    },
  });
  layout.card.classList.add('game-details-dialog-card');

  const render = (): void => {
    layout.card.replaceChildren();
  };

  const open = (_game: Game, onClose?: () => void): void => {
    handleClose = onClose;
    render();
    layout.open();
  };

  return { element: layout.element, open };
}
