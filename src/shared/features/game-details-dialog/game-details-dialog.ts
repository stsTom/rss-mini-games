import './game-details-dialog.scss';
import { createDialogLayout } from '../../components/dialog-layout/dialog-layout.js';
import { createGameDetailsHero } from './components/hero/hero.js';
import { createGameDetailsSummary } from './components/summary/summary.js';
import { createGameDetailsInfoWidgets } from './components/info-widgets/info-widgets.js';
import { createGameDetailsActions } from './components/actions/actions.js';
import { createGameDetailsTopRecords } from './components/top-records/top-records.js';
import { createGameDetailsCommentForm } from './components/comment-form/comment-form.js';
import { createGameDetailsCommentCard } from './components/comment-card/comment-card.js';
import {
  fetchGameDetails,
  fetchGameComments,
  type FetchGameDetailsRequestOptions,
} from '../../api/games-data.js';
import type { Game } from '../../interfaces.js';
import type { GameCommentsResponse, GameDetails } from './interfaces.js';

export interface GameDetailsDialog {
  element: HTMLDialogElement;
  open: (game: Game, onClose?: () => void) => void;
}

interface GameDialogProperties {
  details: GameDetails;
  comments: GameCommentsResponse;
}

function createCommentsSection({ data, meta }: GameCommentsResponse): HTMLElement {
  const section = document.createElement('section');
  section.classList.add('game-details-section');

  const heading = document.createElement('h3');
  heading.classList.add('game-details-section-heading');
  heading.textContent = `Comments (${meta.totalComments})`;

  const list = document.createElement('ul');
  list.classList.add('game-details-comments');
  list.append(...data.map((comment, index) => createGameDetailsCommentCard(comment, index)));

  section.append(heading, createGameDetailsCommentForm(), list);

  return section;
}

export function createGameDetailsDialog(): GameDetailsDialog {
  let handleClose: (() => void) | undefined;

  const layout = createDialogLayout({
    className: 'game-details-dialog',
    onClose: () => {
      const callback = handleClose;
      handleClose = undefined;
      callback?.();
    },
  });
  layout.card.classList.add('game-details-dialog-card');

  const render = ({ details, comments }: GameDialogProperties): void => {
    const body = document.createElement('div');
    body.classList.add('game-details-body');

    const description = document.createElement('p');
    description.classList.add('game-details-description');
    description.textContent = details.fullDescription;

    body.append(
      createGameDetailsSummary(details),
      description,
      createGameDetailsInfoWidgets(details.specs),
      createGameDetailsActions(),
      createGameDetailsTopRecords(details.topRecords),
      createCommentsSection(comments)
    );

    layout.card.replaceChildren(
      createGameDetailsHero({ game: details, onClose: layout.close }),
      body
    );
  };

  const open = async (_game: Game, onClose?: () => void) => {
    const [details, comments] = await Promise.all([
      fetchGameDetails({ gameSlug: _game.slug } as FetchGameDetailsRequestOptions),
      fetchGameComments({ gameSlug: _game.slug } as FetchGameDetailsRequestOptions),
    ]);

    handleClose = onClose;
    render({ details, comments } as GameDialogProperties);
    layout.open();
  };

  return { element: layout.element, open };
}
