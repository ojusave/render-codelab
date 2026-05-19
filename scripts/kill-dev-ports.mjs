#!/usr/bin/env node
/** Free ports used by local dev so Vite stays on 5173. */
import { execSync } from "node:child_process";

const ports = [5173, 5174, 8787];
for (const port of ports) {
  try {
    const pids = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
    if (!pids) continue;
    for (const pid of pids.split(/\s+/)) {
      if (pid) process.kill(Number(pid), "SIGTERM");
    }
  } catch {
    /* nothing listening */
  }
}
