import './community-actions.scss';

const COMMUNITY_ACTIONS = [
  { icon: '/icons/share-icon.svg', alt: 'Share' },
  { icon: '/icons/text-us-icon.svg', alt: 'Chat' },
  { icon: '/icons/wi-fi-icon.svg', alt: 'RSS feed' },
];

export function createCommunityActions(): HTMLElement {
  const communityActions = document.createElement('div');
  communityActions.classList.add('community-actions');

  const heading = document.createElement('h3');
  heading.textContent = 'Community';
  communityActions.append(heading);

  const buttonRow = document.createElement('div');
  buttonRow.classList.add('community-actions-buttons');

  for (const { icon, alt } of COMMUNITY_ACTIONS) {
    const button = document.createElement('button');
    button.type = 'button';

    const image = document.createElement('img');
    image.src = icon;
    image.alt = alt;
    button.append(image);

    buttonRow.append(button);
  }

  communityActions.append(buttonRow);

  return communityActions;
}
