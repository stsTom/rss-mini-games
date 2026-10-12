import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../../../../src/shared/api/games-data.js';
import { createGamesCarousel } from '../../../../../src/pages/home/features/games-carousel/games-carousel.js';
import { makeGame } from '../../../../helpers.js';

vi.mock('../../../../../src/shared/api/games-data.js');

const games = ['a', 'b', 'c', 'd', 'e', 'f'].map((slug) => makeGame({ slug, name: slug }));

const settle = () => vi.advanceTimersByTimeAsync(0);

const pointer = (type: string, x: number, y = 0, isPrimary = true) =>
  new PointerEvent(type, { isPrimary, clientX: x, clientY: y, pointerId: 1, bubbles: true });

const roles = (section: HTMLElement) =>
  [...section.querySelectorAll<HTMLElement>('.games-carousel-slot')].map(
    (slot) => slot.dataset['slotRole']
  );

const mount = async (onGameSelect?: (game: unknown, onClose: () => void) => void) => {
  const section = createGamesCarousel(onGameSelect ? { onGameSelect } : {});
  document.body.append(section);
  await settle();
  return section;
};

describe('createGamesCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(api.fetchGames).mockReset();
    vi.mocked(api.fetchGames).mockResolvedValue(games);
    HTMLElement.prototype.setPointerCapture = vi.fn();
    document.elementFromPoint = vi.fn();
  });

  afterEach(() => {
    Reflect.deleteProperty(document, 'startViewTransition');
  });

  it('renders skeleton slots then the games with roles', async () => {
    const section = createGamesCarousel();
    expect(section.querySelectorAll('.card-skeleton')).toHaveLength(5);
    expect(section.getAttribute('aria-busy')).toBe('true');
    document.body.append(section);
    await settle();

    expect(section.hasAttribute('aria-busy')).toBe(false);
    expect(roles(section)).toEqual([
      'focus',
      'peek-right',
      'thumb-right',
      undefined,
      'thumb-left',
      'peek-left',
    ]);
  });

  it('shows an empty banner without featured games', async () => {
    vi.mocked(api.fetchGames).mockResolvedValue([]);

    const section = await mount();

    expect(section.querySelector('.empty-banner')).not.toBeNull();
  });

  it('shows an error that can be retried', async () => {
    vi.mocked(api.fetchGames).mockRejectedValueOnce(new Error('down'));

    const section = await mount();
    section.querySelector<HTMLButtonElement>('.error-layout-retry')?.click();
    await settle();

    expect(api.fetchGames).toHaveBeenCalledTimes(2);
    expect(section.querySelectorAll('.games-carousel-slot')).toHaveLength(6);
  });

  it('navigates with the header controls', async () => {
    const section = await mount();

    section.querySelector<HTMLButtonElement>('.games-carousel-header-control--next')?.click();
    expect(roles(section)[1]).toBe('focus');

    section.querySelector<HTMLButtonElement>('.games-carousel-header-control--prev')?.click();
    section.querySelector<HTMLButtonElement>('.games-carousel-header-control--prev')?.click();
    expect(roles(section)[5]).toBe('focus');
  });

  it('ignores header controls before games are loaded', () => {
    vi.mocked(api.fetchGames).mockReturnValue(new Promise(() => {}));
    const section = createGamesCarousel();

    section.querySelector<HTMLButtonElement>('.games-carousel-header-control--next')?.click();

    expect(roles(section)[2]).toBe('focus');
  });

  it('autoplays while connected', async () => {
    const section = await mount();

    await vi.advanceTimersByTimeAsync(4000);

    expect(roles(section)[1]).toBe('focus');
  });

  it('does not autoplay when detached', async () => {
    const section = await mount();
    section.remove();

    await vi.advanceTimersByTimeAsync(4000);

    expect(roles(section)[0]).toBe('focus');
  });

  it('uses view transitions when available', async () => {
    const skipTransition = vi.fn();
    const startViewTransition = vi.fn((callback: () => void) => {
      callback();
      return { finished: Promise.resolve(), skipTransition };
    });
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      configurable: true,
    });
    const section = await mount();
    const next = section.querySelector<HTMLButtonElement>('.games-carousel-header-control--next');

    next?.click();
    next?.click();
    await settle();

    expect(startViewTransition).toHaveBeenCalledTimes(2);
    expect(skipTransition).toHaveBeenCalled();
    expect(document.documentElement.dataset['gamesCarouselDirection']).toBe('next');
    expect(section.classList.contains('games-carousel--capturing')).toBe(false);
  });

  it('skips view transitions for reduced motion', async () => {
    vi.mocked(globalThis.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    const startViewTransition = vi.fn();
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      configurable: true,
    });
    const section = await mount();

    section.querySelector<HTMLButtonElement>('.games-carousel-header-control--next')?.click();

    expect(startViewTransition).not.toHaveBeenCalled();
  });

  it('swipes between slots', async () => {
    const section = await mount();
    const content = section.querySelector('.games-carousel-content');

    content?.dispatchEvent(pointer('pointerdown', 200));
    content?.dispatchEvent(pointer('pointerup', 100));
    expect(roles(section)[1]).toBe('focus');

    content?.dispatchEvent(pointer('pointerdown', 100));
    content?.dispatchEvent(pointer('pointerup', 200));
    expect(roles(section)[0]).toBe('focus');
  });

  it('selects the tapped game', async () => {
    const onGameSelect = vi.fn();
    const section = await mount(onGameSelect);
    const content = section.querySelector('.games-carousel-content');
    const slots = section.querySelectorAll('.games-carousel-slot');
    vi.mocked(document.elementFromPoint).mockReturnValue(slots[2] ?? null);

    content?.dispatchEvent(pointer('pointerdown', 100));
    content?.dispatchEvent(pointer('pointerup', 102));

    expect(onGameSelect).toHaveBeenCalledWith(games[2], expect.any(Function));
  });

  it('resumes autoplay when a tap hits nothing, and on cancel', async () => {
    const section = await mount();
    const content = section.querySelector('.games-carousel-content');

    content?.dispatchEvent(pointer('pointerdown', 100));
    content?.dispatchEvent(pointer('pointerup', 100));
    content?.dispatchEvent(pointer('pointerdown', 100));
    content?.dispatchEvent(new Event('pointercancel'));
    await vi.advanceTimersByTimeAsync(4000);

    expect(roles(section)[1]).toBe('focus');
  });

  it('ignores non-primary pointers and stray pointerup', async () => {
    const section = await mount();
    const content = section.querySelector('.games-carousel-content');

    content?.dispatchEvent(pointer('pointerdown', 200, 0, false));
    content?.dispatchEvent(pointer('pointerup', 100));
    content?.dispatchEvent(pointer('pointerdown', 200));
    content?.dispatchEvent(pointer('pointerup', 100, 0, false));

    expect(roles(section)[0]).toBe('focus');
  });
});
