import './register-form.scss';

export interface RegisterFormOptions {
  onSwitchToLogin: () => void;
}

export function createRegisterForm(options: RegisterFormOptions): HTMLFormElement {
  const form = document.createElement('form');
  form.classList.add('register-form');

  const usernameLabel = document.createElement('label');
  usernameLabel.textContent = 'Username';
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameLabel.append(usernameInput);

  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email Address';
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailLabel.append(emailInput);

  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordLabel.append(passwordInput);

  const confirmPasswordLabel = document.createElement('label');
  confirmPasswordLabel.textContent = 'Confirm Password';
  const confirmPasswordInput = document.createElement('input');
  confirmPasswordInput.type = 'password';
  confirmPasswordLabel.append(confirmPasswordInput);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Create Account';

  const googleButton = document.createElement('button');
  googleButton.type = 'button';
  googleButton.textContent = 'Sign up with Google';

  const switchToLoginLink = document.createElement('button');
  switchToLoginLink.type = 'button';
  switchToLoginLink.textContent = 'Already have an account? Login';
  switchToLoginLink.addEventListener('click', () => {
    options.onSwitchToLogin();
  });

  form.append(
    usernameLabel,
    emailLabel,
    passwordLabel,
    confirmPasswordLabel,
    submitButton,
    googleButton,
    switchToLoginLink
  );

  return form;
}
