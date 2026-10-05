import './header.scss';
import { createTitle } from './components/title/title.js';
import { createNav } from './components/nav/nav.js';
import { createBurger } from './components/burger/burger.js';
import { createBurgerMenu } from './components/burger-menu/burger-menu.js';
import { createSignInButton } from './components/sign-in-button/sign-in-button.js';
import { createSignUpButton } from './components/sign-up-button/sign-up-button.js';
import { createAuthDialog } from '../auth-dialog/auth-dialog.js';
import type { RouteState, Router } from '../../services/router.js';

export interface HeaderOptions {
  router: Router;
}

export function createHeader({ router }: HeaderOptions): HTMLElement {
  const header = document.createElement('header');

  const authDialog = createAuthDialog({
    onTabChange: (auth) => router.update({ auth }),
    onClose: () => {
      if (router.state.auth) {
        router.update({ auth: undefined });
      }
    },
  });

  const syncAuthDialog = ({ auth }: RouteState, previous?: RouteState): void => {
    if (auth === previous?.auth) {
      return;
    }

    if (auth) {
      authDialog.open(auth);
    } else {
      authDialog.close();
    }
  };

  router.subscribe(syncAuthDialog);
  // showModal() requires the dialog to be in the document, which happens right after createHeader returns
  queueMicrotask(() => syncAuthDialog(router.state));

  const openLogin = (): void => router.update({ auth: 'login' });
  const openRegister = (): void => router.update({ auth: 'register' });

  const burgerMenu = createBurgerMenu({
    onSignIn: openLogin,
    onSignUp: openRegister,
    router,
  });
  const burger = createBurger();
  burger.addEventListener('click', () => {
    burgerMenu.open();
  });

  const controls = document.createElement('div');
  controls.classList.add('header-controls');
  controls.append(
    createNav({ router }),
    createSignInButton(true, openLogin),
    createSignUpButton(true, openRegister),
    burger
  );

  header.append(createTitle(), controls, burgerMenu.element, authDialog.element);

  return header;
}
