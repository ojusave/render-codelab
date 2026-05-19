---
order: 1
title: "Open the shared demo"
duration: 3
---

The baseline app lives in [`ojusave/workshop-demo`](https://github.com/ojusave/workshop-demo). In the room you use a **shared deploy** on Render so nobody spends time on Exa and Anthropic keys before the lesson.

### What you'll do

1. Open the tutor's **workshop-demo** URL in your browser.
2. Clone the same repo locally for file navigation during Steps 2–3.

### Open the shared app

Your tutor shares a URL (slide or chat). That site is **workshop-demo**: one **Web Service**, no Workflow attached.

Leave the tab open. You will run queries here in Steps 2 and 3.

The header links (GitHub, Deploy to Render, Sign up) point at **workshop-demo**, not the repo you edit later.

### Clone locally

```bash
git clone https://github.com/ojusave/workshop-demo.git
cd workshop-demo
```

You do **not** need `npm run dev` unless the tutor asks. The clone is so you can jump to files when we name them.

**Layout:**

- **`ui/`** — Vite + React; `POST /api/research` and SSE.
- **`server/`** — Express; starts runs, streams events.
- **`tasks/`** — `research()`, `searchOne()`, `synthesize()`; compiled into `server` at build.
- **`shared/types.ts`** — `ResearchEvent` union the UI understands.
- **`render.yaml`** — Blueprint for the **web** service only.

Optional: `npm install` at repo root if you want the tree built locally.

> [!NOTE]
> You are **not** deploying your own copy, cloning **ticker-research-workflows**, or creating a Workflow service yet.

**Continue when** the shared demo loads and `workshop-demo` is on disk.
