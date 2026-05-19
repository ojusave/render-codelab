---
order: 2
title: "Trace one research run"
duration: 4
---

Run a query on the **shared workshop-demo** (for example `TSLA`) and map what you see in the UI to files in your clone.

### What you'll do

1. Submit a query on the shared URL.
2. Follow the request from browser → server → `research()` → four `searchOne` calls → synthesis.
3. Name which file emits `search:running` for a given card index.

### Browser → server

1. UI posts **`POST /api/research`** with `{ "query": "TSLA" }` ([`server/src/index.ts`](https://github.com/ojusave/workshop-demo/blob/main/server/src/index.ts)).
2. Handler calls [`startResearch(query)`](https://github.com/ojusave/workshop-demo/blob/main/server/src/runner.ts).
3. `startResearch` creates a `runId`, stores listeners, and calls **`research(query, onEvent)`** from [`tasks/src/research.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/research.ts) without awaiting the full pipeline.
4. HTTP response: `{ "runId": "…" }`.
5. UI opens **`GET /api/research/:runId/events`** as `EventSource`. Each message is one `ResearchEvent`.

UI state lives in [`ui/src/App.tsx`](https://github.com/ojusave/workshop-demo/blob/main/ui/src/App.tsx).

### Inside `research()`

Open `tasks/src/research.ts`.

**Plan four searches** — [`buildQueries(query)`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/queries.ts) returns four specs (price, news, commentary, risks). First event: `{ type: 'started', query, queries: string[] }`.

**Run four in parallel:**

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

Each [`searchOne`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/search.ts) calls **Exa** in the **same Node process** as Express (single web service).

**Sources** — [`buildIndexedArticles`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/sources.ts) → `{ type: 'sources', sources }`.

**Synthesis** — [`synthesize()`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/synthesize.ts) streams Claude: `synthesizing`, `synthesis:chunk`, then `{ type: 'done', memo }`.

### Quick check

While a run is in progress, which file would emit `search:running` for index `2`?

> [!TIP]
> Answer: the `map` callback in `research.ts` (before `await searchOne`).

**Continue when** you can explain the path from the text box to `searchOne` without opening the repo.
