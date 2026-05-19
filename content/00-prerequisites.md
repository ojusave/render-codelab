---
order: 0
title: "Before you begin"
duration: 2
---

You will take a ticker-research app from **fragile in-process parallelism** to **isolated Render Workflow tasks** with retries. The tutor runs a shared baseline on Render so everyone sees the same failure mode first. You clone that code, change it in [`ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows), and deploy your own web service and Workflow at the end.

This page is setup only. **Step 1** starts with the shared demo.

> [!NOTE]
> **Pace:** sidebar times add up to about **45 minutes**. Deploy steps (9–10) are tight. If Render builds lag, finish coding through Step 8 and let the tutor carry deploys on the projector.

### What you'll learn

- How the baseline streams research progress over SSE.
- Why `Promise.all` plus a random failure in one search aborts the whole run.
- How to register `searchOne` with `@renderinc/sdk`, dispatch it from the web service, and poll for results.
- How to split **web** and **Workflow** on Render and wire them with `WORKFLOW_SERVICE_SLUG`.

### What you'll need (before deploy)

Gather these before **Step 9** (web) and **Step 10** (Workflow). Not required for Steps 1–8.

- [GitHub](https://github.com/) account for [`ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows).
- [Render](https://render.com/) account. [Create one](https://dashboard.render.com/register) if needed.
- [Render API key](https://render.com/docs/workflows-running#first-create-an-api-key) (`RENDER_API_KEY` on your web service for `startTask` / `getTaskRun`).
- [Anthropic API key](https://console.anthropic.com/) on your **web** service (synthesis).
- [Exa API key](https://dashboard.exa.ai/) on your **Workflow** service (Step 10), where `searchOne` runs.

The tutor's **workshop-demo** already has Exa and Anthropic. You add keys only to **your** Render services.

### Render docs for this workshop

| Topic | Doc |
|-------|-----|
| Concepts (tasks, runs, web vs Workflow) | [Intro to Render Workflows](https://render.com/docs/workflows) |
| First Workflow on Render | [Your First Workflow](https://render.com/docs/workflows-tutorial) |
| `task()`, retries, `index.ts` imports | [Defining Workflow Tasks](https://render.com/docs/workflows-defining) |
| `startTask`, `getTaskRun`, API key | [Triggering Task Runs](https://render.com/docs/workflows-running) |
| TypeScript SDK reference | [Workflows SDK for TypeScript](https://render.com/docs/workflows-sdk-typescript) |

> [!TIP]
> Optional code sample: [file-processing example](https://github.com/render-examples/render-workflows-examples-ts/tree/main/file-processing) (same `task()` + entry import pattern as Steps 6–7).

### Repositories

- **[`ojusave/workshop-demo`](https://github.com/ojusave/workshop-demo)** — read-only reference and shared demo (Steps 1–3). Clone to follow along in the editor.
- **[`ojusave/ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows)** — you implement Workflows here (Steps 4–10). Deploy from your fork or the branch the tutor names.

When you clone **ticker-research-workflows**, the starting tree should match **workshop-demo**: plain `export async function searchOne`, in-process `research()`. If your clone already has `task()` and Workflow polling, check out the branch the tutor provides (for example `workshop-start`).

```bash
# Reference only — run when Step 1 or Step 4 tells you to
git clone https://github.com/ojusave/workshop-demo.git
```

### Ready check

1. Student session joined; your name appears on the tutor dashboard.
2. **workshop-demo** loads in a browser tab.
3. Git and an editor are available.

**Continue when** all three are true, then open **Step 1**.
