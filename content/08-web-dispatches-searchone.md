---
order: 8
title: "Dispatch searchOne from the web service"
duration: 8
---

The **ticker-research-workflows** web service still runs [`research()`](https://github.com/ojusave/ticker-research-workflows/blob/main/tasks/src/research.ts), but each search will become a remote Workflow run once **Step 10** creates the Workflow service. Synthesis stays local.

This step is **code only**. The app will not complete a search until Step 10. You need a [Render API key](https://render.com/docs/api#1-create-an-api-key) for Step 9 when you deploy the web service.

## A. SDK on the server package

In [`server/package.json`](https://github.com/ojusave/ticker-research-workflows/blob/main/server/package.json):

```json
"@renderinc/sdk": "^0.5.1",
```

```bash
cd server && npm install
```

## B. Replace in `tasks/src/research.ts`

### Imports

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

### Polling helper (paste after the constants)

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

### Inside `searches.map` — replace the `searchOne` call only

**Was:**

```typescript
        const result = await searchOne(query, spec, index)
```

**Becomes:**

```typescript
        const started = await render.workflows.startTask(
          `${workflowSlug}/searchOne`,
          [query, spec, index],
        )
        const result = await waitForSearchTask(started.taskRunId)
```

Leave `onEvent`, `buildQueries`, `synthesize`, and the `Promise.all` structure unchanged.

## Why poll instead of `started.get()`

With **four** parallel `startTask` calls, waiting on the SDK’s SSE-based `.get()` can miss completion. The UI then sits near 50% while the Workflow Dashboard shows **completed**. Polling `getTaskRun` matches what we debugged in the workshop.

## C. Push

Commit and push. Deploy the web service in **Step 9**. Creating the Workflow on Render waits until **Step 10**.

Mark this step done when `research.ts` is pushed and `npm run build` at repo root succeeds.
