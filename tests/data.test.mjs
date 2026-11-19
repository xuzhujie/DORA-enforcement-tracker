import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DGA_RELEVANCE_VALUES,
  DORA_RELEVANCE_VALUES,
  filterRecords,
  getSummary,
  labelFor,
  records,
  REGIME_OPTIONS,
} from '../src/data.js';
import { formatDate, text } from '../src/copy.js';

test('filters keep DORA focused on financial customers and critical ICT supply chains', () => {
  const doraRecords = filterRecords(records, {
    regime: 'DORA',
    relevance: 'all',
    status: 'all',
    dateRange: '90d',
  });

  assert.equal(doraRecords.length, 4);
  assert.ok(doraRecords.every((record) => DORA_RELEVANCE_VALUES.includes(record.relevance)));
  assert.ok(doraRecords.every((record) => record.regime === 'DORA'));
  assert.equal(getSummary(doraRecords).upcoming, 4);
});

test('DGA relevance stays separate from the DORA set', () => {
  const dgaRecords = filterRecords(records, {
    regime: 'DGA',
    relevance: 'all',
    status: 'all',
    dateRange: 'all',
  });

  assert.equal(dgaRecords.length, 2);
  assert.ok(dgaRecords.every((record) => DGA_RELEVANCE_VALUES.includes(record.relevance)));
  assert.ok(dgaRecords.every((record) => record.regime !== 'DORA'));
});

test('visible record copy is bilingual and labels resolve per language', () => {
  for (const record of records) {
    for (const field of ['topic', 'source', 'affectedParty', 'summary', 'evidenceExcerpt']) {
      assert.equal(typeof record[field], 'object');
      assert.equal(typeof record[field].zh, 'string');
      assert.equal(typeof record[field].en, 'string');
    }
  }

  assert.equal(labelFor(REGIME_OPTIONS, 'DORA', 'zh'), 'DORA');
  assert.equal(labelFor(REGIME_OPTIONS, 'all', 'en'), 'All regimes');
  assert.equal(text({ zh: '中文', en: 'English' }, 'en'), 'English');
  assert.equal(formatDate('2026-11-20', 'en'), '20 Nov');
});
