---
order: 7
title: "Add the Workflow entrypoint"
duration: 2
---

A **workflow service** loads every module that calls `task()` when it starts ([organizing tasks](https://render.com/docs/workflows-defining#organizing-tasks)). This step adds that entrypoint. You still do **not** create anything on Render until **Step 10**.

### What you'll do

1. Create `tasks/src/index.ts` that imports `./search.js`.
2. Add a `start` script in `tasks/package.json` (your Workflow **Start Command** on Render).
3. Optionally smoke-test `npm run start` locally.

### Create `tasks/src/index.ts`

```typescript
import './search.js'
```

The `.js` extension is required for Node ESM after `tsc`. Importing `search.ts` runs the `task({ name: 'searchOne', … })` registration side effect.

This matches the TypeScript pattern in [Defining Workflow Tasks — organizing tasks](https://render.com/docs/workflows-defining#organizing-tasks):

```typescript
import './math-tasks'
import './text-tasks'
```

We only have one task file for now.

### Add `start` in `tasks/package.json`

Under `"scripts"` (valid JSON, comma after `"build"`):

```json
"start": "node dist/tasks/src/index.js"
```

With `"rootDir": ".."`, compiled output is **`dist/tasks/src/index.js`**, not `dist/src/index.js`.

On Render, **Start Command** will be `npm run start` ([Your First Workflow](https://render.com/docs/workflows-tutorial#4-create-a-workflow-service)).

### Optional local smoke

```bash
cd tasks
npm run build
npm run start
```

Process should stay up. Ctrl+C to stop. Real task runs happen on Render in **Step 10** (or [test locally](https://render.com/docs/workflows-local-development) if the tutor has time).

### Commit

Commit `search.ts`, `index.ts`, `package.json`, and lockfile. Push before Steps 9–10.

**Continue when** `index.ts` exists and `npm run start` does not crash immediately after build.
