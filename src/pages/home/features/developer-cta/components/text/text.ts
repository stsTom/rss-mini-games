import './text.scss';

export function createDeveloperCtaText(): HTMLElement {
  const text = document.createElement('p');
  text.textContent =
    "Want to see your game on MiniGames? We're always looking for fun, engaging mini games to add to our platform. Submit your game and reach thousands of players!";

  return text;
}
