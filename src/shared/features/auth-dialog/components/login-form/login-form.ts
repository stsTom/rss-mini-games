import './login-form.scss';

export interface LoginFormOptions {
  onSwitchToRegister: () => void;
}

export function createLoginForm(options: LoginFormOptions): HTMLFormElement {
  const form = document.createElement('form');
  form.classList.add('login-form');

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

  const forgotPasswordLink = document.createElement('a');
  forgotPasswordLink.textContent = 'Forgot Password?';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Login';

  const googleButton = document.createElement('button');
  googleButton.type = 'button';
  googleButton.textContent = 'Continue with Google';

  const switchToRegisterLink = document.createElement('button');
  switchToRegisterLink.type = 'button';
  switchToRegisterLink.textContent = "Don't have an account? Register";
  switchToRegisterLink.addEventListener('click', () => {
    options.onSwitchToRegister();
  });

  form.append(
    emailLabel,
    passwordLabel,
    forgotPasswordLink,
    submitButton,
    googleButton,
    switchToRegisterLink
  );

  return form;
}
