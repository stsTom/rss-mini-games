import './register-form.scss';

export interface RegisterFormOptions {
  onSwitchToLogin: () => void;
}

export function createRegisterForm(options: RegisterFormOptions): HTMLFormElement {
  const form = document.createElement('form');
  form.classList.add('register-form');

  const headerText = document.createElement('div');
  headerText.classList.add('header-text');
  const heading = document.createElement('h2');
  heading.textContent = 'Create Account';
  const subtext = document.createElement('p');
  subtext.textContent = 'Join MiniGames to track your score & streak.';
  headerText.append(heading, subtext);

  const usernameField = document.createElement('div');
  usernameField.classList.add('field');
  const usernameLabel = document.createElement('label');
  usernameLabel.textContent = 'Username';
  usernameLabel.htmlFor = 'register-username';
  const usernameInputWrapper = document.createElement('div');
  usernameInputWrapper.classList.add('input-wrapper');
  const usernameIcon = document.createElement('span');
  usernameIcon.classList.add('field-icon', 'field-icon--person');
  usernameIcon.setAttribute('aria-hidden', 'true');
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.id = 'register-username';
  usernameInput.placeholder = 'e.g. CozyGamer_99';
  usernameInputWrapper.append(usernameIcon, usernameInput);
  usernameField.append(usernameLabel, usernameInputWrapper);

  const emailField = document.createElement('div');
  emailField.classList.add('field');
  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email Address';
  emailLabel.htmlFor = 'register-email';
  const emailInputWrapper = document.createElement('div');
  emailInputWrapper.classList.add('input-wrapper');
  const emailIcon = document.createElement('span');
  emailIcon.classList.add('field-icon', 'field-icon--mail');
  emailIcon.setAttribute('aria-hidden', 'true');
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'register-email';
  emailInput.placeholder = 'your.email@domain.com';
  emailInputWrapper.append(emailIcon, emailInput);
  emailField.append(emailLabel, emailInputWrapper);

  const passwordField = document.createElement('div');
  passwordField.classList.add('field');
  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  passwordLabel.htmlFor = 'register-password';
  const passwordInputWrapper = document.createElement('div');
  passwordInputWrapper.classList.add('input-wrapper');
  const passwordIcon = document.createElement('span');
  passwordIcon.classList.add('field-icon', 'field-icon--lock');
  passwordIcon.setAttribute('aria-hidden', 'true');
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'register-password';
  passwordInput.placeholder = 'Min. 8 characters';
  const passwordVisibilityIcon = document.createElement('span');
  passwordVisibilityIcon.classList.add('field-icon', 'field-icon--eye');
  passwordVisibilityIcon.setAttribute('aria-hidden', 'true');
  passwordInputWrapper.append(passwordIcon, passwordInput, passwordVisibilityIcon);
  passwordField.append(passwordLabel, passwordInputWrapper);

  const confirmPasswordField = document.createElement('div');
  confirmPasswordField.classList.add('field');
  const confirmPasswordLabel = document.createElement('label');
  confirmPasswordLabel.textContent = 'Confirm Password';
  confirmPasswordLabel.htmlFor = 'register-confirm-password';
  const confirmPasswordInputWrapper = document.createElement('div');
  confirmPasswordInputWrapper.classList.add('input-wrapper');
  const confirmPasswordIcon = document.createElement('span');
  confirmPasswordIcon.classList.add('field-icon', 'field-icon--lock');
  confirmPasswordIcon.setAttribute('aria-hidden', 'true');
  const confirmPasswordInput = document.createElement('input');
  confirmPasswordInput.type = 'password';
  confirmPasswordInput.id = 'register-confirm-password';
  confirmPasswordInput.placeholder = 'Repeat your password';
  const confirmPasswordVisibilityIcon = document.createElement('span');
  confirmPasswordVisibilityIcon.classList.add('field-icon', 'field-icon--eye');
  confirmPasswordVisibilityIcon.setAttribute('aria-hidden', 'true');
  confirmPasswordInputWrapper.append(
    confirmPasswordIcon,
    confirmPasswordInput,
    confirmPasswordVisibilityIcon
  );
  confirmPasswordField.append(confirmPasswordLabel, confirmPasswordInputWrapper);

  const fields = document.createElement('div');
  fields.classList.add('fields');
  fields.append(usernameField, emailField, passwordField, confirmPasswordField);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('cta-button');
  submitButton.textContent = 'Create Account';

  const googleButton = document.createElement('button');
  googleButton.type = 'button';
  googleButton.classList.add('google-button');
  const googleIcon = document.createElement('img');
  googleIcon.classList.add('google-icon');
  googleIcon.src = '/icons/google.svg';
  googleIcon.alt = '';
  const googleLabel = document.createElement('span');
  googleLabel.textContent = 'Sign up with Google';
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
  footerText.textContent = 'Already have an account? ';
  const switchToLoginLink = document.createElement('button');
  switchToLoginLink.type = 'button';
  switchToLoginLink.textContent = 'Login';
  switchToLoginLink.addEventListener('click', () => {
    options.onSwitchToLogin();
  });
  const footer = document.createElement('div');
  footer.classList.add('footer');
  footer.append(footerText, switchToLoginLink);

  form.append(headerText, fields, actions, footer);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  return form;
}
