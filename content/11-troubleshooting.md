---
order: 11
title: "Troubleshooting ticker-research-workflows"
duration: 10
---

Split logs: **Web Service** (Express, synthesis, `startTask`) vs **Workflow** (`tasks/`, Exa, retries).

## Tasks tab empty after Workflow deploy

- [`tasks/src/index.ts`](https://github.com/ojusave/ticker-research-workflows/blob/main/tasks/src/index.ts) must contain `import './search.js'`.
- `searchOne` exported via `task()` from `@renderinc/sdk/workflows`, not `export async function`.
- Start command: `node dist/tasks/src/index.js`.
- Redeploy **Workflow** after pushing `tasks/` changes.

## 401 / unauthorized from web to Workflows

- `RENDER_API_KEY` on the **web** service.
- Key and Workflow live in the same Render account/workspace.

## Task not found

- `WORKFLOW_SERVICE_SLUG` matches the Workflow service slug exactly.
- Path: `` `${slug}/searchOne` `` matches `name: 'searchOne'` in `task({ … })`.

## UI stuck ~50%, Dashboard shows completed

- Replace `started.get()` with **`getTaskRun` polling** (Step 9).
- Set `WORKFLOW_POLL_MS` if needed.

## Workflow build fails

- Root Directory = `tasks`.
- Do not use `cd tasks` as Root Directory.

## Every search fails

- `EXA_API_KEY` on **Workflow** service.
- Run `searchOne` once from Dashboard with valid JSON args (see Step 8).

## workshop-demo vs ticker-research-workflows

- **workshop-demo:** tutor URL, in-process `searchOne`, no Workflow.
- **ticker-research-workflows:** you deploy; searches via Workflow.

## References

- [Render Workflows](https://render.com/docs/workflows)
- [render-workflows-examples-ts / file-processing](https://github.com/render-examples/render-workflows-examples-ts/tree/main/file-processing)
- Solution-shaped `research.ts`: [main branch](https://github.com/ojusave/ticker-research-workflows/blob/main/tasks/src/research.ts)
