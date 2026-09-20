import './burger-menu.scss';

export interface BurgerMenu {
  element: HTMLElement;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function createBurgerMenu(): BurgerMenu {
  const panel = document.createElement('div');
  panel.classList.add('burger-menu');
  panel.dataset.burgerMenu = 'closed';

  const top = document.createElement('div');
  top.classList.add('burger-menu-top');

  const heading = document.createElement('h2');
  heading.textContent = 'MiniGames';
  top.append(heading);

  panel.append(top);

  const open = (): void => {
    panel.dataset.burgerMenu = 'open';
  };

  const close = (): void => {
    panel.dataset.burgerMenu = 'closed';
  };

  const toggle = (): void => {
    if (panel.dataset.burgerMenu === 'open') {
      close();
    } else {
      open();
    }
  };

  return { element: panel, open, close, toggle };
}
