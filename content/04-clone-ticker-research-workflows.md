---
order: 4
title: "Clone ticker-research-workflows"
duration: 10
---

From here you work in **[`ojusave/ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows)**. There is **no shared deploy** for this repo in the room: you will write code locally, push to **your** GitHub fork (or the org repo if the tutor says so), and deploy **your** Workflow + web services at the end.

## Clone and open

```bash
git clone https://github.com/ojusave/ticker-research-workflows.git
cd ticker-research-workflows
```

Use the branch your tutor names (often `main` or `workshop-start`). At the **starting** point it should match **workshop-demo** behavior:

- [`tasks/src/search.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/search.ts): `export async function searchOne(` — not wrapped in `task()` yet.
- [`tasks/src/research.ts`](https://github.com/ojusave/workshop-demo/blob/main/tasks/src/research.ts): `import { searchOne } from './search.js'` and `await searchOne(...)` inside `Promise.all`.
- [`tasks/package.json`](https://github.com/ojusave/workshop-demo/blob/main/tasks/package.json): no `@renderinc/sdk`, no `"start"` script for a Workflow runner.
- [`server/package.json`](https://github.com/ojusave/workshop-demo/blob/main/server/package.json): no `@renderinc/sdk` on the server yet.

If your clone already contains Workflow code, compare to workshop-demo and reset to the tutor’s starting branch.

## Same monorepo shape

| Package | Same as workshop-demo? |
|---------|-------------------------|
| `ui/` | Yes — same SSE client |
| `server/` | Yes — same routes; you will add SDK + env later |
| `tasks/` | Same files; you will split **search** onto Workflows |
| `shared/types.ts` | Same `ResearchEvent` types |
| `render.yaml` | Web service Blueprint only — [see file](https://github.com/ojusave/ticker-research-workflows/blob/main/render.yaml) |

> [!IMPORTANT]
> [`render.yaml`](https://github.com/ojusave/ticker-research-workflows/blob/main/render.yaml) does **not** create a Workflow service. You create that on Render in **Step 10**, after all code is written and the web service is deployed.

## End state (what you are building toward)

```text
Browser
  → ticker-research-workflows Web Service (Express + UI + synthesize)
       → Render Workflows API: startTask("your-slug/searchOne", args)  ×4 parallel
            → Workflow service (root dir tasks/) runs searchOne with retries
                 → Exa API
```

Synthesis and SSE stay on the web service. Only the four Exa calls move.

Reference implementation style: Render’s [**file-processing**](https://github.com/render-examples/render-workflows-examples-ts/tree/main/file-processing) sample (`task()` + entry import), not a separate product tutorial.

> [!NOTE]
> **Image (add later):** two-box diagram web + workflow — `content/images/04-ticker-research-architecture.png`.

## Order of work (remaining steps)

1. Install SDK in `tasks/` and wrap `searchOne`.
2. Add Workflow entrypoint (`tasks/src/index.ts`, `npm run start`).
3. Change `research.ts` + server SDK so the web app dispatches tasks (code only).
4. Deploy **your** web service (searches will not work yet).
5. **Last:** create the Render Workflow service, set `WORKFLOW_SERVICE_SLUG`, verify against **workshop-demo**.

Keep the **workshop-demo** tab open for side-by-side runs at the end.

Mark this step done when `ticker-research-workflows` is cloned and `tasks/src/search.ts` still looks like workshop-demo’s version.
