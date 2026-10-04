import './pagination.scss';

const MOBILE_VISIBLE_PAGES = 3;
const GLYPH_PREVIOUS = '‹';
const GLYPH_NEXT = '›';

export interface PaginationOptions {
  onPageChange: (page: number) => void;
}

export interface Pagination {
  element: HTMLElement;
  render: (active: number, totalPages: number) => void;
}

function createArrow(glyph: string, label: string): HTMLButtonElement {
  const arrow = document.createElement('button');
  arrow.type = 'button';
  arrow.classList.add('pagination-button', 'pagination-arrow');
  arrow.textContent = glyph;
  arrow.setAttribute('aria-label', label);
  return arrow;
}

export function createPagination({ onPageChange }: PaginationOptions): Pagination {
  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  pagination.setAttribute('role', 'navigation');
  pagination.setAttribute('aria-label', 'Pagination');
  pagination.hidden = true;

  const previous = createArrow(GLYPH_PREVIOUS, 'Previous page');
  const next = createArrow(GLYPH_NEXT, 'Next page');

  let current = 1;
  previous.addEventListener('click', () => onPageChange(current - 1));
  next.addEventListener('click', () => onPageChange(current + 1));

  function render(active: number, totalPages: number): void {
    current = active;
    pagination.hidden = totalPages <= 1;

    const windowStart = Math.max(1, Math.min(active - 1, totalPages - MOBILE_VISIBLE_PAGES + 1));

    const pages = Array.from({ length: totalPages }, (_, index) => {
      const number = index + 1;
      const page = document.createElement('button');
      page.type = 'button';
      page.classList.add('pagination-button');
      page.textContent = String(number);
      page.ariaCurrent = number === active ? 'page' : 'false';
      page.dataset.mobileHidden = String(
        number < windowStart || number >= windowStart + MOBILE_VISIBLE_PAGES
      );
      page.addEventListener('click', () => onPageChange(number));
      return page;
    });

    previous.disabled = active <= 1;
    next.disabled = active >= totalPages;
    pagination.replaceChildren(previous, ...pages, next);
  }

  return { element: pagination, render };
}
