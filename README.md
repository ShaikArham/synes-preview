<div align="center">

# SYNES

### BUILD, TEST AND INVESTIGATE WORKFLOWS WITH CONFIDENCE

**An independent workflow automation and operations lab.**

![Status](https://img.shields.io/badge/Project-Independent%20demo-7353ba?style=flat-square) ![Scenarios](https://img.shields.io/badge/Data-Synthetic-334155?style=flat-square) ![Review](https://img.shields.io/badge/Actions-Human%20review-075d60?style=flat-square)

[**Public preview repository**](https://github.com/ShaikArham/synes-preview) · [**Public demo**](https://synes-dublin.vercel.app) · [**Portfolio**](https://arham-bi.vercel.app/)

*Shaik Arham Saquib · Dublin, Ireland*

</div>

---

## What is SYNES?

SYNES is an independent educational project exploring how teams build, run, monitor and troubleshoot workflow automations. It brings a visual workflow composer together with synthetic execution scenarios, incident investigation, approval steps and operational activity.

The project is built around practical questions: What happened during a run? Which step failed? What evidence helps explain it? What should happen before a change is approved? How can recovery be checked?

## Explore the project

| Area | What it demonstrates |
| :--- | :--- |
| **Workflow Studio** | Create and inspect visual workflows, configure steps and simulate execution |
| **Incident Investigation** | Explore synthetic HTTP 401, 422 and 429 failures, evidence, diagnosis and recovery verification |
| **Monitoring and Activity** | Review execution history and the events recorded during a demo session |
| **Approvals** | Follow human-review steps before simulated remediation or report output |
| **Finance workflow** | Request an October report, prepare a draft, review it and generate a local synthetic CSV |

These are educational demonstrations using fictional records. They are not connected to production systems.

## Run locally

```bash
python -m unittest discover -s tests -v
python -m synes
```

The API runs locally at `http://127.0.0.1:8080`.

## Project boundaries

- SYNES is an independent project. It is not affiliated with, endorsed by, or sponsored by Tines.
- The project does not connect to a live Tines workspace or claim to reproduce Tines' internal architecture.
- Scenarios, records, actors and execution results are synthetic.
- Role labels in the demo are illustrative. They are not authenticated production access controls.
- No external messages, payments or production actions are performed.

See [Independence and originality](INDEPENDENCE_AND_ORIGINALITY.md) for the project's branding, design and publishing boundaries.

---

[**Explore the repository**](https://github.com/ShaikArham/synes) · [**Open the public demo**](https://synes-dublin.vercel.app) · [**Meet the builder**](https://arham-bi.vercel.app/)
