export type PageType = 'home' | 'library';

export interface RouteState {
  page: PageType;
  game?: string | undefined;
}

type RouteListener = (state: RouteState, previous: RouteState) => void;

export interface Router {
  readonly state: RouteState;
  goTo: (page: PageType) => void;
  update: (patch: Partial<Omit<RouteState, 'page'>>) => void;
  subscribe: (callback: RouteListener) => () => void;
}

const PAGE_PATHS: Record<PageType, string> = {
  home: '/',
  library: '/library',
};

export function parseUrl({ pathname, search }: Location | URL): RouteState {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const query = new URLSearchParams(search);

  return {
    page: path === PAGE_PATHS.library ? 'library' : 'home',
    game: query.get('game') || undefined,
  };
}

export function buildUrl(state: RouteState): string {
  const query = new URLSearchParams();
  if (state.game) {
    query.set('game', state.game);
  }

  const queryString = query.toString();
  return queryString ? `${PAGE_PATHS[state.page]}?${queryString}` : PAGE_PATHS[state.page];
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

  const navigate = (next: RouteState): void => {
    const url = buildUrl(next);
    if (url === location.pathname + location.search) {
      return;
    }

    history.pushState(undefined, '', url);
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
    update(patch) {
      navigate({ ...state, ...patch });
    },
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}
