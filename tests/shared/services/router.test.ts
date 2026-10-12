import { describe, expect, it, vi } from 'vitest';
import {
  buildUrl,
  createRouter,
  isModifiedClick,
  parseUrl,
  type RouteState,
} from '../../../src/shared/services/router.js';

describe('parseUrl', () => {
  it('resolves known pages', () => {
    expect(parseUrl(new URL('http://x/')).page).toBe('home');
    expect(parseUrl(new URL('http://x/home')).page).toBe('home');
    expect(parseUrl(new URL('http://x/library')).page).toBe('library');
    expect(parseUrl(new URL('http://x/library/')).page).toBe('library');
    expect(parseUrl(new URL('http://x/missing')).page).toBe('not-found');
  });

  it('reads query parameters', () => {
    const state = parseUrl(
      new URL('http://x/library?game=tetris&auth=login&category=arcade&sort=rating&page=3')
    );

    expect(state).toEqual({
      page: 'library',
      game: 'tetris',
      auth: 'login',
      category: 'arcade',
      sort: 'rating',
      pageNumber: 3,
    });
  });

  it('drops invalid auth and page values', () => {
    const state = parseUrl(new URL('http://x/library?auth=hack&page=1'));

    expect(state.auth).toBeUndefined();
    expect(state.pageNumber).toBeUndefined();
    expect(parseUrl(new URL('http://x/library?page=abc')).pageNumber).toBeUndefined();
  });
});

describe('buildUrl', () => {
  it('returns bare path without params', () => {
    expect(buildUrl({ page: 'home' })).toBe('/');
    expect(buildUrl({ page: 'library' })).toBe('/library');
  });

  it('serialises all params', () => {
    const state: RouteState = {
      page: 'library',
      category: 'arcade',
      sort: 'rating',
      pageNumber: 2,
      game: 'tetris',
      auth: 'register',
    };

    expect(buildUrl(state)).toBe(
      '/library?category=arcade&sort=rating&page=2&game=tetris&auth=register'
    );
  });

  it('omits page number 1', () => {
    expect(buildUrl({ page: 'library', pageNumber: 1 })).toBe('/library');
  });

  it('keeps current pathname for not-found', () => {
    history.replaceState(null, '', '/nowhere');

    expect(buildUrl({ page: 'not-found' })).toBe('/nowhere');
  });
});

describe('isModifiedClick', () => {
  it('detects modifiers and non-primary buttons', () => {
    expect(isModifiedClick(new MouseEvent('click'))).toBe(false);
    expect(isModifiedClick(new MouseEvent('click', { ctrlKey: true }))).toBe(true);
    expect(isModifiedClick(new MouseEvent('click', { metaKey: true }))).toBe(true);
    expect(isModifiedClick(new MouseEvent('click', { shiftKey: true }))).toBe(true);
    expect(isModifiedClick(new MouseEvent('click', { altKey: true }))).toBe(true);
    expect(isModifiedClick(new MouseEvent('click', { button: 1 }))).toBe(true);
  });
});

describe('createRouter', () => {
  it('reads initial state from location', () => {
    history.replaceState(null, '', '/library?category=puzzle');

    const router = createRouter();

    expect(router.state.page).toBe('library');
    expect(router.state.category).toBe('puzzle');
  });

  it('goTo pushes a new url and notifies listeners', () => {
    const router = createRouter();
    const listener = vi.fn();
    router.subscribe(listener);

    router.goTo('library');

    expect(location.pathname).toBe('/library');
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]?.[0].page).toBe('library');
    expect(listener.mock.calls[0]?.[1].page).toBe('home');
  });

  it('does nothing when the url is unchanged', () => {
    const router = createRouter();
    const listener = vi.fn();
    router.subscribe(listener);

    router.goTo('home');

    expect(listener).not.toHaveBeenCalled();
  });

  it('update merges patch and supports replace', () => {
    const router = createRouter();
    const pushSpy = vi.spyOn(history, 'pushState');
    const replaceSpy = vi.spyOn(history, 'replaceState');

    router.update({ game: 'snake' });
    router.update({ auth: 'login' }, { replace: true });

    expect(pushSpy).toHaveBeenCalledOnce();
    expect(replaceSpy).toHaveBeenCalledOnce();
    expect(router.state).toMatchObject({ game: 'snake', auth: 'login' });
    expect(location.search).toBe('?game=snake&auth=login');
  });

  it('unsubscribes listeners', () => {
    const router = createRouter();
    const listener = vi.fn();
    const unsubscribe = router.subscribe(listener);

    unsubscribe();
    router.goTo('library');

    expect(listener).not.toHaveBeenCalled();
  });

  it('applies guard to navigation', () => {
    const router = createRouter({ guard: (next) => ({ ...next, auth: undefined }) });

    router.update({ auth: 'login' });

    expect(router.state.auth).toBeUndefined();
    expect(location.search).toBe('');
  });

  it('strips guarded auth param from the initial url', () => {
    history.replaceState(null, '', '/library?auth=login&category=arcade');

    const router = createRouter({ guard: (next) => ({ ...next, auth: undefined }) });

    expect(router.state.auth).toBeUndefined();
    expect(location.search).toBe('?category=arcade');
  });

  it('reacts to popstate', () => {
    const router = createRouter();
    const listener = vi.fn();
    router.subscribe(listener);

    history.pushState(null, '', '/library?sort=name');
    globalThis.dispatchEvent(new PopStateEvent('popstate'));

    expect(router.state).toMatchObject({ page: 'library', sort: 'name' });
    expect(listener).toHaveBeenCalled();
  });
});
