/* global console, process */

import { readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';

import { validateRecordSnapshot } from '../src/recordSnapshot.js';

const defaultPath = new URL('../public/data/records.json', import.meta.url);

export async function validateRecordsFile(file = defaultPath) {
  const snapshot = JSON.parse(await readFile(file, 'utf8'));
  return validateRecordSnapshot(snapshot);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const result = await validateRecordsFile();
    result.warnings.forEach((warning) => console.warn(`warning: ${warning}`));
    if (!result.valid) {
      result.errors.forEach((error) => console.error(`error: ${error}`));
      process.exitCode = 1;
    } else {
      console.log(`validated ${result.recordCount} records (${result.datasetStatus})`);
    }
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}
