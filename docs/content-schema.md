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
- GitHub-style alerts (`> [!NOTE]`, `> [!WARNING]`, etc.) are converted to `<aside>` blocks.
- The first `#` heading in the body is hidden in the UI (title comes from frontmatter).
- Raw HTML in markdown is escaped by the parser; do not rely on inline `<style>` or `<script>`.

## What you can change safely

- Add, remove, or reorder steps (unique `order` values).
- Edit titles, duration, and body copy.
- Add images and code blocks of any length (wide tables scroll inside the card).

## What breaks the build

- Missing or duplicate `order` values (server throws on startup).
- Missing `title` (step is omitted from the manifest).

## Dev workflow

In development, saving a `.md` file clears the server cache and hot-reloads step HTML. Students may need to refresh if they are mid-step.
