import './burger-menu.scss';

export interface BurgerMenu {
  element: HTMLElement;
  open: () => void;
  close: () => void;
}

export function createBurgerMenu(): BurgerMenu {
  const panel = document.createElement('div');
  panel.classList.add('burger-menu');
  panel.dataset.burgerMenu = 'closed';

  const top = document.createElement('div');
  top.classList.add('burger-menu-top');

  const heading = document.createElement('h2');
  heading.textContent = 'MiniGames';

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = 'Close';

  top.append(heading, closeButton);

  panel.append(top);

  const open = (): void => {
    panel.dataset.burgerMenu = 'open';
  };

  const close = (): void => {
    panel.dataset.burgerMenu = 'closed';
  };

  closeButton.addEventListener('click', () => {
    close();
  });

  return { element: panel, open, close };
}
