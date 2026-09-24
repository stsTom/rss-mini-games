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
    if (tab === dialog.dataset.authDialogTab) {
      return;
    }

    dialog.dataset.authDialogTab = tab;
    loginTab.classList.toggle('is-active', tab === 'login');
    registerTab.classList.toggle('is-active', tab === 'register');

    if (dialog.classList.contains('open')) {
      view.classList.add('fade-out');
      setTimeout(() => {
        view.replaceChildren(tab === 'login' ? loginForm : registerForm);
        view.classList.remove('fade-out');
      }, 250);
      return;
    }

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
    document.body.classList.add('auth-dialog-open');
    dialog.classList.add('open');
  };

  const openRegister = (): void => {
    setActiveTab('register');
    dialog.showModal();
    document.body.classList.add('auth-dialog-open');
    dialog.classList.add('open');
  };

  dialog.addEventListener('close', () => {
    document.body.classList.remove('auth-dialog-open');
  });

  loginTab.addEventListener('click', () => {
    setActiveTab('login');
  });

  registerTab.addEventListener('click', () => {
    setActiveTab('register');
  });

  const closeDialog = (): void => {
    const handleTransitionEnd = (): void => {
      dialog.removeEventListener('transitionend', handleTransitionEnd);
      dialog.close();
    };
    dialog.addEventListener('transitionend', handleTransitionEnd);
    dialog.classList.remove('open');
  };

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  return { element: dialog, openLogin, openRegister };
}
