export type PageType = 'home' | 'library' | 'not-found';

export type AuthMode = 'login' | 'register';

export interface RouteState {
  page: PageType;
  game?: string | undefined;
  auth?: AuthMode | undefined;
  category?: string | undefined;
  sort?: string | undefined;
  pageNumber?: number | undefined;
}

type RouteListener = (state: RouteState, previous: RouteState) => void;

export interface NavigateOptions {
  replace?: boolean;
}

export interface Router {
  readonly state: RouteState;
  goTo: (page: PageType) => void;
  update: (patch: Partial<Omit<RouteState, 'page'>>, options?: NavigateOptions) => void;
  subscribe: (callback: RouteListener) => () => void;
}

const PAGE_PATHS: Record<Exclude<PageType, 'not-found'>, string> = {
  home: '/',
  library: '/library',
};
const HOME_ALIAS_PATH = '/home';

function resolvePage(path: string): PageType {
  if (path === HOME_ALIAS_PATH || path === PAGE_PATHS.home) {
    return 'home';
  }
  if (path === PAGE_PATHS.library) {
    return 'library';
  }

  return 'not-found';
}

export function parseUrl({ pathname, search }: Location | URL): RouteState {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const query = new URLSearchParams(search);
  const auth = query.get('auth');
  const pageNumber = Number(query.get('page'));

  return {
    page: resolvePage(path),
    game: query.get('game') || undefined,
    auth: auth === 'login' || auth === 'register' ? auth : undefined,
    category: query.get('category') || undefined,
    sort: query.get('sort') || undefined,
    pageNumber: Number.isSafeInteger(pageNumber) && pageNumber > 1 ? pageNumber : undefined,
  };
}

export function buildUrl(state: RouteState): string {
  const query = new URLSearchParams();
  if (state.category) {
    query.set('category', state.category);
  }
  if (state.sort) {
    query.set('sort', state.sort);
  }
  if (state.pageNumber && state.pageNumber > 1) {
    query.set('page', String(state.pageNumber));
  }
  if (state.game) {
    query.set('game', state.game);
  }
  if (state.auth) {
    query.set('auth', state.auth);
  }

  const path = state.page === 'not-found' ? location.pathname : PAGE_PATHS[state.page];
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export function isModifiedClick(event: MouseEvent): boolean {
  return event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
}

export function createRouter(): Router {
  let state = parseUrl(location);
  const listeners = new Set<RouteListener>();

  const apply = (next: RouteState): void => {
    const previous = state;
    state = next;

    for (const listener of listeners) {
      listener(state, previous);
    }
  };

  const navigate = (next: RouteState, { replace = false }: NavigateOptions = {}): void => {
    const url = buildUrl(next);
    if (url === location.pathname + location.search) {
      return;
    }

    if (replace) {
      history.replaceState(undefined, '', url);
    } else {
      history.pushState(undefined, '', url);
    }
    apply(next);
  };

  globalThis.addEventListener('popstate', () => apply(parseUrl(location)));

  return {
    get state() {
      return state;
    },
    goTo(page) {
      navigate({ page });
    },
    update(patch, options) {
      navigate({ ...state, ...patch }, options);
    },
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}
