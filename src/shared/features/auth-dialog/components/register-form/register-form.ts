import { createUserWithEmailAndPassword } from 'firebase/auth';
import { validateEmail, validatePassword, validateUsername } from '../../validation.js';
import './register-form.scss';
import { auth } from '../../../../../firebase.js';

const GOOGLE_ICON_SRC = '/icons/google.svg';

export interface RegisterFormOptions {
  onSwitchToLogin: () => void;
  handleFetch: (isPending: boolean) => void;
  onSuccess: () => void;
}

interface RegisterFormInputs {
  email: string;
  password: string;
  repeatedPassword: string;
  username: string;
}

const inputs = {} as Record<keyof RegisterFormInputs, HTMLInputElement>;
const errorLabels = {} as Record<keyof RegisterFormInputs, HTMLElement>;

const validators: Record<keyof RegisterFormInputs, () => string> = {
  username: () => validateUsername(inputs.username.value),
  email: () => validateEmail(inputs.email.value),
  password: () => validatePassword(inputs.password.value),
  repeatedPassword: () =>
    inputs.repeatedPassword.value === inputs.password.value ? '' : 'Passwords must match',
};

function showError(key: keyof RegisterFormInputs) {
  const message = validators[key]();

  errorLabels[key].textContent = message;
  inputs[key].ariaInvalid = message ? 'true' : 'false';

  return message;
}

function validateForm() {
  return (Object.keys(validators) as (keyof RegisterFormInputs)[]).every((key) => showError(key));
}

export function createRegisterForm(options: RegisterFormOptions): HTMLFormElement {
  const form = document.createElement('form');
  form.noValidate = true;
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
  usernameInput.addEventListener('input', () => showError('username'));
  usernameInput.addEventListener('blur', () => showError('username'));
  inputs.username = usernameInput;
  const usernameErrorLabel = document.createElement('span');
  usernameErrorLabel.classList.add('error-label');
  errorLabels.username = usernameErrorLabel;
  usernameInputWrapper.append(usernameIcon, usernameInput);
  usernameField.append(usernameLabel, usernameInputWrapper, usernameErrorLabel);

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

  const handleInputListener = () => {
    if (showError('email')) {
      return;
    }
    emailInput.removeEventListener('input', handleInputListener);
  };

  emailInput.addEventListener('blur', () => {
    if (!showError('email')) {
      return;
    }
    emailInput.addEventListener('input', handleInputListener);
  });
  const emailErrorLabel = document.createElement('span');
  emailErrorLabel.classList.add('error-label');
  emailInputWrapper.append(emailIcon, emailInput);
  emailField.append(emailLabel, emailInputWrapper, emailErrorLabel);
  inputs.email = emailInput;
  errorLabels.email = emailErrorLabel;

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
  passwordInput.placeholder = 'Min. 6 characters';
  const passwordVisibilityIcon = document.createElement('span');
  passwordVisibilityIcon.classList.add('field-icon', 'field-icon--eye');
  passwordVisibilityIcon.setAttribute('aria-hidden', 'true');
  passwordInput.addEventListener('input', () => {
    if (inputs.repeatedPassword.value !== '') {
      showError('repeatedPassword');
    }
  });
  const handlePasswordInputListener = () => {
    if (showError('password')) {
      return;
    }
    passwordInput.removeEventListener('input', handlePasswordInputListener);
  };

  passwordInput.addEventListener('blur', () => {
    if (!showError('password')) {
      return;
    }
    passwordInput.addEventListener('input', handlePasswordInputListener);
  });
  const passwordErrorLabel = document.createElement('span');
  passwordErrorLabel.classList.add('error-label');
  passwordInputWrapper.append(passwordIcon, passwordInput, passwordVisibilityIcon);
  passwordField.append(passwordLabel, passwordInputWrapper, passwordErrorLabel);
  inputs.password = passwordInput;
  errorLabels.password = passwordErrorLabel;

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
  confirmPasswordInput.addEventListener('input', () => showError('repeatedPassword'));
  confirmPasswordInput.addEventListener('blur', () => showError('repeatedPassword'));
  const confirmPasswordVisibilityIcon = document.createElement('span');
  confirmPasswordVisibilityIcon.classList.add('field-icon', 'field-icon--eye');
  confirmPasswordVisibilityIcon.setAttribute('aria-hidden', 'true');
  confirmPasswordInputWrapper.append(
    confirmPasswordIcon,
    confirmPasswordInput,
    confirmPasswordVisibilityIcon
  );
  const confirmPasswordErrorLabel = document.createElement('span');
  confirmPasswordErrorLabel.classList.add('error-label');
  confirmPasswordField.append(
    confirmPasswordLabel,
    confirmPasswordInputWrapper,
    confirmPasswordErrorLabel
  );
  inputs.repeatedPassword = confirmPasswordInput;
  errorLabels.repeatedPassword = confirmPasswordErrorLabel;

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
  googleIcon.src = GOOGLE_ICON_SRC;
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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      options.handleFetch(true);
      submitButton.disabled = true;
      submitButton.ariaDisabled = 'true';
      try {
        await createUserWithEmailAndPassword(auth, inputs.email.value, inputs.password.value);
        options.handleFetch(false);
        options.onSuccess();
      } catch {
        console.log('oops, smth went wrong'); //add shackbar
      } finally {
        options.handleFetch(false);
        submitButton.disabled = false;
        submitButton.ariaDisabled = 'false';
      }
    }
  });

  return form;
}
