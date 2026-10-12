import { describe, expect, it, vi } from 'vitest';
import { createAuthDialog } from '../../../../src/shared/features/auth-dialog/auth-dialog.js';
import { signInWithGoogle } from '../../../../src/shared/features/auth-dialog/google-sign-in.js';
import { flush, makeSnackbar } from '../../../helpers.js';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));
vi.mock('../../../../src/firebase.js', () => ({ auth: {} }));
vi.mock('../../../../src/shared/features/auth-dialog/google-sign-in.js', () => ({
  signInWithGoogle: vi.fn(),
}));

const setup = () => {
  const options = {
    onTabChange: vi.fn(),
    onClose: vi.fn(),
    onAuthenticated: vi.fn(),
    snackbar: makeSnackbar(),
  };
  const dialog = createAuthDialog(options);
  document.body.append(dialog.element);
  const tabs = dialog.element.querySelectorAll<HTMLButtonElement>('.auth-dialog-tabs button');
  return { dialog, options, loginTab: tabs[0], registerTab: tabs[1] };
};

describe('createAuthDialog', () => {
  it('renders the login form first', () => {
    const { dialog, loginTab } = setup();

    dialog.open('login');

    expect(dialog.element.querySelector('.login-form')).not.toBeNull();
    expect(dialog.element.dataset['authDialogTab']).toBe('login');
    expect(loginTab?.classList.contains('is-active')).toBe(true);
  });

  it('fades between tabs when open', () => {
    const { dialog } = setup();
    dialog.open('login');

    dialog.open('register');
    const view = dialog.element.querySelector('.auth-dialog-view');
    expect(view?.classList.contains('fade-out')).toBe(true);

    view?.dispatchEvent(new Event('transitionend'));

    expect(dialog.element.querySelector('.register-form')).not.toBeNull();
    expect(view?.classList.contains('fade-out')).toBe(false);
  });

  it('ignores opening the same tab again', () => {
    const { dialog } = setup();
    dialog.open('login');

    dialog.open('login');

    expect(dialog.element.querySelector('.auth-dialog-view')?.classList.contains('fade-out')).toBe(
      false
    );
  });

  it('requests tab changes from the tab buttons and form links', () => {
    const { dialog, options, loginTab, registerTab } = setup();
    dialog.open('login');

    registerTab?.click();
    loginTab?.click();
    dialog.element.querySelector<HTMLButtonElement>('.login-form .footer button')?.click();

    expect(options.onTabChange).toHaveBeenNthCalledWith(1, 'register');
    expect(options.onTabChange).toHaveBeenNthCalledWith(2, 'login');
    expect(options.onTabChange).toHaveBeenNthCalledWith(3, 'register');
  });

  it('switches from register to login via the form link', () => {
    const { dialog, options } = setup();
    dialog.open('register');

    dialog.element.querySelector<HTMLButtonElement>('.register-form .footer button')?.click();

    expect(options.onTabChange).toHaveBeenCalledWith('login');
  });

  it('blocks tab changes and closing while busy', async () => {
    let finish: (value: undefined) => void = () => {};
    vi.mocked(signInWithGoogle).mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const { dialog, options } = setup();
    dialog.open('login');

    dialog.element.querySelector<HTMLButtonElement>('.google-button')?.click();
    expect(dialog.isBusy()).toBe(true);
    expect(dialog.element.classList.contains('is-busy')).toBe(true);

    dialog.element.querySelector<HTMLButtonElement>('.login-form .footer button')?.click();
    dialog.close();
    expect(options.onTabChange).not.toHaveBeenCalled();
    expect(dialog.element.close).not.toHaveBeenCalled();

    finish(undefined);
    await flush();
    expect(dialog.isBusy()).toBe(false);
  });

  it('notifies and closes after authentication', async () => {
    const user = { email: 'g@x' };
    vi.mocked(signInWithGoogle).mockResolvedValue({ user } as never);
    const { dialog, options } = setup();
    dialog.open('login');

    dialog.element.querySelector<HTMLButtonElement>('.google-button')?.click();
    await flush();

    expect(options.onAuthenticated).toHaveBeenCalledWith(user, undefined);
    expect(dialog.element.close).toHaveBeenCalled();
    expect(options.onClose).toHaveBeenCalled();
  });
});
