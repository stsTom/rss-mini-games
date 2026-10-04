export function createErrorPlaceholder(refetch: () => void) {
  const container = document.createElement('div');
  const placeholderText = document.createElement('p');
  placeholderText.textContent =
    'Oops, somthing went wrong while fetching data for this element.Please, try again';

  const retryButton = document.createElement('button');
  retryButton.textContent = 'Retry';
  retryButton.addEventListener('click', () => refetch());

  container.append(placeholderText, retryButton);

  return container;
}
