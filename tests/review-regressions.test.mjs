import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { UI } from '../src/copy.js';

test('Vite uses a relative base so the Pages project path can load assets', async () => {
  const config = await readFile(new URL('../vite.config.js', import.meta.url), 'utf8');
  assert.match(config, /base:\s*['"]\.\/['"]/);
});

test('review action copy matches the status transition', () => {
  assert.equal(UI.zh.actions.markReview, '本地标记为已复核');
  assert.equal(UI.zh.actions.reviewAdded, '已本地标记复核');
  assert.equal(UI.en.actions.markReview, 'Mark locally reviewed');
  assert.equal(UI.en.actions.reviewAdded, 'Marked locally reviewed');
});

test('filter bar exposes reset copy in both languages', () => {
  assert.equal(UI.zh.filters.reset, '重置');
  assert.equal(UI.en.filters.reset, 'Reset');
});

test('Pages deploy is triggered after the source monitor workflow completes', async () => {
  const workflow = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(workflow, /workflow_run:/);
  assert.match(workflow, /Monitor official DORA sources/);
});

test('Pages workflow includes the browser smoke gate and repository hygiene exists', async () => {
  const workflow = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  const gitignore = await readFile(new URL('../.gitignore', import.meta.url), 'utf8');

  assert.match(workflow, /playwright install.*chromium/);
  assert.match(workflow, /npm run test:e2e/);
  assert.match(workflow, /npm run validate:records/);
  assert.match(workflow, /uses: actions\/configure-pages@v5[\s\S]*?with:[\s\S]*?enablement: false/);
  assert.match(gitignore, /node_modules\//);
  assert.match(gitignore, /dist\//);
});
