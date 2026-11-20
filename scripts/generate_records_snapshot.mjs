/* global console, process */

import { writeFile } from 'node:fs/promises';
import { URL } from 'node:url';

import { getRecordType, REFERENCE_DATE, records } from '../src/data.js';

export function buildRecordsSnapshot(items = records, asOf = REFERENCE_DATE) {
  return {
    dataset_status: 'demo',
    as_of: asOf,
    review_gate: 'Replace only with a human-reviewed production dataset; this snapshot is not legal advice.',
    review: {
      decision: 'pending',
      reviewer: null,
      reviewedAt: null,
      notes: 'Demo seed; not reviewed.',
    },
    records: items.map((item) => ({ ...item, recordType: getRecordType(item) })),
  };
}

export async function writeRecordsSnapshot(output = new URL('../public/data/records.json', import.meta.url)) {
  const snapshot = buildRecordsSnapshot();
  await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  return snapshot;
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  const snapshot = await writeRecordsSnapshot();
  console.log(`generated records snapshot from ${snapshot.records.length} records`);
}
