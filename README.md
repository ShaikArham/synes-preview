<div align="center">

# SYNES / PUBLIC PREVIEW

### A SUPPORT INVESTIGATION, NOT A BLACK BOX.

**An interactive, browser-only synthetic incident-investigation preview with a standalone Operations Lab.**

[**Explore the live Overview**](https://synes-hybrid-overview-preview.vercel.app/) · [**Operations Lab**](https://synes-hybrid-overview-preview.vercel.app/lab.html) · [**Source repository**](https://github.com/ShaikArham/synes-preview) · [**Arham's portfolio**](https://arham-bi.vercel.app/)

![Project](https://img.shields.io/badge/Portfolio-Independent%20project-075d60?style=flat-square) ![Evidence](https://img.shields.io/badge/Approach-Evidence%20first-334155?style=flat-square)

*Shaik Arham Saquib · Dublin, Ireland*

</div>

---

## 01 / THE QUESTION

**What should a support engineer see between a failed workflow and an approved recovery?**

The preview illustrates evidence gathering, diagnosis, approval and recovery verification for synthetic workflow failures.

> **The goal:** Show the reasoning behind the result, not just the interface that displays it.

## 02 / AT A GLANCE

**401 | 422 | 429 | Evidence | Approval | Recovery verification**

| Reviewer's lens | What to look for |
| :--- | :--- |
| **Product thinking** | The operational question and intended user journey |
| **Engineering** | Static HTML/JavaScript deployed on Vercel; synthetic state is browser-only. |
| **Evidence** | Reproducible examples, explicit rules and documented boundaries |
| **Trust** | A preview is not a connected Tines account, production service or proof of live API-backed recovery. |

## 03 / FIVE-MINUTE REVIEW

Open the live Overview, select **Start guided incident**, diagnose the synthetic HTTP 401, approve the simulated remediation and verify the simulated recovery. Then explore the separate Operations Lab. Refreshing resets the Overview simulator. Review the private main SYNES project for its local incident engine and testable workflow.

## 04 / WHAT IT DEMONSTRATES

- **Problem framing:** Make the operational decision and its context explicit.
- **Traceability:** Explain the inputs, transformations and outputs a reviewer can inspect.
- **Responsible claims:** Separate fictional scenarios, demonstrated results and future work.
- **Communication:** Make technical decisions understandable to both analysts and hiring managers.

## 05 / IMPLEMENTATION AND REPRODUCTION

The original project documentation follows below, including exact commands, metric definitions, architecture, test evidence and limitations where available. The project README remains the authoritative source for its own implementation details.

---

## Detailed project documentation

Public Vercel preview: browser-only synthetic incident simulation and standalone Operations Lab. No connected Tines tenant, live backend, production recovery, or customer data. The local Python incident API in the private SYNES application is unauthenticated and must not be publicly exposed. Browser CI and end-to-end functional verification are outstanding; deployment READY alone does not establish passing QA. See [final release audit](docs/FINAL_RELEASE_AUDIT.md) for the verification ledger.

## Independent project and originality

SYNES is an independent educational workflow operations and incident investigation project. It is **not affiliated with, endorsed by, or sponsored by Tines**. All scenarios and data are synthetic. SYNES uses its own branding, Lavender Cloud theme, and independently developed interface; it does not claim to be a Tines product or live integration.

See [Independence and original-work guidelines](INDEPENDENCE_AND_ORIGINALITY.md) for design, code, branding, asset and publishing boundaries. This disclaimer does not guarantee freedom from legal claims.
