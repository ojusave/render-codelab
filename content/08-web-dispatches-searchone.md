---
order: 8
title: "Dispatch searchOne from the web"
duration: 8
---

The web service still runs [`research()`](https://github.com/ojusave/ticker-research-workflows/blob/main/tasks/src/research.ts), but each search becomes a remote Workflow run after **Step 10**. Synthesis stays on the web service.

This step follows [Triggering Task Runs](https://render.com/docs/workflows-running): initialize the SDK client, call `startTask`, then wait for completion. Code only: searches will not finish until Step 10 wires a live Workflow.

### What you'll do

1. Add `@renderinc/sdk` to `server/`.
2. Replace in-process `searchOne` with `startTask` + `getTaskRun` polling in `research.ts`.
3. Push so Step 9 can deploy the web service.

You need a [Render API key](https://render.com/docs/workflows-running#first-create-an-api-key) on the web service (`RENDER_API_KEY`; the SDK reads it automatically per [Triggering Task Runs](https://render.com/docs/workflows-running#2-set-your-api-key)).

### A. SDK on the server

In [`server/package.json`](https://github.com/ojusave/ticker-research-workflows/blob/main/server/package.json):

```json
"@renderinc/sdk": "^0.5.1",
```

```bash
cd server && npm install
```

Import `Render` from `@renderinc/sdk` (not `/workflows`). See [`Render` class](https://render.com/docs/workflows-sdk-typescript#the-render-class).

### B. Update `tasks/src/research.ts`

**Remove:**

```typescript
import { searchOne } from './search.js'
```

**Add:**

```typescript
import { Render } from '@renderinc/sdk'
import type { ResearchEvent, SearchResult } from '../../shared/types.js'

const workflowSlug = process.env.WORKFLOW_SERVICE_SLUG ?? 'ticker-research-workflows'
const pollMs = parseInt(process.env.WORKFLOW_POLL_MS ?? '1500', 10)
const render = new Render()
```

If `ResearchEvent` is already imported, merge into one line.

**Polling helper** (paste after the constants):

```typescript
async function waitForSearchTask(taskRunId: string): Promise<SearchResult> {
  while (true) {
    const details = await render.workflows.getTaskRun(taskRunId)
    if (details.status === 'completed') {
      const result = details.results?.[0] as SearchResult | undefined
      if (!result) throw new Error('searchOne returned no result')
      return result
    }
    if (details.status === 'failed' || details.status === 'canceled') {
      throw new Error(details.error ?? `searchOne ${details.status}`)
    }
    await new Promise((r) => setTimeout(r, pollMs))
  }
}
```

Uses [`getTaskRun`](https://render.com/docs/workflows-sdk-typescript#gettaskrun) until status is terminal (`completed`, `failed`, or `canceled`).

**Inside `searches.map`** — replace only the `searchOne` call:

```typescript
        const started = await render.workflows.startTask(
          `${workflowSlug}/searchOne`,
          [query, spec, index],
        )
        const result = await waitForSearchTask(started.taskRunId)
```

- **`taskIdentifier`:** `{workflow-slug}/{task-name}` — same format as the [Dashboard task slug](https://render.com/docs/workflows-running#3-initialize-the-client-and-trigger-a-run).
- **`inputData`:** positional JSON array matching `searchOne(query, spec, index)` ([task arguments](https://render.com/docs/workflows-defining#task-arguments)).
- **`started.taskRunId`:** available immediately from [`startTask`](https://render.com/docs/workflows-sdk-typescript#starttask).

Leave `onEvent`, `buildQueries`, `synthesize`, and the `Promise.all` structure unchanged (four parallel dispatches from the web process).

### Why poll instead of `started.get()`

The SDK docs show `await startedRun.get()` for a **single** run ([Triggering Task Runs](https://render.com/docs/workflows-running#typescript)). With **four** parallel `startTask` calls, `.get()` over SSE can miss completions; the UI may sit near 50% while the Dashboard shows **completed**.

For multiple concurrent runs you can also use [`taskRunEvents`](https://render.com/docs/workflows-sdk-typescript#taskrunevents). This workshop uses explicit **`getTaskRun` polling** for clarity.

### Push

Commit and push. Deploy the web service in **Step 9**. Create the Workflow in **Step 10**.

**Docs:** [Triggering Task Runs](https://render.com/docs/workflows-running) · [Workflows SDK for TypeScript](https://render.com/docs/workflows-sdk-typescript)

**Continue when** `research.ts` is pushed and `npm run build` at repo root succeeds.
