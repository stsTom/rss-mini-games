import './comment-card.scss';
import { AVATAR_COLOR_COUNT, GLYPH_HEART, GLYPH_HEART_OUTLINE } from '../../constants.js';
import { formatTimeAgo } from '../../utils/format.js';
import type { GameComment } from '../../../../interfaces.js';
import { toggleCommentLike } from '../../../../api/games-data.js';
import type { GuardAction } from '../../../../services/actions-guard.js';
import type { AppSession } from '../../../../services/app-session.js';

export interface GameDetailsCommentCardOptions {
  comment: GameComment;
  index: number;
  guardAction: GuardAction;
  session: AppSession;
}

function createLikeButton(
  { commentId, likesCount }: GameComment,
  guardAction: GuardAction,
  session: AppSession
): HTMLElement {
  let currentCount = likesCount;

  const glyph = document.createElement('span');
  glyph.textContent = GLYPH_HEART_OUTLINE;
  glyph.setAttribute('aria-hidden', 'true');

  const count = document.createElement('span');
  count.textContent = String(currentCount);

  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('game-details-comment-like');
  button.setAttribute('aria-label', `Like, ${currentCount} likes`);
  button.setAttribute('aria-pressed', 'false');
  button.append(glyph, count);
  button.addEventListener(
    'click',
    guardAction(async () => {
      const userEmail = session.current?.email;
      if (!userEmail || button.disabled) {
        return;
      }

      button.disabled = true;
      try {
        await toggleCommentLike({ commentId, userEmail });

        const isActive = button.classList.toggle('is-active');
        currentCount += isActive ? 1 : -1;
        count.textContent = String(currentCount);
        button.setAttribute('aria-label', `Like, ${currentCount} likes`);
        button.setAttribute('aria-pressed', String(isActive));
        glyph.textContent = isActive ? GLYPH_HEART : GLYPH_HEART_OUTLINE;
      } catch {
        console.log('Could not update the like. Please try again.'); // add snackbar
      } finally {
        button.disabled = false;
      }
    })
  );

  return button;
}

export function createGameDetailsCommentCard({
  comment,
  index,
  guardAction,
  session,
}: GameDetailsCommentCardOptions): HTMLElement {
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

  card.append(header, text, createLikeButton(comment, guardAction, session));

  return card;
}
