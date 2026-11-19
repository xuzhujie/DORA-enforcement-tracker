import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('trend chart releases the desktop minimum width on mobile', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.trend-chart\s*\{[^}]*min-width:\s*0/);
});
