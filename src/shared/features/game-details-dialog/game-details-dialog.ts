import './game-details-dialog.scss';
import { createDialogLayout } from '../../components/dialog-layout/dialog-layout.js';
import { createGameDetailsHero } from './components/hero/hero.js';
import { createGameDetailsSummary } from './components/summary/summary.js';
import {
  createGameDetailsInfoWidgets,
  INFO_WIDGETS,
} from './components/info-widgets/info-widgets.js';
import { createGameDetailsActions } from './components/actions/actions.js';
import { createGameDetailsTopRecords } from './components/top-records/top-records.js';
import { createGameDetailsCommentForm } from './components/comment-form/comment-form.js';
import { createGameDetailsCommentCard } from './components/comment-card/comment-card.js';
import { fetchGameDetails, fetchGameComments } from '../../api/games-data.js';
import type { Game, GameCommentsResponse, GameDetails } from '../../interfaces.js';
import { createErrorPlaceholder } from '../../components/error-layout/error-layout.js';
import { createEmptyBanner } from '../../components/empty-banner/emty-banner.js';

export interface GameDetailsDialog {
  element: HTMLDialogElement;
  open: (game: Game, onClose?: () => void) => void;
}

interface GameDialogProperties {
  details: GameDetails;
  comments: GameCommentsResponse;
}

function createCommentsSection(comments?: GameCommentsResponse): HTMLElement {
  const section = document.createElement('section');
  section.classList.add('game-details-section');

  const heading = document.createElement('h3');
  heading.classList.add('game-details-section-heading');
  heading.textContent = `Comments (${comments?.meta?.totalComments ?? 0})`;

  section.append(heading, createGameDetailsCommentForm());

  if (!comments?.data || comments.data.length === 0) {
    section.append(createEmptyBanner());
    return section;
  }

  const list = document.createElement('ul');
  list.classList.add('game-details-comments');
  list.append(
    ...comments.data.map((comment, index) => createGameDetailsCommentCard(comment, index))
  );

  section.append(list);

  return section;
}

function createSkeletonBar(type: string): HTMLDivElement {
  const skeletonBar = document.createElement('div');
  skeletonBar.classList.add('game-details-skeleton-bar', `game-details-skeleton-bar-${type}`);

  return skeletonBar;
}

function createBadgesSkeleton(): HTMLElement {
  const badges = document.createElement('dl');
  badges.classList.add('game-details-info-widgets');
  badges.append(...INFO_WIDGETS.map(() => createSkeletonBar('badge')));

  return badges;
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
    if (!details) {
      layout.card.replaceChildren(createEmptyBanner());
      return;
    }

    const body = document.createElement('div');
    body.classList.add('game-details-body');

    const description = document.createElement('p');
    description.classList.add('game-details-description');
    description.textContent = details.fullDescription;

    body.append(
      createGameDetailsSummary(details),
      description,
      createGameDetailsInfoWidgets(details.specs),
      createGameDetailsActions(details.specs.price),
      createGameDetailsTopRecords(details.topRecords),
      createCommentsSection(comments)
    );

    layout.card.replaceChildren(
      createGameDetailsHero({ game: details, onClose: layout.close }),
      body
    );
  };

  const renderSkeleton = () => {
    const body = document.createElement('div');
    body.classList.add('game-details-body');

    const createSummarySkeleton = () => {
      const summary = document.createElement('div');
      summary.classList.add('game-details-summary');

      const title = createSkeletonBar('title');

      const ratings = document.createElement('div');
      ratings.classList.add('game-details-summary-ratings');
      ratings.append(createSkeletonBar('rating'), createSkeletonBar('rating'));

      summary.append(title, ratings);

      return summary;
    };

    const createDescriptionSkeleton = () => {
      const description = document.createElement('ul');
      description.classList.add('game-details-description-skeleton');

      for (let index = 0; index < 3; index++) {
        const line = document.createElement('li');
        line.classList.add('game-details-description-line-skeleton');

        line.append(createSkeletonBar('line'));
        description.append(line);
      }

      return description;
    };

    const createActionsSkeleton = () => {
      const actions = document.createElement('div');
      actions.classList.add('game-details-actions');

      actions.append(createSkeletonBar('action'), createSkeletonBar('action'));

      return actions;
    };

    const createTopRecordsSkeleton = () => {
      const section = document.createElement('section');
      section.classList.add('game-details-section');

      const headingBar = createSkeletonBar('records-heading');

      const list = document.createElement('ol');
      list.classList.add('game-details-records');

      for (let index = 0; index < 3; index++) {
        const recordCardSkeleton = document.createElement('li');
        recordCardSkeleton.append(createSkeletonBar('record'));

        list.append(recordCardSkeleton);
      }

      section.append(headingBar, list);

      return section;
    };

    const createCommentsSectionSkeleton = () => {
      const section = document.createElement('section');
      section.classList.add('game-details-section');

      const commentsHeadingSkeleton = createSkeletonBar('comments-heading');
      const commentBoxSkeleton = createSkeletonBar('comments-box');

      const list = document.createElement('ul');
      list.classList.add('game-details-comments');

      const createCommentSkeleton = () => {
        const commentLayout = document.createElement('li');
        commentLayout.classList.add('game-details-comment-skeleton');

        const heading = createSkeletonBar('comment-user-name');

        const commentContentSkeleton = document.createElement('ul');
        commentContentSkeleton.classList.add('game-details-comment-lines-skeleton');

        for (let index = 0; index < 3; index++) {
          const line = document.createElement('li');
          line.classList.add('game-details-comment-line-skeleton');

          const lineContent = createSkeletonBar('comment-line');
          line.append(lineContent);

          commentContentSkeleton.append(line);
        }

        commentLayout.append(heading, commentContentSkeleton);

        return commentLayout;
      };

      for (let index = 0; index < 3; index++) {
        list.append(createCommentSkeleton());
      }

      const spinner = document.createElement('div');
      spinner.classList.add('spinner-placeholder');

      section.append(commentsHeadingSkeleton, commentBoxSkeleton, list, spinner);

      return section;
    };

    const heroSkeleton = createSkeletonBar('hero');

    body.append(
      createSummarySkeleton(),
      createDescriptionSkeleton(),
      createBadgesSkeleton(),
      createActionsSkeleton(),
      createTopRecordsSkeleton(),
      createCommentsSectionSkeleton()
    );

    layout.card.replaceChildren(heroSkeleton, body);
  };

  const open = async (_game: Game, onClose?: () => void) => {
    layout.card.ariaBusy = 'true';
    renderSkeleton();
    layout.open();
    handleClose = onClose;

    try {
      const [details, comments] = await Promise.all([
        fetchGameDetails({ gameSlug: _game.slug }),
        fetchGameComments({ gameSlug: _game.slug }),
      ]);

      render({ details, comments } as GameDialogProperties);
    } catch {
      layout.card.replaceChildren(createErrorPlaceholder(() => open(_game)));
    } finally {
      layout.card.removeAttribute('aria-busy');
    }
  };

  return { element: layout.element, open };
}
