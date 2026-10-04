export const GAMES_PER_PAGE = 6;

export const DEFAULT_CATEGORY = 'all';

export const CATEGORIES = [
  { label: 'All Games', value: DEFAULT_CATEGORY },
  { label: 'Puzzle', value: 'puzzle' },
  { label: 'Card', value: 'card' },
  { label: 'Match', value: 'match' },
  { label: 'Farm', value: 'farm' },
  { label: 'Strategy', value: 'strategy' },
  { label: 'Arcade', value: 'arcade' },
];

export const DEFAULT_SORT = 'rating-desc';

export const SORT_OPTIONS = [
  { label: 'Rating ↑', value: 'rating-asc' },
  { label: 'Rating ↓', value: DEFAULT_SORT },
  { label: 'Name A→Z', value: 'name-asc' },
  { label: 'Name Z→A', value: 'name-desc' },
];
