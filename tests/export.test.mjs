import test from 'node:test';
import assert from 'node:assert/strict';

import { buildCsvContent, buildExportRows, buildJsonContent, buildMarkdownContent } from '../src/export.js';
import { records } from '../src/data.js';

test('exports localized priority labels and readable dates', () => {
  const english = buildExportRows(records.slice(0, 1), 'en')[0];
  const chinese = buildExportRows(records.slice(0, 1), 'zh')[0];

  assert.equal(english[1], 'Operational theme');
  assert.equal(english[7], 'High');
  assert.equal(english[8], '18 Nov 2026');
  assert.equal(chinese[1], '运营主题');
  assert.equal(chinese[7], '高');
  assert.equal(chinese[8], '2026年11月18日');
});

test('exports preserve shared review context and dataset reference date', () => {
  const context = {
    datasetStatus: 'pending-review',
    reviewGate: { zh: '待业务复核', en: 'Business review pending' },
    review: { decision: 'pending', reviewer: null, reviewedAt: null, notes: { zh: '等待复核', en: 'Awaiting review' } },
  };
  const csv = buildCsvContent(records.slice(0, 1), 'en', { ...context, referenceDate: '2027-01-20' });
  const markdown = buildMarkdownContent(records.slice(0, 1), 'en', '2027-01-20', { ...context, datasetNotice: 'Pending review' });
  const json = JSON.parse(buildJsonContent(records.slice(0, 1), 'en', '2027-01-20', context));

  assert.match(csv, /Dataset status/);
  assert.match(csv, /Dataset reference date/);
  assert.match(csv, /2027-01-20/);
  assert.match(csv, /Business review pending/);
  assert.match(markdown, /2027/);
  assert.match(markdown, /Business review pending/);
  assert.equal(json.referenceDate, '2027-01-20');
  assert.equal(json.review.decision, 'pending');
});
