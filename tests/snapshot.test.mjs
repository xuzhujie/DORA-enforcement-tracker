import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { records, getSummary, REFERENCE_DATE } from '../src/data.js';
import { generateSnapshotHtml, writeSnapshot } from '../scripts/generate_snapshot.mjs';

test('generated snapshot covers every record and reconciles summary metrics', async () => {
  const template = await readFile(new URL('../public/static/index.html', import.meta.url), 'utf8');
  const html = generateSnapshotHtml(template, records, REFERENCE_DATE);
  const summary = getSummary(records.map((record) => (record.reviewed ? { ...record, status: 'reviewed' } : record)));

  assert.equal((html.match(/data-record-id=/g) || []).length, records.length);
  assert.match(html, new RegExp(`snapshot:open-count:start -->${summary.open}<!-- snapshot:open-count:end`));
  assert.match(html, new RegExp(`snapshot:under-review-count:start -->${summary.underReview}<!-- snapshot:under-review-count:end`));
  assert.match(html, new RegExp(`snapshot:upcoming-count:start -->${summary.upcoming}<!-- snapshot:upcoming-count:end`));
  assert.doesNotMatch(html, /__[A-Z_]+__/);
});

test('generated snapshot escapes record content before inserting HTML', async () => {
  const template = '<main><div class="kpis"><strong>__OPEN_COUNT__</strong><strong>__UNDER_REVIEW_COUNT__</strong><strong>__UPCOMING_COUNT__</strong></div><div id="records">__RECORD_ROWS__</div><time>__SNAPSHOT_DATE__</time></main>';
  const item = {
    ...records[0],
    id: 'escape-record',
    topic: { zh: '<script>alert(1)</script>', en: 'A & B' },
    sourceUrl: 'https://example.com/?a=1&b=2',
  };

  const html = generateSnapshotHtml(template, [item], REFERENCE_DATE);

  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /data-record-id="escape-record"/);
});

test('generated snapshot can be regenerated in place without stale rows', async () => {
  const template = await readFile(new URL('../public/static/index.html', import.meta.url), 'utf8');
  const first = generateSnapshotHtml(template, records, REFERENCE_DATE);
  const second = generateSnapshotHtml(first, [records[0]], REFERENCE_DATE);

  assert.equal((second.match(/data-record-id=/g) || []).length, 1);
  assert.match(second, /data-record-id="dora-001"/);
  assert.doesNotMatch(second, /data-record-id="dora-002"/);
});

test('snapshot writer uses the replaceable runtime records and dataset status', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dora-snapshot-'));
  const templatePath = join(directory, 'template.html');
  const outputPath = join(directory, 'snapshot.html');
  const dataPath = join(directory, 'records.json');
  const template = '<main><!-- snapshot:dataset-notice:start -->old<!-- snapshot:dataset-notice:end --><!-- snapshot:date:start -->old<!-- snapshot:date:end --><!-- snapshot:open-count:start -->0<!-- snapshot:open-count:end --><!-- snapshot:under-review-count:start -->0<!-- snapshot:under-review-count:end --><!-- snapshot:upcoming-count:start -->0<!-- snapshot:upcoming-count:end --><!-- snapshot:rows:start -->old<!-- snapshot:rows:end --></main>';
  const productionRecord = {
    ...records[0],
    id: 'production-001',
    status: 'reviewed',
    reviewed: true,
    topic: { zh: '生产审核记录', en: 'Reviewed production record' },
  };

  try {
    await writeFile(templatePath, template, 'utf8');
    await writeFile(dataPath, JSON.stringify({
      dataset_status: 'reviewed',
      as_of: '2026-12-01',
      records: [productionRecord],
    }), 'utf8');
    await writeSnapshot({ template: templatePath, output: outputPath, data: dataPath });
    const html = await readFile(outputPath, 'utf8');

    assert.match(html, /data-record-id="production-001"/);
    assert.doesNotMatch(html, /data-record-id="dora-001"/);
    assert.match(html, /2026-12-01/);
    assert.match(html, /数据已完成人工复核 · 不替代法律意见/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
