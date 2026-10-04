import './info-widgets.scss';
import { PRICE_FREE } from '../../constants.js';
import type { GameSpecs } from '../../../../interfaces.js';

export const INFO_WIDGETS: { key: keyof GameSpecs; label: string }[] = [
  { key: 'genre', label: 'Genre' },
  { key: 'players', label: 'Players' },
  { key: 'duration', label: 'Duration' },
  { key: 'price', label: 'Price' },
];

export function createGameDetailsInfoWidgets(specs: GameSpecs): HTMLElement {
  const widgets = document.createElement('dl');
  widgets.classList.add('game-details-info-widgets');

  for (const { key, label } of INFO_WIDGETS) {
    const widget = document.createElement('div');
    widget.classList.add('game-details-info-widget');

    const term = document.createElement('dt');
    term.textContent = label;

    const value = document.createElement('dd');
    value.textContent = specs[key];
    value.classList.toggle('is-free', key === 'price' && specs[key] === PRICE_FREE);

    widget.append(term, value);
    widgets.append(widget);
  }

  return widgets;
}
