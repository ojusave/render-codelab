---
order: 10
title: "Create the Workflow on Render (last)"
duration: 5
---

This is the **last build step**. You create the Render **Workflow** service that runs `tasks/`, copy its slug onto the web service, then run end-to-end.

You should already have:

- `searchOne` wrapped in `task()` and `tasks/src/index.ts` importing `./search.js` (Steps 6–7).
- `research.ts` calling `startTask` + `getTaskRun` (Step 8).
- Web service deployed (Step 9).

## Push your latest code

Push **ticker-research-workflows** to GitHub. The Workflow service builds from the `tasks/` directory on that repo.

## Create the Workflow service

1. [Render Dashboard](https://dashboard.render.com/) → **New → Workflow**.
2. Connect **your** `ticker-research-workflows` repository.
3. **Root Directory:** `tasks` (folder name only).

| Field | Value |
|--------|--------|
| Root Directory | `tasks` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start` |

4. **Environment:** `EXA_API_KEY` ([Exa dashboard](https://dashboard.exa.ai/)).
5. Deploy. Wait until live.
6. **Tasks** tab → confirm **`searchOne`**.
7. Copy the service **slug** (e.g. `ticker-research-workflows`).

> [!WARNING]
> Do not put `cd tasks` in **Root Directory**. Use `tasks` as root, or put `cd tasks &&` only on build/start commands.

> [!NOTE]
> **Image (add later):** Dashboard Workflow + root `tasks` — `content/images/10-dashboard-workflow-root.png`.

## Wire the web service to this Workflow

On your **Web Service** from Step 9:

1. Set **`WORKFLOW_SERVICE_SLUG`** to the slug you copied (exact match).
2. Confirm **`RENDER_API_KEY`** and **`ANTHROPIC_API_KEY`** are set.
3. **Redeploy** the web service (env-only change is enough).

## Verify end-to-end

1. Open **your** web URL.
2. Query `TSLA`.
3. All four search cards reach **Done** (not stuck at 50%).
4. Workflow → **Runs** → `searchOne` shows retries when `maybeFail` fires.
5. Memo streams and completes.

## Compare to workshop-demo

Run the same ticker on the **shared workshop-demo** tab and on your URL. Same flaky `maybeFail` in the repo; Workflow retries should make your deploy complete far more often.

| | workshop-demo (tutor URL) | Your ticker-research-workflows |
|--|---------------------------|--------------------------------|
| Searches | In the web process | Workflow task + retries |
| Deploy | Tutor only | You (web + Workflow) |

> [!NOTE]
> **Image (add later):** four green cards + memo — `content/images/10-ticker-research-success.png`.

## Optional: CLI

[Render CLI](https://render.com/docs/cli) 2.16+: `render workflows create` with `--root-dir tasks`. See [Deploying Workflows](https://render.com/docs/workflows/deploying).

Mark this step done when one full research run succeeds on **your** web URL.
