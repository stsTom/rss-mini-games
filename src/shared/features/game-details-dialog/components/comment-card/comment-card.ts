import './comment-card.scss';
import { AVATAR_COLOR_COUNT, GLYPH_HEART, GLYPH_HEART_OUTLINE } from '../../constants.js';
import { formatTimeAgo } from '../../utils/format.js';
import type { GameComment } from '../../../../interfaces.js';

function createLikeButton(likesCount: number): HTMLElement {
  const glyph = document.createElement('span');
  glyph.textContent = GLYPH_HEART_OUTLINE;
  glyph.setAttribute('aria-hidden', 'true');

  const count = document.createElement('span');
  count.textContent = String(likesCount);

  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('game-details-comment-like');
  button.setAttribute('aria-label', `Like, ${likesCount} likes`);
  button.setAttribute('aria-pressed', 'false');
  button.append(glyph, count);
  button.addEventListener('click', () => {
    const isActive = button.classList.toggle('is-active');
    button.setAttribute('aria-pressed', String(isActive));
    glyph.textContent = isActive ? GLYPH_HEART : GLYPH_HEART_OUTLINE;
  });

  return button;
}

export function createGameDetailsCommentCard(comment: GameComment, index: number): HTMLElement {
  const card = document.createElement('li');
  card.classList.add('game-details-comment');

  const header = document.createElement('div');
  header.classList.add('game-details-comment-header');

  const author = document.createElement('span');
  author.classList.add('game-details-comment-author');

  const avatar = document.createElement('span');
  avatar.classList.add('game-details-comment-avatar');
  avatar.dataset.avatarColor = String((index % AVATAR_COLOR_COUNT) + 1);
  avatar.textContent = comment.authorName.charAt(0).toUpperCase();
  avatar.setAttribute('aria-hidden', 'true');

  const name = document.createElement('span');
  name.textContent = comment.authorName;
  author.append(avatar, name);

  const time = document.createElement('time');
  time.classList.add('game-details-comment-time');
  time.dateTime = comment.createdAt;
  time.textContent = formatTimeAgo(comment.createdAt);
  header.append(author, time);

  const text = document.createElement('p');
  text.classList.add('game-details-comment-text');
  text.textContent = comment.text;

  card.append(header, text, createLikeButton(comment.likesCount));

  return card;
}
