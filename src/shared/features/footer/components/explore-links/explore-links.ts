import './explore-links.scss';

const EXPLORE_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'library', label: 'Library' },
  { id: 'categories', label: 'Categories' },
  { id: 'tournaments', label: 'Tournaments' },
];

export function createExploreLinks(): HTMLElement {
  const exploreLinks = document.createElement('nav');
  exploreLinks.classList.add('explore-links');

  const heading = document.createElement('h3');
  heading.textContent = 'Explore';
  exploreLinks.append(heading);

  for (const { id, label } of EXPLORE_ITEMS) {
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = label;
    link.dataset.text = label;
    exploreLinks.append(link);
  }

  return exploreLinks;
}
