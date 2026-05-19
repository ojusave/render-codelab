# Codelab content contract

Markdown files in this folder drive the workshop steps. The **app shell** (navigation, layout, progress) only needs the frontmatter fields below. Everything in the body is rendered inside a scoped `.codelab-content` region so headings, tables, and images cannot restyle the site chrome.

## Required frontmatter

| Field | Type | Description |
|-------|------|-------------|
| `order` | number | Sort key for the step (must be unique across files) |
| `title` | string | Shown in the drawer and title bar (not required in the markdown body) |

## Optional frontmatter

| Field | Type | Description |
|-------|------|-------------|
| `duration` | number | Estimated minutes for one live block; shown in the drawer and title bar. All steps should sum to your slot (this workshop targets **45 minutes** for steps 0–11). |

Example:

```yaml
---
order: 3
title: Why v1 fails at scale
duration: 8
---
```

## Filename

Filenames are for authors only. Step order comes from `order`, not from the file name.

## Body content

- Standard Markdown (headings, lists, links, images, fenced code blocks).
- GitHub-style alerts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`) are converted to labeled `<aside>` blocks (`note`, `tip`, `important`, `warning`).
- The first `#` heading in the body is hidden in the UI (title comes from frontmatter).
- Raw HTML in markdown is escaped by the parser; do not rely on inline `<style>` or `<script>`.

### Authoring style (Google Codelab–like)

Each step should open with **one short paragraph** (what this step accomplishes), then:

1. **`### What you'll do`** — numbered actions only (3–5 items).
2. **Sections** — `###` headings for concepts; avoid `##` in the body (title bar already shows the step title).
3. **Callouts** — use `> [!TIP]` / `> [!IMPORTANT]` for one key insight; avoid long tables when bullets work.
4. **Close** — `**Continue when** …` (one line), not “Mark this step done when…”.

Do not leave `Image (add later)` placeholders in published steps. Add real assets under `content/images/` or omit.

### Official Render Workflows docs (link in workshop steps)

When editing Steps 5–11, prefer these canonical URLs (terminology should match):

- [Intro to Render Workflows](https://render.com/docs/workflows)
- [Your First Workflow](https://render.com/docs/workflows-tutorial)
- [Defining Workflow Tasks](https://render.com/docs/workflows-defining)
- [Triggering Task Runs](https://render.com/docs/workflows-running)
- [Workflows SDK for TypeScript](https://render.com/docs/workflows-sdk-typescript)

Use `{workflow-slug}/{task-name}` for task identifiers, `RENDER_API_KEY` on the triggering service, and distinguish **run chaining** (inside a workflow) from **cross-service** `startTask` (this workshop).

## What you can change safely

- Add, remove, or reorder steps (unique `order` values).
- Edit titles, duration, and body copy.
- Add images and code blocks of any length (wide tables scroll inside the card).

## What breaks the build

- Missing or duplicate `order` values (server throws on startup).
- Missing `title` (step is omitted from the manifest).

## Dev workflow

In development, saving a `.md` file clears the server cache and hot-reloads step HTML. Students may need to refresh if they are mid-step.
