export function createEmptyBanner() {
  const container = document.createElement('div');

  const placeholderText = document.createElement('p');
  placeholderText.textContent = 'It looks like we have nothing on this request. Weird...';

  container.append(placeholderText);

  return container;
}
