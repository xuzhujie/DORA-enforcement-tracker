import test from 'node:test';
import assert from 'node:assert/strict';
import { appendReviewEntry, applyReviewEntries, createReviewEntry, readReviewLog } from '../src/reviewLog.js';

test('review entries are serializable and newest entries stay first', () => {
  const entry = createReviewEntry('dora-001', 'marked-reviewed', '2026-11-20T10:00:00.000Z');
  const older = createReviewEntry('dora-002', 'marked-reviewed', '2026-11-19T10:00:00.000Z');

  assert.deepEqual(entry, {
    id: 'review-dora-001-2026-11-20T10:00:00.000Z',
    recordId: 'dora-001',
    action: 'marked-reviewed',
    at: '2026-11-20T10:00:00.000Z',
  });
  assert.deepEqual(appendReviewEntry([older], entry, 2), [entry, older]);
});

test('review log reader safely handles malformed local storage', () => {
  const storage = {
    getItem: () => '{not-json',
  };

  assert.deepEqual(readReviewLog(storage), []);
});

test('review events replay in chronological order to restore current status', () => {
  const entries = [
    createReviewEntry('dora-001', 'review-cancelled', '2026-11-22T10:00:00.000Z'),
    createReviewEntry('dora-001', 'marked-reviewed', '2026-11-21T10:00:00.000Z'),
  ];

  assert.deepEqual([...applyReviewEntries(new Set(), entries)], []);
});
