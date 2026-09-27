export type PageType = 'home' | 'library';

export interface Router {
  readonly currentPage: PageType;
  onPageChange: (page: PageType) => void;
  subscribe: (callback: (page: PageType) => void) => void;
}

export function createRouter(initialPage: PageType = 'home'): Router {
  let currentPage = initialPage;
  const listeners = new Set<(page: PageType) => void>();

  return {
    get currentPage() {
      return currentPage;
    },
    onPageChange(page) {
      if (page === currentPage) {
        return;
      }

      currentPage = page;
      for (const listener of listeners) {
        listener(page);
      }
    },
    subscribe(callback) {
      listeners.add(callback);
    },
  };
}
