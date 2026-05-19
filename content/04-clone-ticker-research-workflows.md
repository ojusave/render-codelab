---
order: 4
title: "Clone your workshop repo"
duration: 2
---

From here you work in [`ojusave/ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows). There is **no shared deploy** for this repo: you code locally, push to **your** fork, and deploy at the end.

### What you'll do

1. Clone **ticker-research-workflows** and open it in your editor.
2. Confirm the starting code still matches **workshop-demo** (no `task()` yet).

### Clone

```bash
git clone https://github.com/ojusave/ticker-research-workflows.git
cd ticker-research-workflows
```

Use the branch your tutor names (`main` or `workshop-start`). At the **starting** point:

- `tasks/src/search.ts` — `export async function searchOne`, not `task()`.
- `tasks/src/research.ts` — `import { searchOne }` and `await searchOne(...)` inside `Promise.all`.
- `tasks/package.json` — no `@renderinc/sdk`, no Workflow `start` script.
- `server/package.json` — no `@renderinc/sdk` yet.

If Workflow code is already present, reset to the tutor's starting branch.

### End state (preview)

```text
Browser
  → Web Service (Express + UI + synthesize)
       → startTask("{workflow-slug}/searchOne", [args]) ×4   (see Triggering Task Runs)
            → Workflow service (root: tasks/) — each run in its own instance
                 → Exa
```

This matches Render's model: a **web service** triggers runs; a **workflow service** registers and executes tasks ([Intro](https://render.com/docs/workflows#whats-in-a-workflow)). Task ids use the slug format `{workflow-slug}/{task-name}` ([Triggering Task Runs](https://render.com/docs/workflows-running#3-initialize-the-client-and-trigger-a-run)).

[`render.yaml`](https://github.com/ojusave/ticker-research-workflows/blob/main/render.yaml) defines the **web** service only. Blueprints do not create Workflows yet; you add the Workflow in **Step 10** ([Your First Workflow](https://render.com/docs/workflows-tutorial#4-create-a-workflow-service)).

> [!IMPORTANT]
> Do not create a Workflow service on Render until **Step 10**.

Keep the **workshop-demo** tab open for side-by-side runs at the end.

**Continue when** `ticker-research-workflows` is cloned and `tasks/src/search.ts` still matches workshop-demo's plain export.
