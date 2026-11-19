# DORA Enforcement Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a polished, responsive React/Vite regulatory enforcement tracker and dashboard that narrows DORA to financial-customer and critical-ICT-supply-chain relevance, while separating DGA data-intermediary and non-personal-data-transfer items.

**Architecture:** A small React app composed from data/state helpers, an app shell, summary/trend modules, filter controls, an evidence table, and a selected-record detail panel. All records are local demo data with source URLs and are filtered through one shared derived view so cards, charts, actions, and table stay reconciled.

**Tech Stack:** React, Vite, plain CSS, inline SVG icons, browser-native CSV download.

**Spec:** `docs/superpowers/designs/2026-11-20-dora-enforcement-tracker.md`

## Global Constraints

- DORA is prominent only for `financial-customer` or `critical-ict-supply-chain` relevance.
- DGA is separate only for `data-intermediary` or `non-personal-data-transfer` relevance.
- Demo records must be visibly labelled as demo data.
- Every record keeps a traceable `sourceUrl`.
- Core filters update all derived views; selecting a row updates the detail panel.
- No backend or invented real enforcement statistics.

## Review Focus

- Empty filtered result: the page must show a useful empty state and keep reset available.
- DGA-only relevance: it must not inflate the DORA primary count or DORA chart series.
- Mobile viewport: detail content must remain readable without a fixed-width page overflow.
- CSV export: exported rows must match the currently filtered records.
- Source action: “open source” must use the selected record URL rather than a hard-coded destination.

### Task 1: Scaffold and data contract

**Files:**
- Create: `package.json`, `index.html`, `vite.config.js`, `src/main.jsx`, `src/data.js`
- Test: `npm run build`

**Interfaces:**
- `src/data.js` exports `records`, `filterRecords(records, filters)`, and `getSummary(records)`.

- [ ] Add the Vite/React scripts and mount `App` from `src/main.jsx`.
- [ ] Define the record shape, demo dataset, regime/relevance/status constants, and the shared filtering/summary helpers.
- [ ] Run `npm run build` and confirm the scaffold compiles.

### Task 2: Compose the tracker UI and interactions

**Files:**
- Create: `src/App.jsx`, `src/components.jsx`
- Modify: `src/main.jsx`

**Interfaces:**
- `App` owns `filters`, `selectedId`, and reviewed record state.
- `filterRecords` is the single source for visible table rows and summary calculations.

- [ ] Implement the shell, summary band, trend chart, upcoming actions, filter bar, evidence table, and detail panel from the design spec.
- [ ] Wire filter changes, row selection, reset, mark-for-review, source links, save-view toast, and CSV export.
- [ ] Add accessible labels, buttons, semantic headings, and empty-state copy.

### Task 3: Establish the visual system and responsive behavior

**Files:**
- Create: `src/styles.css`

- [ ] Define color, spacing, typography, border, radius, and elevation tokens matching the generated concept.
- [ ] Implement desktop layout with a fixed-width rail, main evidence workspace, and detail panel.
- [ ] Add responsive rules for tablet/mobile, including collapsible navigation treatment, horizontal table scroll, and stacked detail panel.
- [ ] Add reduced-motion support and visible focus states.

### Task 4: Verify behavior and visual fidelity

**Files:**
- Modify: any files required by the verification pass.

- [ ] Run build and inspect the first viewport in Browser/IAB.
- [ ] Verify filters, row selection, CSV export, source link, and review toggle.
- [ ] Inspect desktop and mobile-sized views; fix clipping, overflow, or accidental wrapping.
- [ ] Compare the render to the generated concept at desktop dimensions and record any intentional deviations.

### Extension Task 5: Add bilingual copy and source-backed data fields

**Files:**
- Create: `src/copy.js`
- Modify: `src/data.js`, `src/App.jsx`, `src/components.jsx`, `src/styles.css`
- Test: `tests/data.test.mjs`, `tests/main.test.mjs`

- [x] Use one `zh/en` copy contract for UI labels, records, dates, details, and exports.
- [x] Persist the language toggle and keep DORA/DGA relevance rules separate.
- [x] Add owner, next action, business impact, last verification, and confidence metadata.

### Extension Task 6: Add monitoring and shareable delivery artifacts

**Files:**
- Create: `scripts/check_updates.py`, `scripts/__init__.py`, `public/data/updates.json`, `public/static/index.html`, `.github/workflows/monitor.yml`, `.github/workflows/deploy.yml`
- Test: `tests/test_check_updates.py`

- [x] Detect hash changes on official EBA DORA pages without inferring legal conclusions.
- [x] Add a bilingual printable/shareable static snapshot and multi-format exports.
- [x] Add scheduled monitoring and a Pages workflow with test/lint/build gates.

### Extension Task 7: Quality gates and handoff

**Files:**
- Create: `eslint.config.js`
- Modify: `package.json`, `package-lock.json`, `README.md`

- [x] Run JavaScript tests, Python tests, lint, and production build.
- [x] Verify desktop, English, empty-filter, review, source-link, export, static snapshot, and mobile flows in Browser/IAB.

### Extension Task 8: Publish-ready repository loop

**Files:**
- Create: `.gitignore`
- Modify: `package.json`, `README.md`, `.github/workflows/monitor.yml`, `.github/workflows/deploy.yml`
- Test: `tests/review-regressions.test.mjs`

**Interfaces:**
- The existing Pages workflow remains the deployment contract; source monitoring must update only its snapshot and hand off to the deploy workflow.

- [ ] Add repository hygiene rules and a documented local/remote publish checklist.
- [ ] Add a regression test for the workflow triggers and the required Pages artifact configuration.
- [ ] Initialize the local repository only if it is not already one; do not push without a user-supplied remote.

### Extension Task 9: Source registry, update events, and review log

**Files:**
- Create: `src/sourceRegistry.js`, `src/reviewLog.js`, `public/data/sources.json`, `public/data/review-log.json`, `tests/source-registry.test.mjs`, `tests/review-log.test.mjs`
- Modify: `src/App.jsx`, `src/components.jsx`, `src/copy.js`, `src/styles.css`

**Interfaces:**
- `sourceRegistry` exports official source records with `id`, `regime`, `url`, `authority`, `scope`, `status`, and `lastCheckedAt`.
- `createReviewEntry(recordId, action, at)` returns a serializable review event; `appendReviewEntry(entries, entry, limit)` keeps newest entries first.

- [ ] Keep EBA DORA pages as official monitored sources and represent DGA only as a separate secondary source scope.
- [ ] Render source status and latest update events in a bilingual panel without auto-promoting legal conclusions.
- [ ] Persist local review actions and show the selected record's review history.

### Extension Task 10: Connect delivery effect to actions

**Files:**
- Create: `src/updates.js`
- Modify: `src/App.jsx`, `src/components.jsx`, `src/copy.js`, `src/styles.css`, `src/data.js`
- Test: `tests/data.test.mjs`, `tests/main.test.mjs`

**Interfaces:**
- Existing record fields `owner`, `nextAction`, `dueDate`, and `businessImpact` are visible in the detail/action surfaces.
- `initialUpdateEvents` is a bilingual, source-linked fallback feed that can be refreshed from `public/data/updates.json`.

- [ ] Show owner beside upcoming actions and in the detail facts.
- [ ] Add an update-event feed with source link, date, hash-backed status, and human-review disclaimer.
- [ ] Keep DORA action metrics limited to the two requested relevance values and keep DGA visually separated.

### Extension Task 11: Browser smoke test and dependency security gate

**Files:**
- Create: `playwright.config.js`, `tests/e2e/dashboard.spec.js`
- Modify: `package.json`, `package-lock.json`, `.github/workflows/deploy.yml`
- Test: `npm run test:e2e`, `npm audit --omit=dev`, `npm audit`

- [ ] Add Playwright coverage for language switching, DORA filtering, empty state, review flow, source link, and mobile chart fit.
- [ ] Install/pin Playwright and run the smoke suite against a local Vite server.
- [ ] Run both production and development dependency audits; remediate safe direct dependency findings or document residual transitive findings.

### Extension Task 12: Monitoring regression and final verification

**Files:**
- Modify: `scripts/check_updates.py`, `tests/test_check_updates.py`, `README.md`, `.superpowers/sdd/2026-11-20-dora-enforcement-tracker/progress.md`

- [ ] Compare a fetched source hash only with that source's latest event, so a genuine revert creates a new update event.
- [ ] Re-run JavaScript/Python tests, lint, build, Playwright smoke, and inspect the final diff.
- [ ] Record any external publish blocker separately from the local publish-ready result.
