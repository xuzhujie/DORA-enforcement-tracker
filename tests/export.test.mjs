import test from 'node:test';
import assert from 'node:assert/strict';

import { buildExportRows } from '../src/export.js';
import { records } from '../src/data.js';

test('exports localized priority labels and readable dates', () => {
  const english = buildExportRows(records.slice(0, 1), 'en')[0];
  const chinese = buildExportRows(records.slice(0, 1), 'zh')[0];

  assert.equal(english[6], 'High');
  assert.equal(english[7], '18 Nov 2026');
  assert.equal(chinese[6], '高');
  assert.equal(chinese[7], '2026年11月18日');
});
