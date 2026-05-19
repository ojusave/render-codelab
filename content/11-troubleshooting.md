---
order: 11
title: "Troubleshooting"
duration: 3
---

Split logs by service: **Web Service** (Express, synthesis, `startTask`) vs **Workflow** (`tasks/`, Exa, retries).

### Tasks tab empty after Workflow deploy

- [`tasks/src/index.ts`](https://github.com/ojusave/ticker-research-workflows/blob/main/tasks/src/index.ts) contains `import './search.js'` ([organizing tasks](https://render.com/docs/workflows-defining#organizing-tasks)).
- `searchOne` exported via `task()` from `@renderinc/sdk/workflows`, not `export async function`.
- Start command: `npm run start` → `node dist/tasks/src/index.js`.
- Redeploy **Workflow** after pushing `tasks/` changes.

### 401 / unauthorized from web to Workflows

- `RENDER_API_KEY` on the **web** service ([Set your API key](https://render.com/docs/workflows-running#2-set-your-api-key)).
- Key and Workflow in the same Render account/workspace.

### Task not found

- `WORKFLOW_SERVICE_SLUG` matches the workflow service slug exactly.
- `startTask` identifier is `{workflow-slug}/searchOne` ([task slug format](https://render.com/docs/workflows-running#3-initialize-the-client-and-trigger-a-run)).
- `name: 'searchOne'` in `task({ … })` matches the task name segment.

### UI stuck ~50%, Dashboard shows completed

- Use **`getTaskRun` polling**, not only `started.get()` (Step 8; [getTaskRun](https://render.com/docs/workflows-sdk-typescript#gettaskrun)).
- Alternative: [`taskRunEvents`](https://render.com/docs/workflows-sdk-typescript#taskrunevents) for multiple parallel runs.
- Tune `WORKFLOW_POLL_MS` if needed.

### Workflow build fails

- Root Directory = `tasks` ([tutorial](https://render.com/docs/workflows-tutorial#4-create-a-workflow-service)).
- Do not use `cd tasks` as Root Directory.

### Every search fails

- `EXA_API_KEY` on the **Workflow** service (task runs do not use web env vars).
- [Manually run `searchOne`](https://render.com/docs/workflows-running#running-manually) from the Dashboard with a valid JSON array.

### workshop-demo vs your app

- **workshop-demo:** tutor URL, in-process `searchOne`, no Workflow.
- **ticker-research-workflows:** you deploy; searches via Workflow + retries.

### Official references

| Doc | Use when |
|-----|----------|
| [Intro to Render Workflows](https://render.com/docs/workflows) | Concepts, execution flow, billing FAQ |
| [Your First Workflow](https://render.com/docs/workflows-tutorial) | Creating a Workflow service, manual test run |
| [Defining Workflow Tasks](https://render.com/docs/workflows-defining) | `task()`, retries, timeouts, organizing files |
| [Triggering Task Runs](https://render.com/docs/workflows-running) | API key, `startTask`, Dashboard/CLI runs |
| [Workflows SDK for TypeScript](https://render.com/docs/workflows-sdk-typescript) | `task()`, `Render`, `getTaskRun`, errors |

Also: [file-processing example](https://github.com/render-examples/render-workflows-examples-ts/tree/main/file-processing) · solution [`research.ts`](https://github.com/ojusave/ticker-research-workflows/blob/main/tasks/src/research.ts)
