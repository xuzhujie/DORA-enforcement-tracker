import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { records } from '../src/data.js';
import { getRecordFreshness, normalizeRecordSnapshot, validateRecordSnapshot } from '../src/recordSnapshot.js';

test('valid record snapshots preserve records, status, date, and review gate', () => {
  const productionRecord = { ...records[0], id: 'production-001', recordType: 'operational-theme' };
  const snapshot = normalizeRecordSnapshot({
    dataset_status: 'reviewed',
    as_of: '2026-11-20',
    review_gate: 'Counsel reviewed',
    review: { decision: 'approved', reviewer: 'Counsel', reviewedAt: '2026-11-20', notes: 'Approved for internal use.' },
    records: [productionRecord],
  }, records);

  assert.deepEqual(snapshot.records, [productionRecord]);
  assert.equal(snapshot.datasetStatus, 'reviewed');
  assert.equal(snapshot.asOf, '2026-11-20');
  assert.equal(snapshot.reviewGate, 'Counsel reviewed');
  assert.equal(snapshot.review.decision, 'approved');
});

test('malformed or empty snapshots fall back to the built-in dataset', () => {
  const malformed = normalizeRecordSnapshot({ dataset_status: 'reviewed', records: 'not-an-array' }, records);
  const empty = normalizeRecordSnapshot({ dataset_status: 'reviewed', records: [] }, records);
  const invalidRecord = normalizeRecordSnapshot({ records: [{ ...records[0], sourceUrl: 'not-a-url' }] }, records);
  const incompleteRecord = normalizeRecordSnapshot({ records: [{ ...records[0], evidenceExcerpt: null }] }, records);
  const unknownRecordType = normalizeRecordSnapshot({ dataset_status: 'pending-review', records: [{ ...records[0], recordType: 'made-up-type' }] }, records);

  assert.equal(malformed.records, records);
  assert.equal(empty.records, records);
  assert.equal(invalidRecord.records, records);
  assert.equal(incompleteRecord.records, records);
  assert.equal(unknownRecordType.records, records);
  assert.equal(malformed.datasetStatus, 'demo');
  assert.equal(empty.datasetStatus, 'demo');
  assert.equal(invalidRecord.datasetStatus, 'demo');
  assert.equal(incompleteRecord.datasetStatus, 'demo');
  assert.equal(unknownRecordType.datasetStatus, 'demo');
});

test('unknown dataset statuses are safe and visible as demo', () => {
  const snapshot = normalizeRecordSnapshot({ dataset_status: 'legal-final', records }, records);

  assert.equal(snapshot.datasetStatus, 'demo');
});

test('production builds do not overwrite the replaceable records snapshot', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  assert.equal(packageJson.scripts.prebuild, 'npm run snapshot');
  assert.equal(packageJson.scripts['validate:records'], 'node scripts/validate_records.mjs');
});

test('reviewed snapshots require explicit approval metadata', () => {
  const record = { ...records[0], recordType: 'operational-theme' };
  const base = {
    dataset_status: 'reviewed',
    as_of: '2026-11-20',
    review_gate: 'Counsel reviewed',
    records: [record],
  };

  assert.equal(validateRecordSnapshot({
    ...base,
    review: { decision: 'approved', reviewer: 'Counsel', reviewedAt: '2026-11-20', notes: 'Approved for internal use.' },
  }).valid, true);
  assert.equal(validateRecordSnapshot({
    ...base,
    review: { decision: 'approved', reviewer: null, reviewedAt: '2026-11-20', notes: 'Missing reviewer.' },
  }).valid, false);
});

test('pending snapshots require known record types and report stale evidence as a warning', () => {
  const record = { ...records[0], recordType: 'operational-theme', lastVerifiedAt: '2026-10-01' };
  const result = validateRecordSnapshot({
    dataset_status: 'pending-review',
    as_of: '2026-11-20',
    review_gate: 'Review pending',
    review: { decision: 'pending', reviewer: null, reviewedAt: null, notes: 'Awaiting review.' },
    records: [record],
  });
  const invalidType = validateRecordSnapshot({
    dataset_status: 'pending-review',
    as_of: '2026-11-20',
    review_gate: 'Review pending',
    review: { decision: 'pending', reviewer: null, reviewedAt: null, notes: 'Awaiting review.' },
    records: [{ ...record, recordType: 'made-up-type' }],
  });

  assert.equal(result.valid, true);
  assert.ok(result.warnings.some((warning) => warning.includes('stale')));
  assert.equal(getRecordFreshness(record, '2026-11-20').stale, true);
  assert.equal(invalidType.valid, false);
});

test('committed runtime snapshot is a valid pending-review dataset', async () => {
  const snapshot = JSON.parse(await readFile(new URL('../public/data/records.json', import.meta.url), 'utf8'));
  const result = validateRecordSnapshot(snapshot);

  assert.equal(result.valid, true);
  assert.equal(snapshot.dataset_status, 'pending-review');
  assert.ok(snapshot.records.every((record) => typeof record.recordType === 'string'));
});
