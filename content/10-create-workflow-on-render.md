---
order: 10
title: "Create the Workflow service"
duration: 5
---

**Last build step.** Create the Render **Workflow** that runs `tasks/`, set `WORKFLOW_SERVICE_SLUG` on the web service, then verify end-to-end. Follow [Your First Workflow — create a workflow service](https://render.com/docs/workflows-tutorial#4-create-a-workflow-service).

You should already have:

- `searchOne` in `task()` and `tasks/src/index.ts` (Steps 6–7).
- `research.ts` using `startTask` + `getTaskRun` (Step 8).
- Web service deployed (Step 9).

### What you'll do

1. Push latest **ticker-research-workflows** to GitHub.
2. Create a Workflow service with root directory `tasks`.
3. Set `WORKFLOW_SERVICE_SLUG` on the web service and redeploy.
4. Run `TSLA` and compare to **workshop-demo**.

### Push

Push **ticker-research-workflows** to GitHub. The Workflow builds from the `tasks/` directory.

### Create the Workflow

1. [Render Dashboard](https://dashboard.render.com/) → **New → Workflow** ([tutorial](https://render.com/docs/workflows-tutorial#4-create-a-workflow-service)).
2. Connect **your** `ticker-research-workflows` repository.
3. **Language:** Node (TypeScript).
4. **Root Directory:** `tasks` (folder name only, not `cd tasks`).

| Field | Value |
|--------|--------|
| Root Directory | `tasks` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start` |

5. **Environment:** `EXA_API_KEY` ([Exa dashboard](https://dashboard.exa.ai/)).
6. Click **Deploy Workflow**. Wait until live.
7. **Tasks** tab → confirm **`searchOne`** is registered ([viewing tasks](https://render.com/docs/workflows-tutorial#4-create-a-workflow-service)).
8. Copy the workflow service **slug** (for example `ticker-research-workflows`). This is the `{workflow-slug}` in `{workflow-slug}/searchOne`.

> [!WARNING]
> Do not put `cd tasks` in **Root Directory**. Use `tasks` as root, or put `cd tasks &&` only on build/start commands if the tutor uses that layout.

### Wire the web service

On your **Web Service** from Step 9:

1. Set **`WORKFLOW_SERVICE_SLUG`** to the slug you copied (exact match for `startTask`).
2. Confirm **`RENDER_API_KEY`** ([workflows-running](https://render.com/docs/workflows-running#2-set-your-api-key)) and **`ANTHROPIC_API_KEY`**.
3. **Redeploy** the web service.

### Verify

1. Open **your** web URL.
2. Query `TSLA`.
3. All four search cards reach **Done** (not stuck at 50%).
4. Workflow → **Runs** → `searchOne` shows retries when `maybeFail` fires.
5. Memo streams and completes.

Optional debug: [manually start `searchOne`](https://render.com/docs/workflows-running#running-manually) from the Dashboard with JSON args `[ "TSLA", { … }, 0 ]` before testing the full UI.

### Compare to workshop-demo

Run the same ticker on the **shared workshop-demo** tab and on your URL. Same `maybeFail` in the repo; [automatic retries](https://render.com/docs/workflows-defining#retry-logic) should make your deploy complete far more often.

> [!TIP]
> Optional: [Render CLI](https://render.com/docs/cli) 2.16+ with `render workflows create --root-dir tasks`.

**Continue when** one full research run succeeds on **your** web URL.
