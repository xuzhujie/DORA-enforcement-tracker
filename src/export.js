import { PRIORITY_OPTIONS, RELEVANCE_OPTIONS, STATUS_OPTIONS, labelFor } from './data.js';
import { formatLongDate, text, UI } from './copy.js';

export function buildExportRows(items, language = 'zh') {
  return items.map((record) => [
    record.regime,
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
  ]);
}

export function buildCsvContent(items, language = 'zh') {
  const headers = UI[language].export.headers;
  const rows = buildExportRows(items, language);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  return `\ufeff${csv}`;
}

export function buildMarkdownContent(items, language = 'zh', referenceDate = '2026-11-20') {
  const copy = UI[language];
  const headers = copy.export.headers;
  const rows = buildExportRows(items, language);
  return [
    `# ${copy.pageTitle}`,
    '',
    `- ${copy.footnote.referenceDate}: ${formatLongDate(referenceDate, language)}`,
    `- ${copy.evidence.count(items.length)}`,
    '',
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell).replaceAll('|', '\\|')).join(' | ')} |`),
    '',
    `> ${copy.demoNotice}`,
  ].join('\n');
}

export function buildJsonContent(items, language = 'zh', referenceDate = '2026-11-20') {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    referenceDate,
    language,
    records: items,
  }, null, 2);
}
