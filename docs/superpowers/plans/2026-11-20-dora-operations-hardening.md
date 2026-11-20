# DORA Operations Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining operational gaps in the shipped DORA tracker without expanding its legal scope.

**Architecture:** Keep the existing React/Vite dashboard and GitHub Pages deployment. Generate the runtime records snapshot and printable snapshot from the current data module, and add a small action-to-detail interaction so operational fields remain connected to the record evidence.

**Tech Stack:** React 18, Vite 8, Node test runner, Python monitor, Playwright, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/designs/2026-11-20-dora-operations-hardening.md`

## Global Constraints

- DORA default scope remains financial customers and critical ICT supply chains.
- DGA remains secondary and only appears for data-intermediary or relevant non-personal-data-transfer scenarios.
- Hash changes trigger human review; they never create legal conclusions automatically.
- `dataset_status: "demo"` remains visible until an approved production snapshot replaces it.
- Preserve the existing bilingual copy contract and CI gates.

## Review Focus

- Action rows must expose the operational next action and business impact, then select the same detail record.
- The generated snapshot must contain every current record and reconcile its KPI counts with `getSummary`.
- A missing or malformed runtime records snapshot must leave the app usable with the built-in fallback.
- Switching to a reviewed snapshot must change the dataset notice without changing DORA/DGA filtering rules.
- The real monitor run must preserve official links, hashes, and the human-review disclaimer.

### Task 1: Connect upcoming actions to delivery detail

**Files:**
- Modify: `src/App.jsx`, `src/components.jsx`, `src/copy.js`, `src/styles.css`
- Test: `tests/e2e/dashboard.spec.js`

- [x] Write a Playwright test that sees next action and business impact in the first upcoming row and opens its matching detail record.
- [x] Run the focused browser test and confirm it fails because the row is not selectable and the two fields are not rendered.
- [x] Add `onSelect` to `UpcomingActions`, render compact action/impact lines, and pass `setSelectedId` from `App`.
- [x] Add bilingual labels and keyboard/focus styling for the action-row button.
- [x] Run the focused browser test and the full browser suite.

### Task 2: Generate the static snapshot from the dataset

**Files:**
- Create: `scripts/generate_snapshot.mjs`, `tests/snapshot.test.mjs`
- Modify: `public/static/index.html`, `package.json`

- [x] Write a Node test for generated row coverage, dataset KPI reconciliation, and HTML escaping.
- [x] Run the focused test and confirm it fails because the generator does not exist.
- [x] Implement `generateSnapshotHtml(template, items, referenceDate)` and a CLI that reads/writes `public/static/index.html`.
- [x] Replace hard-coded KPI and row content with generated placeholders and run the generator.
- [x] Add `snapshot` and `prebuild` scripts, then run the focused test and build.

### Task 3: Add a safe production records handoff

**Files:**
- Create: `scripts/generate_records_snapshot.mjs`, `src/recordSnapshot.js`, `public/data/records.json`, `tests/record-snapshot.test.mjs`
- Modify: `src/App.jsx`, `src/components.jsx`, `src/copy.js`, `package.json`, `README.md`

- [x] Write tests for valid snapshot normalization, malformed fallback, and reviewed/demo dataset notice selection.
- [x] Run the focused tests and confirm they fail because the snapshot module does not exist.
- [x] Generate the current records into `public/data/records.json` with `dataset_status: "demo"` and a human-review gate.
- [x] Load the snapshot in `App` with the built-in records as fallback and make the notice status-aware.
- [x] Add a records snapshot generation script and document the approved replacement workflow.
- [x] Run focused tests, full JS tests, lint, and build; keep `prebuild` from overwriting a reviewed snapshot.

### Task 4: First real source-monitor run and delivery evidence

**Files:**
- Modify: `docs/superpowers/plans/2026-11-20-dora-operations-hardening.md`, `.superpowers/sdd/2026-11-20-dora-enforcement-tracker/progress.md`
- Runtime artifact: `public/data/updates.json` only if the official monitor produces a new snapshot.

- [x] Run `python3 scripts/check_updates.py` against the official EBA pages.
- [x] Inspect the resulting hashes, dates, and links; do not promote them into records automatically.
- [x] Run the full local verification suite and update the ledger with the observed source result.

### Task 5: Whole-branch verification and publish

- [x] Run JS tests, Python tests, lint, build, Playwright smoke, audits, and `git diff --check`.
- [x] Run the local dashboard through the available Playwright browser flow and verify the action-to-detail interaction in Chinese and English.
- [x] Commit and push the completed operational hardening changes.
- [x] Verify GitHub Actions build/deploy and the public Pages URL.
