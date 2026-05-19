---
order: 9
title: "Deploy the web service (before Workflow)"
duration: 4
---

Deploy the **web** half of **ticker-research-workflows** from repo root via [`render.yaml`](https://github.com/ojusave/ticker-research-workflows/blob/main/render.yaml). You do **not** create a Workflow service in this step.

After deploy, the UI loads and you can open the app, but **research runs will fail** until Step 10 connects a live Workflow and sets `WORKFLOW_SERVICE_SLUG`. That is expected.

## Web service environment

| Variable | Value |
|----------|--------|
| `RENDER_API_KEY` | [API key](https://dashboard.render.com/u/settings#api-keys) |
| `ANTHROPIC_API_KEY` | Claude synthesis (still on web) |
| `WORKFLOW_POLL_MS` | Optional; default `1500` |
| `WORKFLOW_SERVICE_SLUG` | Leave empty for now, or use a placeholder; set the real slug in **Step 10** |

Do **not** put `EXA_API_KEY` on the web service if all Exa calls will run on the Workflow (Step 10).

## Deploy

- **Blueprint:** connect your repo, apply `render.yaml`, set vars above.
- **Button:** [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ojusave/ticker-research-workflows)

Save your **web service URL**. You will use it in Step 10 after the Workflow exists.

> [!NOTE]
> A failed test query before Step 10 means the wiring is waiting on the Workflow service, not that your deploy is wrong.

Mark this step done when the web UI loads on Render and code from Steps 6–8 is pushed to GitHub.
