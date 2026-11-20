# DORA Auditability Optimization Design

## Intent

Make the current DORA tracker safer to operate as a shared review queue: distinguish regulatory artifact types from enforcement cases, make review approval auditable, and surface stale source evidence before it silently drives an action.

## Goals

- Add a bilingual `recordType` field and filter so regulatory reports, guidance, Q&A, designations, and enforcement cases are not conflated.
- Add a machine-checked review envelope that requires reviewer metadata before a dataset can be marked `reviewed`.
- Add freshness validation for source verification dates and show stale evidence in the dashboard.
- Keep the current GitHub Pages + JSON + pull-request workflow; no backend or automatic legal conclusion.

## Non-goals

- Do not infer enforcement, penalties, or applicability from a source hash or record type.
- Do not expand DGA coverage without a data-intermediary or relevant non-personal-data-transfer trigger.
- Do not replace the local review log yet; it remains useful for an individual analyst, while the shared approval gate lives in the committed dataset and CI.

## Approaches

1. **JSON contract + CI gate + dashboard labels (chosen).** Keep the replaceable snapshot, add explicit fields and a validation command, and require reviewer metadata for `reviewed`. This is reversible, reviewable in GitHub, and fits the existing Pages deployment.
2. Add a small database and authenticated review workflow. This would support multi-user edits but introduces hosting, identity, privacy, and operational cost before the dataset has a stable review process.
3. Use GitHub Issues as the only review store. This improves assignment and notifications but makes the dashboard dependent on issue APIs and weakens the portable static snapshot.

## Operating decisions

- `recordType` is a classification label, not a legal conclusion.
- `publishedAt` remains the official source date; `lastUpdate` is the tracker ingestion/review date.
- `dataset_status: "reviewed"` is valid only when the review envelope contains an approved decision, reviewer, date, and notes.
- A stale record remains visible but is marked for re-verification; it is not silently removed.
