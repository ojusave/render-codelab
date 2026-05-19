import type { SessionBootstrap } from "../api";

function key(sessionCode: string): string {
  return `codelab_bootstrap_${sessionCode}`;
}

export function readBootstrapCache(sessionCode: string): SessionBootstrap | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(key(sessionCode));
    if (!raw) return undefined;
    return JSON.parse(raw) as SessionBootstrap;
  } catch {
    return undefined;
  }
}

export function writeBootstrapCache(sessionCode: string, data: SessionBootstrap): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key(sessionCode), JSON.stringify(data));
  } catch {
    /* quota */
  }
}
