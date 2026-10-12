import './user-menu.scss';
import { HEADER_VISIBILITY } from '../../dataset-values.js';
import type { AppSessionData } from '../../../../services/app-session.js';

export function createUserMenu(
  hasVisibility: boolean,
  { displayName, avatarUrl }: AppSessionData,
  onLogout: () => void
): HTMLElement {
  const menu = document.createElement('div');
  menu.classList.add('user-menu');
  if (hasVisibility) {
    menu.dataset.headerVisibility = HEADER_VISIBILITY.desktop;
  }

  let avatar: HTMLElement;
  if (avatarUrl) {
    const image = document.createElement('img');
    image.src = avatarUrl;
    image.alt = '';
    image.referrerPolicy = 'no-referrer';
    avatar = image;
  } else {
    avatar = document.createElement('span');
    avatar.textContent = displayName.charAt(0).toUpperCase();
  }
  avatar.classList.add('user-menu-avatar');
  avatar.setAttribute('aria-hidden', 'true');

  const name = document.createElement('span');
  name.classList.add('user-menu-name');
  name.textContent = displayName;

  const logoutButton = document.createElement('button');
  logoutButton.type = 'button';
  logoutButton.classList.add('user-menu-logout');
  logoutButton.textContent = 'Logout';
  logoutButton.addEventListener('click', onLogout);

  menu.append(avatar, name, logoutButton);

  return menu;
}
