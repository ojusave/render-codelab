import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** Repo root (two levels up from dist/server/lib or src/server/lib). */
export function getRepoRoot(): string {
  if (process.env.REPO_ROOT) {
    return path.resolve(process.env.REPO_ROOT);
  }
  // dist/server/lib -> ../../..
  // src/server/lib -> ../../..
  return path.resolve(here, "..", "..", "..");
}

export function getContentDir(): string {
  const override = process.env.CONTENT_DIR;
  if (override) return path.resolve(override);
  return path.join(getRepoRoot(), "content");
}
