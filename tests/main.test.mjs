import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('React StrictMode entry imports React at runtime', async () => {
  const source = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8');
  assert.match(source, /import React from ['"]react['"]/);
  assert.match(source, /React\.StrictMode/);
});

test('dashboard mounts source, update, and review evidence surfaces', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const components = await readFile(new URL('../src/components.jsx', import.meta.url), 'utf8');

  assert.match(app, /sourceRegistry/);
  assert.match(app, /SourceRegistryPanel/);
  assert.match(app, /UpdateFeed/);
  assert.match(app, /readReviewLog/);
  assert.match(components, /ReviewLogPanel/);
  assert.match(components, /owner/);
});
