import { signInWithEmailAndPassword } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createLoginForm } from '../../../../../../src/shared/features/auth-dialog/components/login-form/login-form.js';
import { signInWithGoogle } from '../../../../../../src/shared/features/auth-dialog/google-sign-in.js';
import { flush, makeSnackbar } from '../../../../../helpers.js';

vi.mock('firebase/auth', () => ({ signInWithEmailAndPassword: vi.fn() }));
vi.mock('../../../../../../src/firebase.js', () => ({ auth: {} }));
vi.mock('../../../../../../src/shared/features/auth-dialog/google-sign-in.js', () => ({
  signInWithGoogle: vi.fn(),
}));

const setup = () => {
  const options = {
    onSwitchToRegister: vi.fn(),
    handleFetch: vi.fn(),
    onSuccess: vi.fn(),
    snackbar: makeSnackbar(),
  };
  const form = createLoginForm(options);
  document.body.append(form);

  const email = form.querySelector<HTMLInputElement>('#login-email');
  const password = form.querySelector<HTMLInputElement>('#login-password');
  const labels = form.querySelectorAll('.error-label');
  if (!email || !password) {
    throw new Error('inputs missing');
  }
  const submit = () => form.dispatchEvent(new Event('submit', { cancelable: true }));

  return { form, email, password, labels, options, submit };
};

describe('createLoginForm', () => {
  beforeEach(() => {
    vi.mocked(signInWithEmailAndPassword).mockReset();
    vi.mocked(signInWithGoogle).mockReset();
  });

  it('shows errors and does not sign in when invalid', async () => {
    const { submit, labels, email } = setup();

    submit();
    await flush();

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    expect(labels[0]?.textContent).not.toBe('');
    expect(labels[1]?.textContent).not.toBe('');
    expect(email.ariaInvalid).toBe('true');
  });

  it('does not sign in when only one field is invalid', async () => {
    const { submit, email, password, labels } = setup();
    email.value = 'jane@example.com';
    password.value = '123';

    submit();
    await flush();

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    expect(labels[0]?.textContent).toBe('');
    expect(labels[1]?.textContent).not.toBe('');
  });

  it('signs in with valid credentials', async () => {
    const user = { email: 'jane@example.com' };
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({ user } as never);
    const { submit, email, password, options } = setup();
    email.value = 'jane@example.com';
    password.value = 'secret1';

    submit();
    await flush();

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'jane@example.com', 'secret1');
    expect(options.onSuccess).toHaveBeenCalledWith(user);
    expect(options.handleFetch).toHaveBeenLastCalledWith(false);
  });

  it('reports a failed sign in', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(new Error('bad'));
    const { submit, email, password, options } = setup();
    email.value = 'jane@example.com';
    password.value = 'secret1';

    submit();
    await flush();

    expect(options.snackbar.show).toHaveBeenCalledWith(expect.any(String), 'error');
    expect(options.onSuccess).not.toHaveBeenCalled();
  });

  it('validates on blur and then on input', () => {
    const { email, labels } = setup();

    email.dispatchEvent(new Event('blur'));
    expect(labels[0]?.textContent).not.toBe('');

    email.value = 'jane@example.com';
    email.dispatchEvent(new Event('input'));
    expect(labels[0]?.textContent).toBe('');
    expect(email.ariaInvalid).toBe('false');

    email.value = '';
    email.dispatchEvent(new Event('input'));
    expect(labels[0]?.textContent).toBe('');
  });

  it('validates the password on blur and input', () => {
    const { password, labels } = setup();

    password.dispatchEvent(new Event('blur'));
    expect(labels[1]?.textContent).not.toBe('');

    password.value = 'secret1';
    password.dispatchEvent(new Event('input'));
    expect(labels[1]?.textContent).toBe('');
  });

  it('signs in with Google', async () => {
    const user = { email: 'g@x' };
    vi.mocked(signInWithGoogle).mockResolvedValue({ user } as never);
    const { form, options } = setup();

    form.querySelector<HTMLButtonElement>('.google-button')?.click();
    await flush();

    expect(options.handleFetch).toHaveBeenCalledWith(true);
    expect(options.onSuccess).toHaveBeenCalledWith(user);
  });

  it('does nothing when Google sign in is cancelled', async () => {
    vi.mocked(signInWithGoogle).mockResolvedValue(undefined);
    const { form, options } = setup();

    form.querySelector<HTMLButtonElement>('.google-button')?.click();
    await flush();

    expect(options.onSuccess).not.toHaveBeenCalled();
    expect(options.handleFetch).toHaveBeenLastCalledWith(false);
  });

  it('switches to register', () => {
    const { form, options } = setup();

    form.querySelector<HTMLButtonElement>('.footer button')?.click();

    expect(options.onSwitchToRegister).toHaveBeenCalledOnce();
  });
});
