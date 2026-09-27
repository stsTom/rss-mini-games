export function createLibraryHeader(): HTMLElement {
  const header = document.createElement('div');
  header.classList.add('library-header');

  const title = document.createElement('h2');
  title.classList.add('library-header-title');
  title.textContent = 'Game Library';

  const subtitle = document.createElement('p');
  subtitle.classList.add('library-header-subtitle');
  subtitle.textContent = 'Browse our collection of casual mini-games';

  header.append(title, subtitle);

  return header;
}
