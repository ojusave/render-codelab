---
order: 9
title: "Deploy the web service"
duration: 4
---

Deploy the **web** half of **ticker-research-workflows** from [`render.yaml`](https://github.com/ojusave/ticker-research-workflows/blob/main/render.yaml). You do **not** create a Workflow service in this step.

After deploy, the UI loads, but **research runs fail** until Step 10 connects a Workflow and sets `WORKFLOW_SERVICE_SLUG`. That is expected.

### What you'll do

1. Set environment variables on the web service.
2. Deploy from your GitHub repo (Blueprint or Deploy button).
3. Save your web URL for Step 10.

### Environment variables

| Variable | Value |
|----------|--------|
| `RENDER_API_KEY` | [API key](https://render.com/docs/workflows-running#first-create-an-api-key) (SDK reads this env var) |
| `ANTHROPIC_API_KEY` | Claude synthesis (still on web) |
| `WORKFLOW_POLL_MS` | Optional; default `1500` |
| `WORKFLOW_SERVICE_SLUG` | Leave empty or placeholder; set the real slug in **Step 10** |

Do **not** put `EXA_API_KEY` on the web service if all Exa calls run on the Workflow (Step 10).

### Deploy

- **Blueprint:** connect your repo, apply `render.yaml`, set vars above.
- **Button:** [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ojusave/ticker-research-workflows)

Save your **web service URL**.

> [!NOTE]
> A failed test query before Step 10 means the app is waiting on the Workflow service, not that the deploy is wrong.

**Continue when** the web UI loads on Render and Steps 6–8 are pushed to GitHub.
