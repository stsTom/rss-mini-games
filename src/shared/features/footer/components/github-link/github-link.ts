import './github-link.scss';

export function createGithubLink(): HTMLElement {
  const link = document.createElement('a');
  link.href = 'https://github.com/stsTom';
  link.classList.add('github-link');

  const image = document.createElement('img');
  image.src = '/github-icon-placeholder.png';
  image.alt = 'GitHub';

  const label = document.createElement('span');
  label.textContent = '@stsTom';

  link.append(image, label);

  return link;
}
