import './browse-library-button.scss';

export function createBrowseLibraryButton(): HTMLElement {
  const link = document.createElement('a');
  link.href = '#library';
  link.textContent = 'Browse Library';

  return link;
}
