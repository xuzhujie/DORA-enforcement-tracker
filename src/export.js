import { getRecordType, PRIORITY_OPTIONS, RECORD_TYPE_OPTIONS, RELEVANCE_OPTIONS, STATUS_OPTIONS, labelFor } from './data.js';
import { formatLongDate, text, UI } from './copy.js';

export function buildExportRows(items, language = 'zh', context = {}) {
  const review = context.review || {};
  return items.map((record) => [
    record.regime,
    labelFor(RECORD_TYPE_OPTIONS, getRecordType(record), language),
    labelFor(RELEVANCE_OPTIONS, record.relevance, language),
    text(record.topic, language),
    text(record.source, language),
    text(record.affectedParty, language),
    labelFor(STATUS_OPTIONS, record.status, language),
    labelFor(PRIORITY_OPTIONS, record.priority, language),
    formatLongDate(record.lastUpdate, language),
    formatLongDate(record.dueDate, language),
    record.sourceUrl,
    text(record.evidenceExcerpt, language),
    context.referenceDate || context.asOf || '',
    context.datasetStatus || 'demo',
    text(context.reviewGate, language),
    review.reviewer || '',
    formatLongDate(review.reviewedAt, language),
    text(review.notes, language),
  ]);
}

export function buildCsvContent(items, language = 'zh', context = {}) {
  const headers = UI[language].export.headers;
  const rows = buildExportRows(items, language, context);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  return `\ufeff${csv}`;
}

export function buildMarkdownContent(items, language = 'zh', referenceDate = '2026-11-20', context = {}) {
  const copy = UI[language];
  const headers = copy.export.headers;
  const rows = buildExportRows(items, language, context);
  const review = context.review || {};
  return [
    `# ${copy.pageTitle}`,
    '',
    `- ${copy.footnote.referenceDate}: ${formatLongDate(referenceDate, language)}`,
    `- ${copy.evidence.count(items.length)}`,
    `- ${copy.export.datasetStatus}: ${context.datasetStatus || 'demo'}`,
    ...(context.reviewGate ? [`- ${copy.export.reviewGate}: ${text(context.reviewGate, language)}`] : []),
    ...(review.reviewer ? [`- ${copy.export.reviewer}: ${review.reviewer}`] : []),
    ...(review.reviewedAt ? [`- ${copy.export.reviewedAt}: ${formatLongDate(review.reviewedAt, language)}`] : []),
    ...(review.notes ? [`- ${copy.export.reviewNotes}: ${text(review.notes, language)}`] : []),
    '',
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell).replaceAll('|', '\\|')).join(' | ')} |`),
    '',
    `> ${context.datasetNotice || copy.datasetNotice.demo}`,
  ].join('\n');
}

export function buildJsonContent(items, language = 'zh', referenceDate = '2026-11-20', context = {}) {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    referenceDate,
    language,
    datasetStatus: context.datasetStatus || 'demo',
    reviewGate: context.reviewGate || null,
    review: context.review || null,
    records: items,
  }, null, 2);
}
