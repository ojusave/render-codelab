---
order: 2
title: "Trace one run through workshop-demo"
duration: 15
---

Pick a query on the **shared workshop-demo** URL, for example `TSLA`. This step maps what you see in the UI to concrete files in the repo you cloned.

## Browser → server

1. The UI posts to **`POST /api/research`** with JSON `{ "query": "TSLA" }` (see [`server/src/index.ts`](https://github.com/ojusave/workshop-demo/blob/main/server/src/index.ts)).
2. The handler calls [`startResearch(query)`](https://github.com/ojusave/workshop-demo/blob/main/server/src/runner.ts) in `server/src/runner.ts`.
3. `startResearch` generates a `runId`, stores listeners in memory, and calls **`research(query, onEvent)`** from [`tasks/src/research.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/research.ts). It does not await the full pipeline before responding.
4. The HTTP response is `{ "runId": "…" }`.
5. The UI opens **`GET /api/research/:runId/events`** as an `EventSource`. Each SSE message is one `ResearchEvent` JSON object.

If the connection drops or the run ends, the stream closes. The UI state machine lives in [`ui/src/App.tsx`](https://github.com/ojusave/workshop-demo/blob/main/ui/src/App.tsx).

> [!NOTE]
> **Image (add later):** four search cards + activity log mid-run — `content/images/02-workshop-demo-four-cards.png`.

## Inside `research()`

Open `tasks/src/research.ts` in your clone.

**Step A — plan four searches**

[`buildQueries(query)`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/queries.ts) returns four `SearchSpec` objects. For `TSLA` they look like:

| Index | Intent | Example query shape |
|-------|--------|---------------------|
| 0 | Price | `TSLA stock price share price quote …` + date window |
| 1 | News | `TSLA breaking news …` |
| 2 | Commentary | `TSLA analyst commentary …` |
| 3 | Risks | `TSLA risks outlook …` |

Dates come from [`tasks/src/dates.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/dates.ts) (`researchDates()`).

The first event is `{ type: 'started', query, queries: string[] }`. The UI uses `queries` to label the four cards.

**Step B — four parallel searches**

```typescript
const results = await Promise.all(
  searches.map(async (spec, index) => {
    onEvent({ type: 'search:running', index })
    const result = await searchOne(query, spec, index)
    onEvent({ type: 'search:done', index, articleCount: result.articles.length })
    return result
  }),
)
```

Each `searchOne` call is in [`tasks/src/search.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/search.ts). It uses **Exa** (`searchAndContents`, five results, up to 2000 chars text per hit). All four run in the **same Node process** as Express because workshop-demo is a single web service.

**Step C — sources list**

[`buildIndexedArticles`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/sources.ts) merges hits. The UI gets `{ type: 'sources', sources: SourceRef[] }`.

**Step D — synthesis**

[`synthesize()`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/synthesize.ts) streams Claude output. Events: `synthesizing`, many `synthesis:chunk`, then `{ type: 'done', memo }`.

## Exercise on the shared demo

1. Run `TSLA` (or `NVDA`).
2. While it runs, name which file would emit `search:running` for index `2`.
3. If all four cards go green, skim the memo. If not, still read the activity log: you will use failures in the next step.

Mark this step done when you can explain the path from the text box to `searchOne` without opening the repo.
