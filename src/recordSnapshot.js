export const DATASET_STATUSES = ['demo', 'pending-review', 'reviewed'];

const RECORD_STATUSES = ['open', 'under-review', 'reviewed'];
const PRIORITIES = ['high', 'medium', 'low'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isBilingual(value) {
  return Boolean(value)
    && typeof value === 'object'
    && typeof value.zh === 'string'
    && value.zh.trim().length > 0
    && typeof value.en === 'string'
    && value.en.trim().length > 0;
}

function isIsoDate(value, allowNull = false) {
  if (allowNull && value === null) return true;
  return typeof value === 'string' && ISO_DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isValidSourceUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidRecord(record) {
  if (!record || typeof record !== 'object') return false;
  return typeof record.id === 'string'
    && record.id.trim().length > 0
    && typeof record.regime === 'string'
    && typeof record.relevance === 'string'
    && RECORD_STATUSES.includes(record.status)
    && PRIORITIES.includes(record.priority)
    && isBilingual(record.topic)
    && isBilingual(record.source)
    && isBilingual(record.affectedParty)
    && isBilingual(record.summary)
    && isBilingual(record.evidenceExcerpt)
    && isBilingual(record.businessImpact)
    && isBilingual(record.owner)
    && isBilingual(record.nextAction)
    && isValidSourceUrl(record.sourceUrl)
    && isIsoDate(record.lastUpdate)
    && isIsoDate(record.publishedAt)
    && isIsoDate(record.lastVerifiedAt)
    && isIsoDate(record.dueDate, true);
}

function isValidRecords(records) {
  return Array.isArray(records) && records.length > 0 && records.every(isValidRecord);
}

export function normalizeDatasetStatus(value) {
  return DATASET_STATUSES.includes(value) ? value : 'demo';
}

export function normalizeRecordSnapshot(snapshot, fallbackRecords) {
  const hasRecords = isValidRecords(snapshot?.records);
  if (!hasRecords) {
    return {
      records: fallbackRecords,
      datasetStatus: 'demo',
      asOf: null,
      reviewGate: null,
    };
  }

  return {
    records: snapshot.records,
    datasetStatus: normalizeDatasetStatus(snapshot.dataset_status),
    asOf: snapshot.as_of || null,
    reviewGate: snapshot.review_gate || null,
  };
}
