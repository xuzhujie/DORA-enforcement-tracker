# DORA Operations Hardening Design

## Intent

Turn the shipped DORA tracker into a repeatable operating surface: source monitoring should produce a reviewable update, upcoming actions should lead directly to a record and its business impact, the printable snapshot should stay in sync with the dataset, and a production team should have a safe handoff path for replacing demo records.

## Goals

- Make every upcoming action show its next action and business impact, and open the matching detail record when selected.
- Generate the static/shareable snapshot from the same replaceable record dataset used by the app instead of maintaining three hard-coded rows.
- Load an explicit `public/data/records.json` snapshot at runtime, while retaining the current dataset as a safe fallback.
- Keep the dataset status visible: demo data remains visibly demo until a human-reviewed snapshot replaces it.
- Run the official EBA monitor once, inspect the resulting source hashes, and preserve the existing human-review gate.

## Non-goals and anti-goals

- Do not infer legal applicability, penalties, or enforcement conclusions from a page hash.
- Do not manufacture or silently relabel legal cases as reviewed; production records require an approved source and human/legal review.
- Do not add a backend, account system, or a separate DGA tracker; DGA remains secondary and scoped to data intermediaries or relevant non-personal-data transfers.

## Approaches

1. Keep the current hard-coded static HTML and add more rows manually. This is fast but will drift from the app and fails the delivery-effect goal.
2. Seed `public/data/records.json` from the existing `src/data.js`, let both the app and the static generator consume that replaceable snapshot, and fall back to the built-in records when it is missing or malformed. This preserves the current stack, keeps the change reversible, and gives the team a clear production handoff. **Chosen.**
3. Add a backend and database for records, reminders, and source ingestion. This would support multi-user workflows but expands deployment, security, and legal-data scope beyond the current tracker.

## Constraints

- Keep React/Vite, GitHub Pages, and the existing bilingual copy contract.
- Keep DORA default scope limited to `financial-customer` and `critical-ict-supply-chain`.
- Keep source monitoring official-page/hash based and human-review gated.
- Keep Node 22.12.0 and the existing test/lint/build/Playwright gates.

## Operating decisions

- `public/data/records.json` is the replaceable handoff artifact; `dataset_status: "demo"` is the safe default.
- `npm run records:snapshot` seeds `public/data/records.json` with the demo dataset; `npm run snapshot` reads that replaceable snapshot to generate `public/static/index.html`, including its dataset status and KPI counts.
- The normal production build refreshes only the static artifact, so a manually reviewed `records.json` cannot be overwritten by CI.
- The first real EBA monitor run is an operational verification, not permission to promote any update into a legal conclusion.
