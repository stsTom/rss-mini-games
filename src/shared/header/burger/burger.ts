export function createBurger(): HTMLElement {
  const burger = document.createElement('button');
  burger.type = 'button';
  burger.dataset.headerVisibility = 'mobile';

  return burger;
}
