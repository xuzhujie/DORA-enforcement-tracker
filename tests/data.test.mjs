import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DGA_RELEVANCE_VALUES,
  DEFAULT_FILTERS,
  DORA_RELEVANCE_VALUES,
  filterRecords,
  getRecordType,
  getSummary,
  getTrend,
  labelFor,
  records,
  RECORD_TYPE_OPTIONS,
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

test('default dashboard scope starts with DORA as the primary view', () => {
  assert.equal(DEFAULT_FILTERS.regime, 'DORA');
  assert.equal(DEFAULT_FILTERS.recordType, 'all');
});

test('record type filter separates official artifact types from operational themes', () => {
  const typedRecords = [
    { ...records[0], recordType: 'designation' },
    { ...records[1], recordType: 'guidance' },
  ];
  const filtered = filterRecords(typedRecords, {
    regime: 'DORA', relevance: 'all', status: 'all', recordType: 'guidance', dateRange: 'all',
  });

  assert.deepEqual(filtered.map((record) => record.id), ['dora-002']);
  assert.equal(getRecordType(records[0]), 'operational-theme');
  assert.equal(labelFor(RECORD_TYPE_OPTIONS, 'annual-report', 'en'), 'Annual report');
});

test('date filters and upcoming actions use the supplied dataset reference date', () => {
  const futureRecord = { ...records[0], lastUpdate: '2027-01-10', dueDate: '2027-01-20' };
  const filters = { regime: 'DORA', relevance: 'all', status: 'all', recordType: 'all', dateRange: '30d' };

  assert.equal(filterRecords([futureRecord], filters, '2027-01-20').length, 1);
  assert.equal(getSummary([futureRecord], '2027-01-01').upcoming, 1);
});

test('trend windows use the supplied dataset reference date', () => {
  const futureRecord = { ...records[0], lastUpdate: '2027-01-10' };
  const trend = getTrend([futureRecord], '2027-01-20');

  assert.equal(trend.labels.at(-1).en, 'Jan');
  assert.equal(trend.series.DORA.at(-1), 1);
});

test('seeded reviewed records have a recoverable non-reviewed base status', () => {
  const seededReviewed = records.filter((record) => record.reviewed);

  assert.ok(seededReviewed.length > 0);
  assert.ok(seededReviewed.every((record) => record.status === 'under-review'));
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
