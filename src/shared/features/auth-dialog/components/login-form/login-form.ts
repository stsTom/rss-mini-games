import './login-form.scss';

const GOOGLE_ICON_SRC = '/icons/google.svg';

export interface LoginFormOptions {
  onSwitchToRegister: () => void;
}

export function createLoginForm(options: LoginFormOptions): HTMLFormElement {
  const form = document.createElement('form');
  form.classList.add('login-form');

  const headerText = document.createElement('div');
  headerText.classList.add('header-text');
  const heading = document.createElement('h2');
  heading.textContent = 'Welcome Back!';
  const subtext = document.createElement('p');
  subtext.textContent = 'Sign in to resume your games and progress.';
  headerText.append(heading, subtext);

  const emailField = document.createElement('div');
  emailField.classList.add('field');
  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email Address';
  emailLabel.htmlFor = 'login-email';
  const emailInputWrapper = document.createElement('div');
  emailInputWrapper.classList.add('input-wrapper');
  const emailIcon = document.createElement('span');
  emailIcon.classList.add('field-icon', 'field-icon--mail');
  emailIcon.setAttribute('aria-hidden', 'true');
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'login-email';
  emailInput.placeholder = 'e.g. alex@minigames.com';
  emailInputWrapper.append(emailIcon, emailInput);
  emailField.append(emailLabel, emailInputWrapper);

  const passwordField = document.createElement('div');
  passwordField.classList.add('field');
  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  passwordLabel.htmlFor = 'login-password';
  const passwordInputWrapper = document.createElement('div');
  passwordInputWrapper.classList.add('input-wrapper');
  const passwordIcon = document.createElement('span');
  passwordIcon.classList.add('field-icon', 'field-icon--lock');
  passwordIcon.setAttribute('aria-hidden', 'true');
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'login-password';
  passwordInput.placeholder = '••••••••';
  const passwordVisibilityIcon = document.createElement('span');
  passwordVisibilityIcon.classList.add('field-icon', 'field-icon--eye');
  passwordVisibilityIcon.setAttribute('aria-hidden', 'true');
  passwordInputWrapper.append(passwordIcon, passwordInput, passwordVisibilityIcon);
  passwordField.append(passwordLabel, passwordInputWrapper);

  const forgotPasswordLink = document.createElement('a');
  forgotPasswordLink.textContent = 'Forgot Password?';
  const linksRow = document.createElement('div');
  linksRow.classList.add('links-row');
  linksRow.append(forgotPasswordLink);

  const fields = document.createElement('div');
  fields.classList.add('fields');
  fields.append(emailField, passwordField, linksRow);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('cta-button');
  submitButton.textContent = 'Login';

  const googleButton = document.createElement('button');
  googleButton.type = 'button';
  googleButton.classList.add('google-button');
  const googleIcon = document.createElement('img');
  googleIcon.classList.add('google-icon');
  googleIcon.src = GOOGLE_ICON_SRC;
  googleIcon.alt = '';
  const googleLabel = document.createElement('span');
  googleLabel.textContent = 'Continue with Google';
  googleButton.append(googleIcon, googleLabel);

  const divider = document.createElement('div');
  divider.classList.add('divider');
  const dividerLineLeft = document.createElement('span');
  dividerLineLeft.classList.add('divider-line');
  const dividerLabel = document.createElement('span');
  dividerLabel.classList.add('divider-label');
  dividerLabel.textContent = 'or';
  const dividerLineRight = document.createElement('span');
  dividerLineRight.classList.add('divider-line');
  divider.append(dividerLineLeft, dividerLabel, dividerLineRight);

  const actions = document.createElement('div');
  actions.classList.add('actions');
  actions.append(submitButton, divider, googleButton);

  const footerText = document.createElement('span');
  footerText.textContent = "Don't have an account? ";
  const switchToRegisterLink = document.createElement('button');
  switchToRegisterLink.type = 'button';
  switchToRegisterLink.textContent = 'Register';
  switchToRegisterLink.addEventListener('click', () => {
    options.onSwitchToRegister();
  });
  const footer = document.createElement('div');
  footer.classList.add('footer');
  footer.append(footerText, switchToRegisterLink);

  form.append(headerText, fields, actions, footer);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  return form;
}
