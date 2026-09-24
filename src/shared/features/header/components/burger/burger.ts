import './burger.scss';
import { HEADER_VISIBILITY } from '../../dataset-values.js';

export function createBurger(): HTMLElement {
  const burger = document.createElement('button');
  burger.type = 'button';
  burger.dataset.headerVisibility = HEADER_VISIBILITY.mobile;

  for (let index = 0; index < 3; index += 1) {
    const line = document.createElement('span');
    line.classList.add('burger-line');
    burger.append(line);
  }

  return burger;
}
