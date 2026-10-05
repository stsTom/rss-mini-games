import './not-found.scss';
import { buildUrl, isModifiedClick, type Router } from '../../shared/services/router.js';

export interface NotFoundPageOptions {
  router: Router;
}

export function createNotFoundPage({ router }: NotFoundPageOptions): HTMLElement {
  const page = document.createElement('section');
  page.classList.add('not-found');

  const code = document.createElement('h1');
  code.classList.add('not-found-code');
  code.textContent = '404';

  const title = document.createElement('h2');
  title.classList.add('not-found-title');
  title.textContent = 'Page not found';

  const text = document.createElement('p');
  text.classList.add('not-found-text');
  text.textContent = "The page you're looking for doesn't exist or has been moved.";

  const homeLink = document.createElement('a');
  homeLink.classList.add('not-found-link');
  homeLink.href = buildUrl({ page: 'home' });
  homeLink.textContent = 'Back to Home';
  homeLink.addEventListener('click', (event) => {
    if (isModifiedClick(event)) {
      return;
    }

    event.preventDefault();
    router.goTo('home');
  });

  page.append(code, title, text, homeLink);

  return page;
}
