import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRegisterForm } from '../../../../../../src/shared/features/auth-dialog/components/register-form/register-form.js';
import { signInWithGoogle } from '../../../../../../src/shared/features/auth-dialog/google-sign-in.js';
import { flush, makeSnackbar } from '../../../../../helpers.js';

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));
vi.mock('../../../../../../src/firebase.js', () => ({ auth: {} }));
vi.mock('../../../../../../src/shared/features/auth-dialog/google-sign-in.js', () => ({
  signInWithGoogle: vi.fn(),
}));

const setup = () => {
  const options = {
    onSwitchToLogin: vi.fn(),
    handleFetch: vi.fn(),
    onSuccess: vi.fn(),
    snackbar: makeSnackbar(),
  };
  const form = createRegisterForm(options);
  document.body.append(form);

  const get = (id: string) => {
    const input = form.querySelector<HTMLInputElement>(`#${id}`);
    if (!input) {
      throw new Error(`${id} missing`);
    }
    return input;
  };
  const labels = form.querySelectorAll('.error-label');
  const submit = () => form.dispatchEvent(new Event('submit', { cancelable: true }));
  const fill = () => {
    get('register-username').value = 'Jane';
    get('register-email').value = 'jane@example.com';
    get('register-password').value = 'Passw0rd!';
    get('register-confirm-password').value = 'Passw0rd!';
  };

  return {
    form,
    username: get('register-username'),
    email: get('register-email'),
    password: get('register-password'),
    confirm: get('register-confirm-password'),
    labels,
    options,
    submit,
    fill,
  };
};

describe('createRegisterForm', () => {
  beforeEach(() => {
    vi.mocked(createUserWithEmailAndPassword).mockReset();
    vi.mocked(updateProfile).mockReset();
    vi.mocked(signInWithGoogle).mockReset();
  });

  it('shows all errors for an empty submit', async () => {
    const { submit, labels } = setup();

    submit();
    await flush();

    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    expect([...labels].slice(0, 3).every((label) => label.textContent !== '')).toBe(true);
  });

  it('does not register when only some fields are invalid', async () => {
    const { submit, fill, password, confirm } = setup();
    fill();
    password.value = 'weak';
    confirm.value = 'weak';

    submit();
    await flush();

    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('creates the account and sets the display name', async () => {
    const user = { email: 'jane@example.com' };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user } as never);
    vi.mocked(updateProfile).mockResolvedValue();
    const { submit, fill, options } = setup();
    fill();

    submit();
    await flush();

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      'jane@example.com',
      'Passw0rd!'
    );
    expect(updateProfile).toHaveBeenCalledWith(user, { displayName: 'Jane' });
    expect(options.onSuccess).toHaveBeenCalledWith(user, 'Jane');
    expect(options.handleFetch).toHaveBeenLastCalledWith(false);
  });

  it('reports a failed registration', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(new Error('taken'));
    const { submit, fill, options } = setup();
    fill();

    submit();
    await flush();

    expect(options.snackbar.show).toHaveBeenCalledWith(expect.any(String), 'error');
    expect(options.onSuccess).not.toHaveBeenCalled();
  });

  it('validates the username on input and blur', () => {
    const { username, labels } = setup();

    username.dispatchEvent(new Event('blur'));
    expect(labels[0]?.textContent).not.toBe('');

    username.value = 'Jane';
    username.dispatchEvent(new Event('input'));
    expect(labels[0]?.textContent).toBe('');
  });

  it('validates email and password after the first blur', () => {
    const { email, password, labels } = setup();

    email.dispatchEvent(new Event('blur'));
    password.dispatchEvent(new Event('blur'));
    expect(labels[1]?.textContent).not.toBe('');
    expect(labels[2]?.textContent).not.toBe('');

    email.value = 'jane@example.com';
    email.dispatchEvent(new Event('input'));
    password.value = 'Passw0rd!';
    password.dispatchEvent(new Event('input'));
    expect(labels[1]?.textContent).toBe('');
    expect(labels[2]?.textContent).toBe('');
  });

  it('checks that the passwords match', () => {
    const { password, confirm, labels } = setup();
    password.value = 'Passw0rd!';

    confirm.value = 'other';
    confirm.dispatchEvent(new Event('input'));
    expect(labels[3]?.textContent).toBe('Passwords must match');

    password.dispatchEvent(new Event('input'));
    expect(labels[3]?.textContent).toBe('Passwords must match');

    confirm.value = 'Passw0rd!';
    confirm.dispatchEvent(new Event('blur'));
    expect(labels[3]?.textContent).toBe('');
  });

  it('does not re-check the confirmation while it is empty', () => {
    const { password, labels } = setup();

    password.dispatchEvent(new Event('input'));

    expect(labels[3]?.textContent).toBe('');
  });

  it('signs up with Google', async () => {
    const user = { email: 'g@x' };
    vi.mocked(signInWithGoogle).mockResolvedValue({ user } as never);
    const { form, options } = setup();

    form.querySelector<HTMLButtonElement>('.google-button')?.click();
    await flush();

    expect(options.onSuccess).toHaveBeenCalledWith(user);
  });

  it('ignores a cancelled Google sign up', async () => {
    vi.mocked(signInWithGoogle).mockResolvedValue(undefined);
    const { form, options } = setup();

    form.querySelector<HTMLButtonElement>('.google-button')?.click();
    await flush();

    expect(options.onSuccess).not.toHaveBeenCalled();
  });

  it('switches to login', () => {
    const { form, options } = setup();

    form.querySelector<HTMLButtonElement>('.footer button')?.click();

    expect(options.onSwitchToLogin).toHaveBeenCalledOnce();
  });
});
