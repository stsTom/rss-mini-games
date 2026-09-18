import { createHeader } from '../shared/header/header/header.js';

const main = document.querySelector('main');

if (main) {
  main.append(createHeader());
}
