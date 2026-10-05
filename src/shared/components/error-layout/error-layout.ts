import './error-layout.scss';

export function createErrorPlaceholder(refetch: () => void) {
  const container = document.createElement('div');
  container.classList.add('error-layout');

  const placeholderText = document.createElement('p');
  placeholderText.textContent =
    'Oops, something went wrong while fetching data for this element. Please, try again';

  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.classList.add('error-layout-retry');
  retryButton.textContent = 'Retry';
  retryButton.addEventListener('click', () => refetch());

  container.append(placeholderText, retryButton);

  return container;
}
