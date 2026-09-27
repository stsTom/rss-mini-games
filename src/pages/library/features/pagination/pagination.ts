import './pagination.scss';

const MAX_PAGES = 4;
const MOBILE_VISIBLE_PAGES = 3;
const GLYPH_PREVIOUS = '‹';
const GLYPH_NEXT = '›';

function createArrow(glyph: string, label: string): HTMLButtonElement {
  const arrow = document.createElement('button');
  arrow.type = 'button';
  arrow.classList.add('pagination-button', 'pagination-arrow');
  arrow.textContent = glyph;
  arrow.setAttribute('aria-label', label);
  return arrow;
}

export function createPagination(): HTMLElement {
  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  pagination.setAttribute('role', 'navigation');
  pagination.setAttribute('aria-label', 'Pagination');

  const previous = createArrow(GLYPH_PREVIOUS, 'Previous page');
  const next = createArrow(GLYPH_NEXT, 'Next page');

  const pages = Array.from({ length: MAX_PAGES }, (_, index) => {
    const page = document.createElement('button');
    page.type = 'button';
    page.classList.add('pagination-button');
    page.textContent = String(index + 1);
    page.addEventListener('click', () => setActive(index + 1));
    return page;
  });

  function setActive(active: number): void {
    const windowStart = Math.min(Math.max(active - 1, 1), MAX_PAGES - MOBILE_VISIBLE_PAGES + 1);

    for (const [index, page] of pages.entries()) {
      const number = index + 1;
      page.ariaCurrent = number === active ? 'page' : 'false';
      page.dataset.mobileHidden = String(
        number < windowStart || number >= windowStart + MOBILE_VISIBLE_PAGES
      );
    }

    previous.disabled = active === 1;
    next.disabled = active === MAX_PAGES;
    current = active;
  }

  let current = 1;
  previous.addEventListener('click', () => setActive(current - 1));
  next.addEventListener('click', () => setActive(current + 1));

  pagination.append(previous, ...pages, next);
  setActive(current);

  return pagination;
}
