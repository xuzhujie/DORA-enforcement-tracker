# DORA Auditability Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the DORA review queue explicit, shared-auditable, and freshness-aware without adding a backend.

**Architecture:** Extend the existing JSON snapshot contract with `recordType` and a dataset-level review envelope. Validate it through a Node CLI and CI, then expose type, review gate, and stale evidence in the existing React dashboard and exports.

**Tech Stack:** React 18, Vite, Node test runner, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/designs/2026-11-20-dora-auditability-optimization.md`

## Global Constraints

- DORA remains focused on financial customers and critical ICT supply chains.
- DGA remains separate and only appears for data intermediaries or relevant non-personal-data transfers.
- `reviewed` requires explicit reviewer metadata and never follows automatically from a source hash.
- `publishedAt` is the source date; `lastUpdate` is the tracker update/review date.
- Keep bilingual copy and the current Pages deployment architecture.

## Review Focus

- A reviewed dataset without approval metadata must fail validation.
- Unknown record types must fail production validation rather than silently becoming enforcement cases.
- Stale evidence must remain visible and be clearly marked.
- The record-type filter must preserve DORA default scope and mobile layout.
- Exports and static snapshots must retain type and review-state context.

### Task 1: Extend and validate the data contract

**Files:**
- Create: `scripts/validate_records.mjs`
- Modify: `src/recordSnapshot.js`, `public/data/records.json`, `package.json`, `tests/record-snapshot.test.mjs`

- [x] Add `RECORD_TYPE_OPTIONS`, review envelope validation, and freshness helpers.
- [x] Write failing tests for approved-review metadata, unknown record types, stale verification dates, and the CLI script contract.
- [x] Implement the validator and `npm run validate:records`.
- [x] Add the current dataset's explicit review envelope and record types.
- [x] Run focused tests and the validator.

### Task 2: Surface type, review, and freshness in the dashboard

**Files:**
- Modify: `src/data.js`, `src/App.jsx`, `src/components.jsx`, `src/copy.js`, `src/styles.css`, `tests/data.test.mjs`, `tests/e2e/dashboard.spec.js`

- [x] Add a record-type filter while keeping DORA as the default regime.
- [x] Show record type and stale verification state in the table/detail view.
- [x] Show the shared review gate and approval metadata in the detail panel.
- [x] Add bilingual tests for filtering, stale display, and the pending-review gate.
- [x] Run focused and full browser tests.

### Task 3: Keep exports, CI, and documentation aligned

**Files:**
- Modify: `src/export.js`, `.github/workflows/deploy.yml`, `README.md`, `tests/export.test.mjs`, `tests/review-regressions.test.mjs`

- [x] Include record type and review context in CSV/JSON/Markdown export.
- [x] Run `npm run validate:records` in the Pages build before tests/build.
- [x] Document the PR approval workflow and stale-record handling.
- [x] Run the full verification suite, commit, push, and verify Actions/Pages.
