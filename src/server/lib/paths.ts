import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Repo root on disk. On Render, cwd is the service root (where content/ and drizzle/ live).
 */
export function getRepoRoot(): string {
  if (process.env.REPO_ROOT) {
    return path.resolve(process.env.REPO_ROOT);
  }
  if (process.env.NODE_ENV === "production") {
    return process.cwd();
  }
  // dist/server/lib or src/server/lib -> ../../../
  return path.resolve(here, "..", "..", "..");
}

export function getContentDir(): string {
  const override = process.env.CONTENT_DIR;
  if (override) return path.resolve(override);
  return path.join(getRepoRoot(), "content");
}
