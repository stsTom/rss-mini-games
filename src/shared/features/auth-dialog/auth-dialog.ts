import './auth-dialog.scss';
import type { User } from 'firebase/auth';
import { createDialogLayout } from '../../components/dialog-layout/dialog-layout.js';
import { createLoginForm } from './components/login-form/login-form.js';
import { createRegisterForm } from './components/register-form/register-form.js';

export type AuthDialogTab = 'login' | 'register';

export interface AuthDialogOptions {
  onTabChange: (tab: AuthDialogTab) => void;
  onClose: () => void;
  onAuthenticated: (user: User, displayName?: string) => void;
}

export interface AuthDialog {
  element: HTMLDialogElement;
  open: (tab: AuthDialogTab) => void;
  close: () => void;
  isBusy: () => boolean;
}

export function createAuthDialog({
  onTabChange,
  onClose,
  onAuthenticated,
}: AuthDialogOptions): AuthDialog {
  let isBusy = false;

  const layout = createDialogLayout({
    className: 'auth-dialog',
    onClose,
    canClose: () => !isBusy,
  });
  const dialog = layout.element;
  layout.card.classList.add('auth-dialog-content');

  const changeTab = (tab: AuthDialogTab): void => {
    if (!isBusy) {
      onTabChange(tab);
    }
  };

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

  const setIsBusy = (isPending: boolean): void => {
    isBusy = isPending;
    view.toggleAttribute('inert', isPending);
    loginTab.disabled = isPending;
    registerTab.disabled = isPending;
    dialog.classList.toggle('is-busy', isPending);
  };

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

  const handleSuccess = (user: User, displayName?: string): void => {
    onAuthenticated(user, displayName);
    layout.close();
  };

  const loginForm = createLoginForm({
    onSwitchToRegister: () => {
      changeTab('register');
    },
    handleFetch: setIsBusy,
    onSuccess: handleSuccess,
  });

  const registerForm = createRegisterForm({
    onSwitchToLogin: () => {
      changeTab('login');
    },
    handleFetch: setIsBusy,
    onSuccess: handleSuccess,
  });

  const open = (tab: AuthDialogTab): void => {
    setActiveTab(tab);
    layout.open();
  };

  loginTab.addEventListener('click', () => {
    changeTab('login');
  });

  registerTab.addEventListener('click', () => {
    changeTab('register');
  });

  return { element: dialog, open, close: layout.close, isBusy: () => isBusy };
}
