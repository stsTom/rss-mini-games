import './footer.scss';

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');

  const upperFooter = document.createElement('div');
  upperFooter.classList.add('upper-footer');

  const lowerFooter = document.createElement('div');
  lowerFooter.classList.add('lower-footer');

  footer.append(upperFooter, lowerFooter);

  return footer;
}
