export const DATASET_STATUSES = ['demo', 'pending-review', 'reviewed'];
export const RECORD_TYPE_VALUES = [
  'designation',
  'annual-report',
  'guidance',
  'q-and-a',
  'enforcement-case',
  'operational-theme',
  'other',
];
export const REVIEW_DECISIONS = ['pending', 'approved', 'rejected'];
export const FRESHNESS_WINDOW_DAYS = 30;

const RECORD_STATUSES = ['open', 'under-review', 'reviewed'];
const PRIORITIES = ['high', 'medium', 'low'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function isBilingual(value) {
  return Boolean(value)
    && typeof value === 'object'
    && typeof value.zh === 'string'
    && value.zh.trim().length > 0
    && typeof value.en === 'string'
    && value.en.trim().length > 0;
}

function isText(value) {
  return (typeof value === 'string' && value.trim().length > 0) || isBilingual(value);
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

function isValidRecord(record, requireRecordType = false) {
  if (!record || typeof record !== 'object') return false;
  const recordTypeIsValid = RECORD_TYPE_VALUES.includes(record.recordType)
    || (!requireRecordType && record.recordType === undefined);
  return typeof record.id === 'string'
    && record.id.trim().length > 0
    && typeof record.regime === 'string'
    && typeof record.relevance === 'string'
    && RECORD_STATUSES.includes(record.status)
    && PRIORITIES.includes(record.priority)
    && recordTypeIsValid
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

function isValidReviewEnvelope(review, datasetStatus) {
  if (datasetStatus === 'demo' && review === undefined) return true;
  if (!review || typeof review !== 'object') return false;
  if (!REVIEW_DECISIONS.includes(review.decision)) return false;
  if (!isText(review.notes)) return false;
  if (review.reviewer !== null && (typeof review.reviewer !== 'string' || review.reviewer.trim().length === 0)) return false;
  if (!isIsoDate(review.reviewedAt, true)) return false;
  if (datasetStatus === 'reviewed') {
    return review.decision === 'approved'
      && typeof review.reviewer === 'string'
      && review.reviewer.trim().length > 0
      && isIsoDate(review.reviewedAt);
  }
  if (datasetStatus === 'pending-review') {
    return review.decision === 'pending' && review.reviewer === null && review.reviewedAt === null;
  }
  return true;
}

export function normalizeDatasetStatus(value) {
  return DATASET_STATUSES.includes(value) ? value : 'demo';
}

export function getRecordFreshness(record, referenceDate) {
  if (!isIsoDate(record?.lastVerifiedAt) || !isIsoDate(referenceDate)) {
    return { stale: true, ageDays: null, reason: 'missing-date' };
  }
  const ageDays = Math.max(0, Math.floor((Date.parse(`${referenceDate}T00:00:00Z`) - Date.parse(`${record.lastVerifiedAt}T00:00:00Z`)) / DAY_MS));
  return {
    stale: ageDays > FRESHNESS_WINDOW_DAYS,
    ageDays,
    reason: ageDays > FRESHNESS_WINDOW_DAYS ? 'expired' : 'current',
  };
}

export function validateRecordSnapshot(snapshot) {
  const errors = [];
  const warnings = [];
  if (!snapshot || typeof snapshot !== 'object') {
    return { valid: false, errors: ['Snapshot must be an object.'], warnings };
  }

  const rawStatus = snapshot.dataset_status;
  const datasetStatus = normalizeDatasetStatus(rawStatus);
  if (!DATASET_STATUSES.includes(rawStatus)) errors.push(`Unknown dataset_status: ${String(rawStatus)}.`);
  if (!isIsoDate(snapshot.as_of)) errors.push('as_of must be an ISO date.');
  if (datasetStatus !== 'demo' && !isText(snapshot.review_gate)) {
    errors.push('review_gate is required for non-demo datasets.');
  }
  if (!Array.isArray(snapshot.records) || snapshot.records.length === 0) {
    errors.push('records must be a non-empty array.');
  } else {
    snapshot.records.forEach((record, index) => {
      if (!isValidRecord(record, datasetStatus !== 'demo')) errors.push(`records[${index}] has an invalid shape.`);
      const freshness = getRecordFreshness(record, snapshot.as_of);
      if (freshness.stale) {
        const age = freshness.ageDays === null ? 'unknown age' : `${freshness.ageDays} days old`;
        warnings.push(`Record ${record?.id || index} has stale evidence (${age}).`);
      }
    });
  }
  if (!isValidReviewEnvelope(snapshot.review, datasetStatus)) {
    errors.push(`review metadata is invalid for ${datasetStatus} dataset.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    datasetStatus,
    recordCount: Array.isArray(snapshot.records) ? snapshot.records.length : 0,
  };
}

export function normalizeRecordSnapshot(snapshot, fallbackRecords) {
  const validation = validateRecordSnapshot(snapshot);
  if (!validation.valid) {
    return {
      records: fallbackRecords,
      datasetStatus: 'demo',
      asOf: null,
      reviewGate: null,
      review: null,
      freshnessWarnings: [],
    };
  }

  return {
    records: snapshot.records,
    datasetStatus: validation.datasetStatus,
    asOf: snapshot.as_of,
    reviewGate: snapshot.review_gate || null,
    review: snapshot.review || null,
    freshnessWarnings: validation.warnings,
  };
}
