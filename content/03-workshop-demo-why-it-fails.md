---
order: 3
title: "Why workshop-demo usually fails"
duration: 12
---

The shared **workshop-demo** deploy is configured to fail often on purpose. The goal is to see how **one throwing promise** inside `Promise.all` ends the whole run.

## Reproduce on the shared demo

Run **four or five** queries on the tutor URL. Watch for:

- One or more cards showing an error (fake “Exa rate limit”).
- Other cards flipping to **aborted** even if they were running.
- No synthesis phase.

> [!NOTE]
> **Image (add later):** one failed card, others aborted — `content/images/03-workshop-demo-failure.png`.

## The fake failure: `maybeFail`

In your clone, open [`tasks/src/search.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/search.ts).

```typescript
function maybeFail(query: string) {
  if (Math.random() < 0.3) {
    throw new Error(`Exa rate limit hit on query: "${query}"`)
  }
}
```

`searchOne` calls `maybeFail(spec.query)` **before** the real Exa client runs. The message looks like infrastructure; it is not. Exa may be fine.

## Why one failure stops everything

Back in [`tasks/src/research.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/research.ts), the `map` callback does not catch errors from `searchOne`. `Promise.all` rejects on the first rejection. The outer `research()` promise rejects, `runner.ts` emits `{ type: 'failed', error }`, and the UI never reaches synthesis.

Independence of searches: each has a 70% chance to “succeed” through `maybeFail`. All four must pass: `0.7^4 ≈ 0.24`. So roughly **one run in four** completes under this toy model. Your live results will jitter because the randomness is real.

## What we are not changing in workshop-demo

We leave workshop-demo as the **before** picture. The fix is not “bigger try/catch in the web process.” The fix is to run each search as an isolated unit with **its own retry budget** on Render Workflows, orchestrated from a second repo.

## Bridge to the next repo

| | workshop-demo | ticker-research-workflows (you build this) |
|--|---------------|---------------------------------------------|
| Deploy in room | Tutor URL only | **You** deploy at the end |
| `searchOne` | Plain async function in web process | `task({ name: 'searchOne', retry… })` on a Workflow service |
| `research()` | `await searchOne(...)` in process | `startTask` + poll `getTaskRun` |
| Synthesis | Web service | Still web service |

Mark this step done when you have read `maybeFail` and `Promise.all` and seen at least one failed run on the shared demo.
