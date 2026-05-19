---
order: 7
title: "Workflow entrypoint in tasks/"
duration: 10
---

The Workflow **runner** is a long-lived Node process. On start it must load every file that calls `task()`. This step adds that entrypoint. You still do **not** create anything on Render until **Step 10**.

## Create `tasks/src/index.ts`

New file:

```typescript
import './search.js'
```

The `.js` extension is required for Node ESM after `tsc`. Importing `search.ts` runs the `task({ name: 'searchOne', …})` registration side effect.

Compare to [file-processing `src/index.ts`](https://github.com/render-examples/render-workflows-examples-ts/blob/main/file-processing/src/index.ts): one import per task module.

## Add `start` in `tasks/package.json`

Under `"scripts"`, ensure JSON is valid (comma after `"build": "tsc"`):

```json
"start": "node dist/tasks/src/index.js"
```

Because `rootDir` is `".."` in `tasks/tsconfig.json`, compiled output is **`dist/tasks/src/index.js`**, not `dist/src/index.js`.

## Local smoke (optional)

```bash
cd tasks
npm run build
npm run start
```

The process should stay up (listening internally for the Workflow runtime). Ctrl+C to stop. Real execution happens on Render in **Step 10**.

## Commit

Commit `search.ts`, `index.ts`, `package.json`, and lockfile changes on your branch. Push before you deploy in Steps 9–10.

Mark this step done when `index.ts` exists and `npm run start` runs without an immediate crash after build.
