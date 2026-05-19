---
order: 8
title: "Create the Render Workflow service (tasks/)"
duration: 20
---

You only create this service **after** `searchOne` is wrapped and `tasks/src/index.ts` exists locally (Steps 6–7). Render will build the `tasks/` folder and run `npm run start`, which loads your registered task.

## Push your code first

Push **ticker-research-workflows** to GitHub (fork or org repo). The Workflow service will track the branch you choose.

## Dashboard

1. [Render Dashboard](https://dashboard.render.com/) → **New → Workflow**.
2. Connect **your** `ticker-research-workflows` repository.
3. **Root Directory:** `tasks` (folder name only).

| Field | Value |
|--------|--------|
| Root Directory | `tasks` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start` |

4. **Environment:** `EXA_API_KEY` (same key as workshop-demo uses for Exa).
5. Deploy. Wait until status is live.
6. Open **Tasks** — you should see **`searchOne`**.
7. Copy the service **slug** (URL segment, e.g. `ticker-research-workflows-abc1`). You need it for `WORKFLOW_SERVICE_SLUG` on the web service.

> [!WARNING]
> Do not put `cd tasks` in **Root Directory**. If your CLI cannot set `--root-dir tasks`, put `cd tasks &&` only on build/start commands, not in Root Directory.

> [!NOTE]
> **Image (add later):** New Workflow + root `tasks` — `content/images/08-dashboard-workflow-root.png`.

## Optional: test one task run

Dashboard → **Tasks** → `searchOne` → **Run**. Args are a JSON array of three values:

```json
["TSLA", { "query": "TSLA stock price share price quote March 2026" }, 0]
```

You may see failures and **retries** in the run log when `maybeFail` fires. That is expected.

## CLI (optional)

[Render CLI](https://render.com/docs/cli) 2.16+:

```bash
render workflows create \
  --name ticker-research-workflows \
  --repo https://github.com/YOUR_USER/ticker-research-workflows \
  --branch main \
  --runtime node \
  --root-dir tasks \
  --build-command "npm install && npm run build" \
  --run-command "npm run start" \
  --region oregon \
  --confirm
```

Docs: [Deploying Workflows](https://render.com/docs/workflows/deploying).

Mark this step done when **Tasks** lists `searchOne` and you have written down the workflow slug.
