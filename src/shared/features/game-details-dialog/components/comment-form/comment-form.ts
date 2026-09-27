import './comment-form.scss';
import {
  COMMENT_TEXTAREA_MAX_HEIGHT_PX,
  CURRENT_USER_INITIAL,
  GLYPH_SEND,
} from '../../constants.js';

function autoGrow(textarea: HTMLTextAreaElement): void {
  textarea.style.height = 'auto';

  const borders = textarea.offsetHeight - textarea.clientHeight;
  const contentHeight = textarea.scrollHeight + borders;
  const isCapped = contentHeight > COMMENT_TEXTAREA_MAX_HEIGHT_PX;

  textarea.style.height = `${Math.min(contentHeight, COMMENT_TEXTAREA_MAX_HEIGHT_PX)}px`;
  textarea.style.overflowY = isCapped ? 'auto' : 'hidden';
}

export function createGameDetailsCommentForm(): HTMLElement {
  const form = document.createElement('form');
  form.classList.add('game-details-comment-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  const avatar = document.createElement('span');
  avatar.classList.add('game-details-comment-form-avatar');
  avatar.textContent = CURRENT_USER_INITIAL;
  avatar.setAttribute('aria-hidden', 'true');

  const textarea = document.createElement('textarea');
  textarea.classList.add('game-details-comment-form-input');
  textarea.name = 'comment';
  textarea.rows = 1;
  textarea.placeholder = 'Write a comment...';
  textarea.setAttribute('aria-label', 'Write a comment');
  textarea.addEventListener('input', () => {
    autoGrow(textarea);
  });

  const glyph = document.createElement('span');
  glyph.textContent = GLYPH_SEND;
  glyph.setAttribute('aria-hidden', 'true');

  const sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.classList.add('game-details-comment-form-send');
  sendButton.setAttribute('aria-label', 'Send comment');
  sendButton.append(glyph);

  form.append(avatar, textarea, sendButton);

  return form;
}
