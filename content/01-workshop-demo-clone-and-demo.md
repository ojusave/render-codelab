---
order: 1
title: "Open workshop-demo and clone the repo"
duration: 10
---

The baseline app lives in **[`ojusave/workshop-demo`](https://github.com/ojusave/workshop-demo)** on GitHub. In the room you use a **shared deploy** of that repo so nobody burns time creating Exa and Anthropic keys before the lesson starts.

## Open the shared app

Your tutor will give you a URL (slide or chat). That site is **workshop-demo** on Render: one **Web Service**, no Workflow service attached.

Leave the tab open. You will run queries here in Steps 2 and 3.

The header still has Render DDS links (GitHub, Deploy to Render, Sign up). Those point at [`workshop-demo`](https://github.com/ojusave/workshop-demo), not at the repo you will edit later.

> [!NOTE]
> **Image (add later):** workshop-demo home with query box — `content/images/01-workshop-demo-home.png`.

## Clone the same repo locally

```bash
git clone https://github.com/ojusave/workshop-demo.git
cd workshop-demo
```

You do **not** need `npm run dev` during the workshop unless the tutor asks. The clone is so you can jump to files when we name them.

Monorepo layout (root `package.json` only orchestrates build):

| Path | Role |
|------|------|
| [`ui/`](https://github.com/ojusave/workshop-demo/tree/main/ui) | Vite + React. Calls `POST /api/research`, subscribes to SSE. |
| [`server/`](https://github.com/ojusave/workshop-demo/tree/main/server) | Express. Serves UI, starts runs, streams events. |
| [`tasks/`](https://github.com/ojusave/workshop-demo/tree/main/tasks) | `research()`, `searchOne()`, `synthesize()`, query builders. Compiled into `server` at build time. |
| [`shared/types.ts`](https://github.com/ojusave/workshop-demo/blob/main/shared/types.ts) | `ResearchEvent` union the UI understands. |
| [`render.yaml`](https://github.com/ojusave/workshop-demo/blob/main/render.yaml) | Blueprint for the **web** service only. |

Install once if you want local search in the tree: `npm install` at repo root (runs UI + tasks + server installs via the root `build` script).

## What you are not doing yet

- No deploy of your own copy of workshop-demo (optional homework).
- No clone of [`ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows) yet.
- No Render Workflow service.

Mark this step done when the shared demo loads and `workshop-demo` is on disk.
