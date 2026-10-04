import './auth-dialog.scss';
import { createDialogLayout } from '../../components/dialog-layout/dialog-layout.js';
import { createLoginForm } from './components/login-form/login-form.js';
import { createRegisterForm } from './components/register-form/register-form.js';

export type AuthDialogTab = 'login' | 'register';

export interface AuthDialogOptions {
  onTabChange: (tab: AuthDialogTab) => void;
  onClose: () => void;
}

export interface AuthDialog {
  element: HTMLDialogElement;
  open: (tab: AuthDialogTab) => void;
  close: () => void;
}

export function createAuthDialog({ onTabChange, onClose }: AuthDialogOptions): AuthDialog {
  const layout = createDialogLayout({ className: 'auth-dialog', onClose });
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
      onTabChange('register');
    },
  });

  const registerForm = createRegisterForm({
    onSwitchToLogin: () => {
      onTabChange('login');
    },
  });

  const open = (tab: AuthDialogTab): void => {
    setActiveTab(tab);
    layout.open();
  };

  loginTab.addEventListener('click', () => {
    onTabChange('login');
  });

  registerTab.addEventListener('click', () => {
    onTabChange('register');
  });

  return { element: dialog, open, close: layout.close };
}
