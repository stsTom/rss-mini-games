import './header.scss';
import { createTitle } from './components/title/title.js';
import { createNav } from './components/nav/nav.js';
import { createBurger } from './components/burger/burger.js';
import { createBurgerMenu } from './components/burger-menu/burger-menu.js';
import { createSignInButton } from './components/sign-in-button/sign-in-button.js';
import { createSignUpButton } from './components/sign-up-button/sign-up-button.js';
import { createUserMenu } from './components/user-menu/user-menu.js';
import { createAuthDialog } from '../auth-dialog/auth-dialog.js';
import type { RouteState, Router } from '../../services/router.js';
import type { AppSession } from '../../services/app-session.js';

export interface HeaderOptions {
  router: Router;
  session: AppSession;
}

export function createHeader({ router, session }: HeaderOptions): HTMLElement {
  const header = document.createElement('header');

  const authDialog = createAuthDialog({
    onTabChange: (auth) => router.update({ auth }),
    onClose: () => {
      if (router.state.auth) {
        router.update({ auth: undefined });
      }
    },
    onAuthenticated: session.start,
  });

  const syncAuthDialog = ({ auth }: RouteState, previous?: RouteState): void => {
    if (auth === previous?.auth) {
      return;
    }

    if (previous && authDialog.isBusy()) {
      // Back/forward or a link changed the route mid-request: undo it so URL and dialog stay in sync
      router.update({ auth: previous.auth }, { replace: true });
      return;
    }

    if (auth) {
      authDialog.open(auth);
    } else {
      authDialog.close();
    }
  };

  router.subscribe(syncAuthDialog);
  queueMicrotask(() => syncAuthDialog(router.state));

  const openLogin = (): void => router.update({ auth: 'login' });
  const openRegister = (): void => router.update({ auth: 'register' });

  const burgerMenu = createBurgerMenu({
    onSignIn: openLogin,
    onSignUp: openRegister,
    router,
    session,
  });
  const burger = createBurger();
  burger.addEventListener('click', () => {
    burgerMenu.open();
  });

  const controls = document.createElement('div');
  controls.classList.add('header-controls');
  const nav = createNav({ router });
  const signInButton = createSignInButton(true, openLogin);
  const signUpButton = createSignUpButton(true, openRegister);

  const renderControls = (): void => {
    const { current } = session;
    const authControls = current
      ? [createUserMenu(true, current, session.logout)]
      : [signInButton, signUpButton];
    controls.replaceChildren(nav, ...authControls, burger);
  };
  session.subscribe(renderControls);
  renderControls();

  header.append(createTitle(), controls, burgerMenu.element, authDialog.element);

  return header;
}
