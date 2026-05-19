import fs from "node:fs";
import path from "node:path";
import { getContentDir } from "./paths.js";
import { renderMarkdownFile, type LoadedStep } from "./markdown.js";

export type { LoadedStep } from "./markdown.js";

let cache: LoadedStep[] | null = null;

/** Markdown in content/ that is documentation, not a codelab step. */
const SKIP_MARKDOWN = new Set(["readme.md", "schema.md"]);

function isCodelabStepFile(name: string): boolean {
  if (!name.endsWith(".md")) return false;
  if (name.startsWith("_")) return false;
  if (SKIP_MARKDOWN.has(name.toLowerCase())) return false;
  // Step files use a numeric prefix: 01-intro.md, 10-deploy.md
  if (!/^\d{2,}-.+\.md$/i.test(name)) return false;
  return true;
}

export function loadStepsFromDisk(): LoadedStep[] {
  if (cache) return cache;
  const root = getContentDir();
  if (!fs.existsSync(root)) {
    throw new Error(`Content directory missing: ${root}`);
  }
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && isCodelabStepFile(e.name))
    .map((e) => path.join(root, e.name));
  const steps: LoadedStep[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { meta, html } = renderMarkdownFile(raw, { sourcePath: file, contentRoot: root });
    steps.push({
      ...meta,
      slug: path.basename(file, path.extname(file)),
      sourcePath: file,
      html,
    });
  }
  steps.sort((a, b) => a.order - b.order);

  const orders = steps.map((s) => s.order);
  const dupes = orders.filter((o, i) => orders.indexOf(o) !== i);
  if (dupes.length > 0) {
    throw new Error(`Duplicate step order(s) in content: ${[...new Set(dupes)].join(", ")}`);
  }

  cache = steps;
  return steps;
}

export function clearContentCache(): void {
  cache = null;
}

/** Returns cached steps; dev file watcher clears cache when markdown changes. */
export function getSteps(): LoadedStep[] {
  return loadStepsFromDisk();
}

/** Reload when content/*.md changes (dev only). */
export function watchContentInDev(): void {
  if (process.env.NODE_ENV === "production") return;

  const root = getContentDir();
  let debounce: ReturnType<typeof setTimeout> | null = null;

  fs.watch(root, (_event, filename) => {
    if (filename && !String(filename).endsWith(".md")) return;
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      clearContentCache();
      const steps = loadStepsFromDisk();
      console.log(`[content] reloaded ${steps.length} steps from ${root}`);
    }, 150);
  });
}
