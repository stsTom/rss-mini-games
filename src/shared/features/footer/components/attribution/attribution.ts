export function createAttribution(): HTMLElement {
  const attribution = document.createElement('p');
  attribution.textContent = 'Designed with love';
  attribution.dataset.footerVisibility = 'wide-and-up';

  return attribution;
}
