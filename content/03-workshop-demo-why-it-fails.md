---
order: 3
title: "See why runs fail"
duration: 4
---

The shared **workshop-demo** deploy fails on purpose. One rejected promise inside `Promise.all` ends the entire run.

### What you'll do

1. Run several queries on the tutor URL and watch failed vs aborted cards.
2. Read `maybeFail` in `tasks/src/search.ts`.
3. Connect that behavior to `Promise.all` in `research.ts`.

### Reproduce

Run **four or five** queries. You may see:

- One card error (fake “Exa rate limit”).
- Other cards **aborted** even if they were running.
- No synthesis phase.

### `maybeFail`

In your clone, open [`tasks/src/search.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/search.ts):

```typescript
function maybeFail(query: string) {
  if (Math.random() < 0.3) {
    throw new Error(`Exa rate limit hit on query: "${query}"`)
  }
}
```

`searchOne` calls this **before** the real Exa client. The message looks like infrastructure; it is not.

### Why one failure stops everything

In [`tasks/src/research.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/research.ts), the `map` callback does not catch errors. `Promise.all` rejects on the first rejection. `runner.ts` emits `{ type: 'failed', error }`; synthesis never runs.

Each search has ~70% chance to pass `maybeFail`. All four must pass: `0.7^4 ≈ 24%` completion under this toy model. Live results will jitter.

> [!IMPORTANT]
> The fix is not a bigger try/catch in the web process. On [Render Workflows](https://render.com/docs/workflows), each task run gets its own instance and [automatic retries](https://render.com/docs/workflows-defining#retry-logic) when the function throws (our `maybeFail` counts as a failure).

### What changes in your repo

| | workshop-demo | ticker-research-workflows (you) |
|--|---------------|----------------------------------|
| Deploy in room | Tutor URL only | You deploy at the end |
| `searchOne` | Plain async in web process | `task({ name: 'searchOne', retry… })` on Workflow |
| `research()` | `await searchOne(...)` in process | `startTask` + poll `getTaskRun` |
| Synthesis | Web service | Still web service |

We leave **workshop-demo** as the “before” picture.

**Continue when** you have read `maybeFail` and `Promise.all` and seen at least one failed run on the shared demo.
