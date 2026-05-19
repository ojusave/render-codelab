---
order: 0
title: "Prerequisites"
duration: 5
---

Read this before Step 1. You can mark it done once you have the accounts and tabs ready.

## In the room

| Item | Details |
|------|---------|
| **This codelab** | You are in a student session (URL from the tutor). Use your name so you show up on the tutor screen. |
| **workshop-demo** | Shared app URL from the tutor (not your deploy). Used in Steps 1–3 only. |
| **Editor** | VS Code, Cursor, or similar. Terminal for `git clone`. |
| **Git** | Clone [`ojusave/workshop-demo`](https://github.com/ojusave/workshop-demo) and later [`ojusave/ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows). |

You do **not** need a working local run of either repo during the workshop. Clones are for reading and editing files.

## Accounts you will need later

You do **not** need all of these before Step 1. Gather them before you deploy **your** app (Steps 9–10).

| Account | Used for |
|---------|----------|
| [GitHub](https://github.com/) | Clone repos; push **ticker-research-workflows** to your fork or the org repo the tutor specifies. |
| [Render](https://render.com/) | Workflow service (Step 8) and web deploy (Step 10). [Sign up](https://dashboard.render.com/register) if you do not have a workspace. |
| [Render API key](https://render.com/docs/api#1-create-an-api-key) | Web service calls `startTask` / `getTaskRun` (Step 9). |
| [Exa API key](https://dashboard.exa.ai/) | Workflow service runs Exa in `searchOne` (**Step 10**, last). |
| [Anthropic API key](https://console.anthropic.com/) | Web service runs Claude synthesis (Step 9). |

The tutor’s **workshop-demo** deploy already has Exa and Anthropic configured. You only enter those keys on **your** Render services.

## Repos (reference)

| Repo | Role in the workshop |
|------|----------------------|
| [`ojusave/workshop-demo`](https://github.com/ojusave/workshop-demo) | Baseline app; shared demo; clone to read code. |
| [`ojusave/ticker-research-workflows`](https://github.com/ojusave/ticker-research-workflows) | You implement Workflows here; deploy at the end. |

Starting branch for **ticker-research-workflows** should match **workshop-demo** (plain `searchOne`, no Workflow wiring). If your clone already has `task()` and `Render` in `research.ts`, check out the branch the tutor names (e.g. `workshop-start`).

## Optional reading

- [Intro to Render Workflows](https://render.com/docs/workflows) (skim; you will follow steps in order).
- [file-processing example](https://github.com/render-examples/render-workflows-examples-ts/tree/main/file-processing) (TypeScript task registration pattern).

## Checklist

- [ ] Codelab session joined (name entered).
- [ ] **workshop-demo** URL open in a browser tab.
- [ ] Git installed; ready to clone.
- [ ] Render + GitHub logins you can access when Steps 9–10 start.

Mark this step done when the checklist is satisfied.
