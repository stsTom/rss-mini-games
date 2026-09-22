import './github-link.scss';

export function createGithubLink(): HTMLElement {
  const link = document.createElement('a');
  link.href = 'https://github.com/stsTom';
  link.classList.add('github-link');

  const image = document.createElement('img');
  image.src = '/author-logo.jpg';
  image.alt = 'stsTom';

  const label = document.createElement('span');
  label.textContent = '@stsTom';

  link.append(image, label);

  return link;
}
