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
- [ ] Verify private Investigations, Monitoring, Access & Governance, Activity & Audit, Workflow Composer against branch/PR source and end-to-end tests.
- [ ] Confirm private backend routes are not publicly exposed without authentication and isolation.
- [ ] Review all public navigation links and avoid dead ends.

## Phase 3: Hiring manager review
- [ ] First-visit walkthrough: 401 -> diagnose -> approve -> verify.
- [ ] Second walkthrough: 422 -> diagnose -> reject -> blocked verification.
- [ ] Third walkthrough: 429 -> retry guidance -> approval gate.
- [ ] Add explicit scope/limitations, technical architecture, design decisions and clear project links.
- [ ] Check mobile 320px and desktop parity with real screenshots.

## Phase 4: Release
- [ ] CI passing on relevant branches.
- [ ] Deployment live verified independently.
- [ ] README and 60-second demonstration.
- [ ] PR review and safe merge decision by owner; never merge main automatically.
- [ ] Final evidence-based readiness score.

## Deployment
Public URL: https://synes-hybrid-overview-preview.vercel.app
Preview branch: work/hybrid-overview-preview
Private branch: work/hybrid-overview
