export function createRssLink(): HTMLElement {
  const link = document.createElement('a');
  link.href = 'https://rs.school/';
  link.classList.add('rss-link');

  const image = document.createElement('img');
  image.src = '/rss-logo.svg';
  image.alt = 'RS School';

  const label = document.createElement('span');
  label.textContent = 'RS School';

  link.append(image, label);

  return link;
}
