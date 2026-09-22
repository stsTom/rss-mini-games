import './copyright.scss';

export function createCopyright(): HTMLElement {
  const copyright = document.createElement('p');
  copyright.textContent = '© 2026 MiniGames. All rights reserved.';

  return copyright;
}
