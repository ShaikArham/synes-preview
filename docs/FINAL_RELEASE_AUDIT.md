# SYNES final release audit (working)
Date: 2026-11-13
Scope: Public browser-only preview and private SYNES application. This is a verification ledger, not a claim of complete QA.

## Phase 1: Browser QA
- [x] Added Playwright script at tests/preview-browser.cjs for 320/390/768/1440px.
- [x] Added workflow .github/workflows/preview-browser.yml.
- [x] Test assertions cover synthetic 401 approval/verification, 422 rejection, viewport overflow, mobile menu, JavaScript exceptions, external requests.
- [ ] Obtain successful GitHub Actions run; workflow has not surfaced a run for branch commits.
- [ ] Verify deployed URL with actual browser execution and screenshots.
- [ ] Inspect tab/keyboard accessibility, color contrast, and 429 path.
- [ ] Record failures and fix before release.

## Phase 2: Feature audit
- [x] Overview synthetic incident list, metrics, evidence/decision/verification tabs present in public preview.
- [x] Browser-only incident creation and lifecycle guarded by diagnosis, human approval, verification.
- [x] No real Tines connection or production recovery claimed.
- [x] Source inspected: private web/3b.html contains investigations, monitoring, access/governance and activity/audit terminology and UI code; this is source presence, not functional verification.\n- [x] Source inspected: private web/composer.html exists as a separate Composer UI; functionality remains unverified.\n- [ ] Run module-level browser interactions and confirm correct data/state transitions for every private module.
- [x] Private synes/server.py inspected: POST /api/simulate and /api/incidents/{id}/diagnose|approve|verify|customer-update have no authentication; backend must remain local/private until access controls and isolation are added.
- [x] Public preview's misleading Operations Lab link replaced with an in-page workspace link.\n- [ ] Compare private and public experiences; public preview does not include the full private Operations Lab or Composer.

## Phase 3: Hiring manager review
- [ ] First-visit walkthrough: 401 -> diagnose -> approve -> verify.
- [ ] Second walkthrough: 422 -> diagnose -> reject -> blocked verification.
- [ ] Third walkthrough: 429 -> retry guidance -> approval gate.
- [ ] Add explicit scope/limitations, technical architecture, design decisions and clear project links.
- [ ] Check mobile 320px and desktop parity with real screenshots.

## Phase 4: Release
- [ ] CI passing on relevant branches.
- [ ] Deployment live verified independently.
- [x] README updated with live Overview/Operations Lab, guided reviewer walkthrough and honest security/QA limitations.\n- [ ] Capture actual 60-second demo video; current walkthrough is interactive, not a recorded film.
- [ ] PR review and safe merge decision by owner; never merge main automatically.
- [ ] Final evidence-based readiness score.

## Deployment
Public URL: https://synes-hybrid-overview-preview.vercel.app
Preview branch: work/hybrid-overview-preview
Private branch: work/hybrid-overview
\n## Phase 2 source audit observations\n- Private web/3b.html: 49,603 characters; source contains Monitoring, Governance, Activity, Audit and investigation UI references. Presence does not prove functional browser QA.\n- Private web/composer.html: 3,068 characters, a separate Message to Workflow Studio entry page; associated script dependencies need review.\n- Private synes/server.py: serves /overview, /3b, /composer, /health, and synthetic incident routes; mutable incident API is unauthenticated. Do not deploy this server publicly.\n- Public preview: interactive browser-only lifecycle, not a live private backend connection.\n
## Verification checkpoint — 2026-11-13
- Vercel deployment `dpl_H3czy1yCSNoCSBhhLPFErVbzrk8p` returned READY with production alias `synes-hybrid-overview-preview.vercel.app`.
- Source assertions passed: Overview guided start button and handler, diagnose/approve/reject/verify controls, standalone Operations Lab, no `fetch(` call in Lab, four viewport widths, 429 scenario and browser reset test.
- These are source inspections only, **not** executed Playwright/browser QA. The GitHub workflow-run lookup available here filters to pull-request-triggered runs and returning an empty list does **not** prove that push-triggered CI did not run.
- Release remains gated on actual CI job results, browser interactions, and recorded demo evidence.
