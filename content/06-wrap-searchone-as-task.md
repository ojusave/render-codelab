---
order: 6
title: "Wrap searchOne in task()"
duration: 6
---

Edit **only** [`tasks/src/search.ts`](https://github.com/ojusave/ticker-research-workflows/blob/main/tasks/src/search.ts) in **ticker-research-workflows**. Do not touch `maybeFail`, `getExa`, or the Exa `searchAndContents` body. The workshop keeps the same flaky search; Workflows adds retries around it.

## 1. Import `task`

At the top:

```typescript
import { task } from '@renderinc/sdk/workflows'
```

## 2. Change the export

**Find** (workshop-demo shape):

```typescript
export async function searchOne(
```

**Replace with:**

```typescript
export const searchOne = task(
  {
    name: 'searchOne',
    plan: 'starter',
    timeoutSeconds: 120,
    retry: { maxRetries: 3, waitDurationMs: 1000, backoffScaling: 1.5 },
  },
  async function searchOne(
```

| Field | Why |
|-------|-----|
| `name: 'searchOne'` | Becomes the task id in the Dashboard and in `startTask('slug/searchOne', …)` |
| `plan: 'starter'` | Matches a light Exa call; adjust if your tutor uses a different plan |
| `timeoutSeconds: 120` | Room for Exa latency |
| `retry.maxRetries: 3` | `maybeFail` is 30% per attempt; retries absorb most flakes |

Same pattern as [`file-processing` tasks](https://github.com/render-examples/render-workflows-examples-ts/tree/main/file-processing/src).

## 3. Close the `task()` call

At the **end** of the function, the file currently ends with a single `}` for `searchOne`. **Replace that closing brace** with:

```typescript
  },
)
```

You should see `export const searchOne = task( { … }, async function searchOne(…) { … }, )`.

## 4. Build locally

```bash
cd tasks && npm run build
```

Fix TypeScript errors before moving on. Do **not** create a Render Workflow service yet; that is **Step 10** (last).

> [!NOTE]
> **Image (add later):** diff highlighting export line — `content/images/06-searchone-task-wrap.png`.

Mark this step done when `search.ts` compiles and still contains `maybeFail` unchanged.
