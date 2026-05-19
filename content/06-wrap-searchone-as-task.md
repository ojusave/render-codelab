---
order: 6
title: "Register searchOne as a task"
duration: 6
---

Wrap **`searchOne`** in [`task()`](https://render.com/docs/workflows-sdk-typescript#the-task-function) in **ticker-research-workflows** only. Do not change `maybeFail`, `getExa`, or the Exa call body: the workshop keeps the same flaky search; [retry logic](https://render.com/docs/workflows-defining#retry-logic) on the Workflow absorbs most flakes.

### What you'll do

1. Import `task` from `@renderinc/sdk/workflows`.
2. Replace `export async function searchOne` with `export const searchOne = task({ … }, async function …)`.
3. Build and fix any TypeScript errors.

### Import

At the top of [`tasks/src/search.ts`](https://github.com/ojusave/ticker-research-workflows/blob/main/tasks/src/search.ts):

```typescript
import { task } from '@renderinc/sdk/workflows'
```

### Replace the export

**Find:**

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
| `name: 'searchOne'` | Becomes part of the task slug `{workflow-slug}/searchOne` used in `startTask` ([task arguments](https://render.com/docs/workflows-defining#task-arguments)) |
| `plan: 'starter'` | Light Exa call ([instance type](https://render.com/docs/workflows-defining#instance-type-compute-specs)) |
| `timeoutSeconds: 120` | Room for Exa latency ([timeout](https://render.com/docs/workflows-defining#timeout)) |
| `retry.maxRetries: 3` | Up to four attempts total when `maybeFail` throws ([customizing retries](https://render.com/docs/workflows-defining#customizing-retries)) |

Same shape as the SDK's `flipCoin` retry example in [Defining Workflow Tasks](https://render.com/docs/workflows-defining#customizing-retries).

### Close the `task()` call

At the **end** of the function, replace the final `}` for `searchOne` with:

```typescript
  },
)
```

You should see `export const searchOne = task( { … }, async function searchOne(…) { … }, )`.

### Build

```bash
cd tasks && npm run build
```

> [!NOTE]
> We are **not** [chaining](https://render.com/docs/workflows-defining#chaining-task-runs) `searchOne` from another task inside the Workflow. The web service will trigger runs in Step 8 ([running a task in a different workflow](https://render.com/docs/workflows-defining#chaining-task-runs)).

> [!NOTE]
> Do not create a Render Workflow service yet. That is **Step 10** ([Your First Workflow](https://render.com/docs/workflows-tutorial#4-create-a-workflow-service)).

**Continue when** `search.ts` compiles and `maybeFail` is unchanged.
