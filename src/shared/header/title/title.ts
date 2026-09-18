export function createTitle(): HTMLElement {
  const title = document.createElement('h1');
  title.textContent = 'MiniGames';
  title.dataset.headerVisibility = 'mobile';

  return title;
}
