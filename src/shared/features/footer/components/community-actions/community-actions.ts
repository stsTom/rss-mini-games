import './community-actions.scss';

const COMMUNITY_ACTION_COUNT = 3;

export function createCommunityActions(): HTMLElement {
  const communityActions = document.createElement('div');
  communityActions.classList.add('community-actions');

  const heading = document.createElement('h3');
  heading.textContent = 'Community';
  communityActions.append(heading);

  const buttonRow = document.createElement('div');
  buttonRow.classList.add('community-actions-buttons');

  for (let index = 0; index < COMMUNITY_ACTION_COUNT; index += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    buttonRow.append(button);
  }

  communityActions.append(buttonRow);

  return communityActions;
}
