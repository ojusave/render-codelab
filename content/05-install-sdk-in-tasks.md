---
order: 5
title: "Install the Workflows SDK"
duration: 2
---

Add `@renderinc/sdk` to the **`tasks/`** package so you can [define tasks](https://render.com/docs/workflows-defining). No Render Workflow service is created in this step.

### What you'll do

1. Install `@renderinc/sdk` (^0.5.0) in `tasks/`.
2. Run `npm run build` to confirm the package still compiles.

### Install

From repo root:

```bash
cd tasks
npm install @renderinc/sdk@^0.5.0
```

Confirm `package.json` lists `@renderinc/sdk` under `dependencies` at `^0.5.0` or later ([Defining Workflow Tasks — install](https://render.com/docs/workflows-defining#first-install-the-render-sdk)).

### What you get

- **`task`** from `@renderinc/sdk/workflows` — registers a function the Workflow runner can execute ([`task()` reference](https://render.com/docs/workflows-sdk-typescript#the-task-function)).
- Later, **`Render`** from `@renderinc/sdk` on the **server** to [trigger runs](https://render.com/docs/workflows-running) with `startTask` and `getTaskRun`.

Do not add the SDK to `server/` until Step 8.

### Build check

```bash
npm run build
```

`tasks/tsconfig.json` uses `"rootDir": ".."`, so output lands under `tasks/dist/tasks/src/`. Build should pass before you change `search.ts`.

**Docs:** [Workflows SDK for TypeScript](https://render.com/docs/workflows-sdk-typescript)

**Continue when** `tasks/package.json` includes `@renderinc/sdk` and `npm run build` passes in `tasks/`.
