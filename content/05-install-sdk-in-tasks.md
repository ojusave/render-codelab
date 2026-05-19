---
order: 5
title: "Add @renderinc/sdk to tasks/"
duration: 8
---

All changes in this step stay in the **`tasks/`** package. You are not creating a Render service yet.

## Install

From repo root:

```bash
cd tasks
npm install @renderinc/sdk@^0.5.0
```

Confirm `package.json` lists `@renderinc/sdk` under `dependencies`.

Docs: [Workflows SDK](https://render.com/docs/workflows/sdk) · npm: [`@renderinc/sdk`](https://www.npmjs.com/package/@renderinc/sdk).

## What this package gives you

- **`task`** from `@renderinc/sdk/workflows` — registers a named function the Workflow runner can execute and retry.
- Later, the **web** package will use `Render` from `@renderinc/sdk` (not from `/workflows`) to call `startTask` and `getTaskRun`.

Do not add the SDK to `server/` until Step 9.

## Sanity check

```bash
npm run build
```

`tasks/tsconfig.json` compiles with `"rootDir": ".."`, so output lands under `tasks/dist/tasks/src/`. A clean build should still succeed before you change `search.ts`.

Mark this step done when `tasks/package.json` includes `@renderinc/sdk` and `npm run build` passes in `tasks/`.
