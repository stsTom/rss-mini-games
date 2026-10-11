import './comment-form.scss';
import {
  COMMENT_TEXTAREA_MAX_HEIGHT_PX,
  CURRENT_USER_INITIAL,
  GLYPH_SEND,
} from '../../constants.js';
import { postGameComment } from '../../../../api/games-data.js';
import type { GuardAction } from '../../../../services/actions-guard.js';
import type { AppSession } from '../../../../services/app-session.js';

export interface GameDetailsCommentFormOptions {
  guardAction: GuardAction;
  session: AppSession;
  gameSlug: string;
  onCommentPosted: () => void | Promise<void>;
}

function autoGrow(textarea: HTMLTextAreaElement): void {
  textarea.style.height = 'auto';

  const borders = textarea.offsetHeight - textarea.clientHeight;
  const contentHeight = textarea.scrollHeight + borders;
  const isCapped = contentHeight > COMMENT_TEXTAREA_MAX_HEIGHT_PX;

  textarea.style.height = `${Math.min(contentHeight, COMMENT_TEXTAREA_MAX_HEIGHT_PX)}px`;
  textarea.style.overflowY = isCapped ? 'auto' : 'hidden';
}

export function createGameDetailsCommentForm({
  guardAction,
  session,
  gameSlug,
  onCommentPosted,
}: GameDetailsCommentFormOptions): HTMLElement {
  const form = document.createElement('form');
  form.classList.add('game-details-comment-form');

  const avatar = document.createElement('span');
  avatar.classList.add('game-details-comment-form-avatar');
  avatar.textContent = session.current?.displayName.charAt(0).toUpperCase() ?? CURRENT_USER_INITIAL;
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

  const submitComment = guardAction(async () => {
    const currentUser = session.current;
    const text = textarea.value.trim();
    if (!currentUser || text === '' || textarea.disabled) {
      return;
    }

    textarea.disabled = true;
    try {
      await postGameComment({
        gameSlug,
        userEmail: currentUser.email,
        authorName: currentUser.displayName,
        text,
      });

      textarea.value = '';
      autoGrow(textarea);
      await onCommentPosted();
    } catch {
      console.log('Could not post the comment. Please try again.'); // add snackbar
    } finally {
      textarea.disabled = false;
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitComment();
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
