---
order: 10
title: "Deploy ticker-research-workflows web and compare"
duration: 20
---

This is the first time **your** app gets a public URL. The Workflow service from Step 8 already runs `searchOne`; this step deploys the **web** half from repo root via [`render.yaml`](https://github.com/ojusave/ticker-research-workflows/blob/main/render.yaml).

## Web service environment

On the **Web Service** (not the Workflow):

| Variable | Value |
|----------|--------|
| `RENDER_API_KEY` | [API key](https://dashboard.render.com/u/settings#api-keys) for your account |
| `WORKFLOW_SERVICE_SLUG` | Slug from Step 8 (exact string) |
| `ANTHROPIC_API_KEY` | Claude synthesis |
| `WORKFLOW_POLL_MS` | Optional; default `1500` |

Remove **`EXA_API_KEY`** from the web service if all Exa traffic goes through the Workflow. Keep **`EXA_API_KEY`** on the Workflow service.

## Deploy web

- **Blueprint:** connect repo, apply `render.yaml`, set unsynced vars above.
- **Button:** [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ojusave/ticker-research-workflows) then set env vars in Dashboard.

Redeploy web after env changes. You do not need to redeploy Workflow unless `tasks/` changed again.

## Verify on your URL

1. Open **your** ticker-research-workflows web URL.
2. Query `TSLA`.
3. All four search cards should reach **Done** (not stuck at 50%).
4. Workflow → **Runs** → open `searchOne` runs; see retries when `maybeFail` throws.
5. Memo streams and finishes.

## Compare to workshop-demo

| | Shared workshop-demo | Your ticker-research-workflows |
|--|----------------------|--------------------------------|
| URL | Tutor-provided | Your deploy |
| Search execution | In web process | Workflow task + retries |
| Expected completion rate | Low (~24% all pass `maybeFail`) | Much higher with 3 retries per search |

Run the same ticker on both tabs.

> [!NOTE]
> **Image (add later):** your app four green cards + memo — `content/images/10-ticker-research-success.png`.

Mark this step done when one full run succeeds on **your** web URL.
