import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { records } from '../src/data.js';
import { normalizeRecordSnapshot } from '../src/recordSnapshot.js';

test('valid record snapshots preserve records, status, date, and review gate', () => {
  const productionRecord = { ...records[0], id: 'production-001' };
  const snapshot = normalizeRecordSnapshot({
    dataset_status: 'reviewed',
    as_of: '2026-11-20',
    review_gate: 'Counsel reviewed',
    records: [productionRecord],
  }, records);

  assert.deepEqual(snapshot.records, [productionRecord]);
  assert.equal(snapshot.datasetStatus, 'reviewed');
  assert.equal(snapshot.asOf, '2026-11-20');
  assert.equal(snapshot.reviewGate, 'Counsel reviewed');
});

test('malformed or empty snapshots fall back to the built-in dataset', () => {
  const malformed = normalizeRecordSnapshot({ dataset_status: 'reviewed', records: 'not-an-array' }, records);
  const empty = normalizeRecordSnapshot({ dataset_status: 'reviewed', records: [] }, records);
  const invalidRecord = normalizeRecordSnapshot({ records: [{ ...records[0], sourceUrl: 'not-a-url' }] }, records);
  const incompleteRecord = normalizeRecordSnapshot({ records: [{ ...records[0], evidenceExcerpt: null }] }, records);

  assert.equal(malformed.records, records);
  assert.equal(empty.records, records);
  assert.equal(invalidRecord.records, records);
  assert.equal(incompleteRecord.records, records);
  assert.equal(malformed.datasetStatus, 'demo');
  assert.equal(empty.datasetStatus, 'demo');
  assert.equal(invalidRecord.datasetStatus, 'demo');
  assert.equal(incompleteRecord.datasetStatus, 'demo');
});

test('unknown dataset statuses are safe and visible as demo', () => {
  const snapshot = normalizeRecordSnapshot({ dataset_status: 'legal-final', records }, records);

  assert.equal(snapshot.datasetStatus, 'demo');
});

test('production builds do not overwrite the replaceable records snapshot', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  assert.equal(packageJson.scripts.prebuild, 'npm run snapshot');
});
