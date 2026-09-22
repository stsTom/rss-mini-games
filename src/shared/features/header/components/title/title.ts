import './title.scss';

export function createTitle(): HTMLElement {
  const title = document.createElement('h1');
  title.classList.add('title');
  title.dataset.headerVisibility = 'always';

  const logo = document.createElement('span');
  logo.classList.add('title-logo');
  logo.textContent = '👾';
  logo.setAttribute('aria-hidden', 'true');

  const wordmark = document.createElement('span');
  wordmark.classList.add('title-wordmark');
  wordmark.textContent = 'MiniGames';

  title.append(logo, wordmark);

  return title;
}
