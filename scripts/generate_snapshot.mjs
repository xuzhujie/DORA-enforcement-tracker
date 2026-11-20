/* global console, process */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';

import {
  REFERENCE_DATE,
  RELEVANCE_OPTIONS,
  STATUS_OPTIONS,
  records,
  getSummary,
  labelFor,
} from '../src/data.js';
import { text, UI } from '../src/copy.js';
import { normalizeRecordSnapshot } from '../src/recordSnapshot.js';

const templatePath = new URL('../public/static/index.html', import.meta.url);
const recordSnapshotPath = new URL('../public/data/records.json', import.meta.url);

function replaceSlot(template, markerName, placeholder, value) {
  const start = `<!-- snapshot:${markerName}:start -->`;
  const end = `<!-- snapshot:${markerName}:end -->`;
  const markerPattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
  if (template.includes(start)) return template.replace(markerPattern, `${start}${value}${end}`);
  return template.replaceAll(placeholder, value);
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function bilingualAttributes(value) {
  return `data-zh="${escapeHtml(text(value, 'zh'))}" data-en="${escapeHtml(text(value, 'en'))}"`;
}

function datasetNotice(status, language) {
  return UI[language].datasetNotice[status] || UI[language].datasetNotice.demo;
}

function recordRow(record) {
  const regime = escapeHtml(record.regime);
  const topicZh = escapeHtml(text(record.topic, 'zh'));
  const topicEn = escapeHtml(text(record.topic, 'en'));
  const relevanceZh = escapeHtml(labelFor(RELEVANCE_OPTIONS, record.relevance, 'zh'));
  const relevanceEn = escapeHtml(labelFor(RELEVANCE_OPTIONS, record.relevance, 'en'));
  const statusZh = escapeHtml(labelFor(STATUS_OPTIONS, record.reviewed ? 'reviewed' : record.status, 'zh'));
  const statusEn = escapeHtml(labelFor(STATUS_OPTIONS, record.reviewed ? 'reviewed' : record.status, 'en'));
  const sourceZh = escapeHtml(text(record.source, 'zh'));
  const sourceUrl = escapeHtml(record.sourceUrl);

  return `          <tr data-record-id="${escapeHtml(record.id)}"><td><span class="chip">${regime}</span></td><td data-zh="${topicZh}" data-en="${topicEn}">${topicZh}</td><td data-zh="${relevanceZh}" data-en="${relevanceEn}">${relevanceZh}</td><td data-zh="${statusZh}" data-en="${statusEn}">${statusZh}</td><td><a href="${sourceUrl}" ${bilingualAttributes(record.source)}>${sourceZh}</a></td></tr>`;
}

export function generateSnapshotHtml(template, items = records, referenceDate = REFERENCE_DATE, datasetStatus = 'demo') {
  const summaryItems = items.map((item) => (item.reviewed ? { ...item, status: 'reviewed' } : item));
  const summary = getSummary(summaryItems);
  let html = template;
  html = replaceSlot(html, 'date', '__SNAPSHOT_DATE__', escapeHtml(referenceDate));
  const zhNotice = datasetNotice(datasetStatus, 'zh');
  const enNotice = datasetNotice(datasetStatus, 'en');
  const noticeMarkup = `<span data-zh="${escapeHtml(zhNotice)}" data-en="${escapeHtml(enNotice)}">${escapeHtml(zhNotice)}</span>`;
  html = replaceSlot(html, 'dataset-notice', '__DATASET_NOTICE__', noticeMarkup);
  html = replaceSlot(html, 'open-count', '__OPEN_COUNT__', escapeHtml(summary.open));
  html = replaceSlot(html, 'under-review-count', '__UNDER_REVIEW_COUNT__', escapeHtml(summary.underReview));
  html = replaceSlot(html, 'upcoming-count', '__UPCOMING_COUNT__', escapeHtml(summary.upcoming));
  html = replaceSlot(html, 'rows', '__RECORD_ROWS__', items.map(recordRow).join('\n'));
  return html;
}

export async function writeSnapshot({ template = templatePath, output = templatePath, data = recordSnapshotPath } = {}) {
  const source = await readFile(template, 'utf8');
  let dataset = { records, datasetStatus: 'demo', asOf: REFERENCE_DATE };
  try {
    const snapshot = JSON.parse(await readFile(data, 'utf8'));
    const normalized = normalizeRecordSnapshot(snapshot, records);
    dataset = {
      records: normalized.records,
      datasetStatus: normalized.datasetStatus,
      asOf: normalized.asOf || REFERENCE_DATE,
    };
  } catch {
    // Keep the built-in records when the replaceable snapshot is unavailable.
  }
  const html = generateSnapshotHtml(source, dataset.records, dataset.asOf, dataset.datasetStatus);
  await writeFile(output, html, 'utf8');
  return html;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await writeSnapshot();
  console.log('generated static snapshot from the replaceable records snapshot');
}
