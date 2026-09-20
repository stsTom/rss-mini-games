import './auth-dialog.scss';
import { createLoginForm } from './components/login-form/login-form.js';
import { createRegisterForm } from './components/register-form/register-form.js';

export type AuthDialogTab = 'login' | 'register';

export interface AuthDialog {
  element: HTMLDialogElement;
  openLogin: () => void;
  openRegister: () => void;
}

export function createAuthDialog(): AuthDialog {
  const dialog = document.createElement('dialog');
  dialog.classList.add('auth-dialog');

  const content = document.createElement('div');
  content.classList.add('auth-dialog-content');

  const tabs = document.createElement('div');
  tabs.classList.add('auth-dialog-tabs');

  const loginTab = document.createElement('button');
  loginTab.type = 'button';
  loginTab.textContent = 'Login';

  const registerTab = document.createElement('button');
  registerTab.type = 'button';
  registerTab.textContent = 'Register';

  tabs.append(loginTab, registerTab);

  const view = document.createElement('div');
  view.classList.add('auth-dialog-view');

  content.append(tabs, view);
  dialog.append(content);

  const setActiveTab = (tab: AuthDialogTab): void => {
    dialog.dataset.authDialogTab = tab;
    loginTab.classList.toggle('is-active', tab === 'login');
    registerTab.classList.toggle('is-active', tab === 'register');
    view.replaceChildren(tab === 'login' ? loginForm : registerForm);
  };

  const loginForm = createLoginForm({
    onSwitchToRegister: () => {
      setActiveTab('register');
    },
  });

  const registerForm = createRegisterForm({
    onSwitchToLogin: () => {
      setActiveTab('login');
    },
  });

  const openLogin = (): void => {
    setActiveTab('login');
    dialog.showModal();
  };

  const openRegister = (): void => {
    setActiveTab('register');
    dialog.showModal();
  };

  loginTab.addEventListener('click', () => {
    setActiveTab('login');
  });

  registerTab.addEventListener('click', () => {
    setActiveTab('register');
  });

  setActiveTab('login');

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  return { element: dialog, openLogin, openRegister };
}
