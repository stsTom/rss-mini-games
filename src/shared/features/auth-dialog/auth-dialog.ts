import './auth-dialog.scss';
import { createDialogLayout } from '../../components/dialog-layout/dialog-layout.js';
import { createLoginForm } from './components/login-form/login-form.js';
import { createRegisterForm } from './components/register-form/register-form.js';

export type AuthDialogTab = 'login' | 'register';

export interface AuthDialog {
  element: HTMLDialogElement;
  openLogin: () => void;
  openRegister: () => void;
}

export function createAuthDialog(): AuthDialog {
  const layout = createDialogLayout({ className: 'auth-dialog' });
  const dialog = layout.element;
  layout.card.classList.add('auth-dialog-content');

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

  layout.card.append(tabs, view);

  const setActiveTab = (tab: AuthDialogTab): void => {
    if (tab === dialog.dataset.authDialogTab) {
      return;
    }

    dialog.dataset.authDialogTab = tab;
    loginTab.classList.toggle('is-active', tab === 'login');
    registerTab.classList.toggle('is-active', tab === 'register');

    if (dialog.open) {
      const handleFadeOutEnd = (): void => {
        view.removeEventListener('transitionend', handleFadeOutEnd);
        view.replaceChildren(tab === 'login' ? loginForm : registerForm);
        view.classList.remove('fade-out');
      };
      view.addEventListener('transitionend', handleFadeOutEnd);
      view.classList.add('fade-out');
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
    layout.open();
  };

  const openRegister = (): void => {
    setActiveTab('register');
    layout.open();
  };

  loginTab.addEventListener('click', () => {
    setActiveTab('login');
  });

  registerTab.addEventListener('click', () => {
    setActiveTab('register');
  });

  return { element: dialog, openLogin, openRegister };
}
