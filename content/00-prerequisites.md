---
order: 0
title: "Before you begin"
duration: 2
---

## Overview

In this workshop you will take a small ticker-research app from **fragile in-process parallelism** to **isolated Render Workflow tasks** with retries. The tutor runs a shared baseline on Render so everyone can see the same failure mode first. You will clone that code, change it in [`ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows), and deploy your own web service and Workflow at the end.

This page is setup only. Step 1 starts with the shared demo.

> [!NOTE]
> **Pace:** the sidebar times add up to about **45 minutes** of guided exercise. The tutor keeps the room moving; deploy steps (9–10) are tight. If Render builds lag, finish coding through Step 8 and let the tutor carry deploys on the projector.

### What you'll learn

- How the baseline app streams research progress over SSE.
- Why `Promise.all` plus a random failure in one search aborts the whole run.
- How to register a `searchOne` task with `@renderinc/sdk`, dispatch it from the web service, and poll for results.
- How to split **web** and **Workflow** services on Render and wire them with `WORKFLOW_SERVICE_SLUG`.

### What you'll need (in the room now)

- **This codelab:** you joined a student session (URL from the tutor) and entered a display name.
- **Browser tab** for the tutor's **workshop-demo** URL (shared deploy, not yours).
- **Git** and a terminal to clone repos.
- **Editor** such as VS Code or Cursor.

You do **not** need `npm run dev` working locally unless the tutor asks. Clones are for reading and editing files during the lesson.

### What you'll need (before you deploy)

Gather these before **Step 9** (deploy web) and **Step 10** (create Workflow). They are not required for Steps 1–8.

- [GitHub](https://github.com/) account to clone and push [`ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows).
- [Render](https://render.com/) account and workspace. [Create one](https://dashboard.render.com/register) if needed.
- [Render API key](https://render.com/docs/api#1-create-an-api-key) for `startTask` / `getTaskRun` on your web service.
- [Anthropic API key](https://console.anthropic.com/) for Claude synthesis on your **web** service.
- [Exa API key](https://dashboard.exa.ai/) on your **Workflow** service (Step 10), where `searchOne` runs.

The tutor's **workshop-demo** already has Exa and Anthropic configured. You only add those keys to **your** Render services.

> [!NOTE]
> Optional skim: [Intro to Render Workflows](https://render.com/docs/workflows) and the TypeScript [file-processing example](https://github.com/render-examples/render-workflows-examples-ts/tree/main/file-processing) for how `task()` registration looks.

## Repositories

| Repository | Your role |
|------------|-----------|
| [`ojusave/workshop-demo`](https://github.com/ojusave/workshop-demo) | Read-only reference and shared demo (Steps 1–3). Clone to follow along in the editor. |
| [`ojusave/ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows) | You implement Workflows here (Steps 4–10). Deploy from your fork or the branch the tutor names. |

When you clone **ticker-research-workflows**, the starting tree should match **workshop-demo**: plain `export async function searchOne`, in-process `research()`. If your clone already has `task()` and Workflow polling wired, check out the branch the tutor provides (for example `workshop-start`).

```bash
# Reference only — run when Step 1 or Step 4 tells you to
git clone https://github.com/ojusave/workshop-demo.git
```

## Ready check

1. Student session joined and your name appears on the tutor dashboard.
2. **workshop-demo** loads in a browser tab.
3. Git and an editor are available at your seat.

When those three are true, continue to **Step 1**.
