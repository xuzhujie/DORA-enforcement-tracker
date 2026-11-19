export const REVIEW_LOG_STORAGE_KEY = 'dora-tracker-review-log';
const DEFAULT_LIMIT = 50;

export function createReviewEntry(recordId, action, at = new Date().toISOString()) {
  if (!recordId || !action) throw new Error('recordId and action are required');
  return {
    id: `review-${recordId}-${at}`,
    recordId,
    action,
    at,
  };
}

export function appendReviewEntry(entries, entry, limit = DEFAULT_LIMIT) {
  return [entry, ...entries].slice(0, limit);
}

export function applyReviewEntries(initialReviewedIds, entries) {
  const reviewedIds = new Set(initialReviewedIds);
  const chronological = [...entries].sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime());
  chronological.forEach((entry) => {
    if (entry.action === 'marked-reviewed') reviewedIds.add(entry.recordId);
    if (entry.action === 'review-cancelled') reviewedIds.delete(entry.recordId);
  });
  return reviewedIds;
}

export function readReviewLog(storage = typeof window === 'undefined' ? null : window.localStorage) {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(REVIEW_LOG_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeReviewLog(entries, storage = typeof window === 'undefined' ? null : window.localStorage) {
  if (storage) storage.setItem(REVIEW_LOG_STORAGE_KEY, JSON.stringify(entries));
}
