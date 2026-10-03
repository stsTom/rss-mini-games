import './card-skeleton.scss';

export function createCardSkeleton(): HTMLElement {
  const skeleton = document.createElement('div');
  skeleton.classList.add('card-skeleton');
  skeleton.setAttribute('aria-hidden', 'true');

  return skeleton;
}
