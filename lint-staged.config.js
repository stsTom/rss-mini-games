export default {
  '*.{js,mjs,ts}': ['eslint --max-warnings=0', 'prettier --write'],
  // Function form: tsc ignores tsconfig.json when given file paths, so check the whole project once
  '*.ts': () => 'tsc --noEmit -p tsconfig.json',
  '*.{scss,css,html,json,md}': 'prettier --write',
};
