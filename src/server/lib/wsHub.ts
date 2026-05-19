import type { WebSocket } from "ws";

type Role = "student" | "tutor";

type Client = { ws: WebSocket; role: Role };

const bySession = new Map<string, Set<Client>>();

export function registerClient(sessionCode: string, role: Role, ws: WebSocket): void {
  let set = bySession.get(sessionCode);
  if (!set) {
    set = new Set();
    bySession.set(sessionCode, set);
  }
  const entry: Client = { ws, role };
  set.add(entry);
  ws.on("close", () => {
    set!.delete(entry);
    if (set!.size === 0) {
      bySession.delete(sessionCode);
    }
  });
}

export function broadcastTutorPointer(
  sessionCode: string,
  payload: { tutorStepOrder: number; tutorStepTitle: string },
): void {
  const set = bySession.get(sessionCode);
  if (!set) return;
  const msg = JSON.stringify({ type: "tutor_pointer", ...payload });
  for (const c of set) {
    if (c.ws.readyState === 1) {
      c.ws.send(msg);
    }
  }
}

export function broadcastRoster(sessionCode: string, roster: unknown): void {
  const set = bySession.get(sessionCode);
  if (!set) return;
  const msg = JSON.stringify({ type: "roster", roster });
  for (const c of set) {
    if (c.role === "tutor" && c.ws.readyState === 1) {
      c.ws.send(msg);
    }
  }
}
