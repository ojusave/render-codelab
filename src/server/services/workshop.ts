import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import * as schema from "../db/schema.js";
import type { StudentRow } from "../db/schema.js";
import type { LoadedStep } from "../lib/markdown.js";
import {
  clampOrderToManifest,
  nextOrderAfter,
  sortedOrders,
  titleForOrder,
} from "../lib/sessionLogic.js";

export type StudentStatus = "stuck" | "done_tutor_step" | "working";

export type RosterStudent = {
  id: string;
  name: string;
  currentViewStepOrder: number;
  stuck: boolean;
  completedStepOrders: number[];
  status: StudentStatus;
  statusLabel: string;
};

export function deriveStudentStatus(
  row: StudentRow,
  tutorStepOrder: number,
): { status: StudentStatus; statusLabel: string } {
  if (row.stuck) {
    return { status: "stuck", statusLabel: "Stuck" };
  }
  const done = new Set(row.completedStepOrders);
  if (done.has(tutorStepOrder)) {
    return { status: "done_tutor_step", statusLabel: "Caught up" };
  }
  return { status: "working", statusLabel: "Working" };
}

export async function findStudentBySessionToken(sessionCode: string, token: string) {
  const session = await getSessionByCode(sessionCode);
  if (!session) return null;
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.students)
    .where(
      and(eq(schema.students.sessionId, session.id), eq(schema.students.secretToken, token)),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function getSessionByCode(code: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.workshopSessions)
    .where(eq(schema.workshopSessions.code, code))
    .limit(1);
  return rows[0] ?? null;
}

export async function buildRoster(code: string, steps: LoadedStep[]): Promise<RosterStudent[] | null> {
  const session = await getSessionByCode(code);
  if (!session) return null;
  const db = getDb();
  const tutorOrder = clampOrderToManifest(steps, session.tutorStepOrder);
  const rows = await db
    .select()
    .from(schema.students)
    .where(eq(schema.students.sessionId, session.id));
  return rows.map((r) => {
    const { status, statusLabel } = deriveStudentStatus(r, tutorOrder);
    return {
      id: r.id,
      name: r.displayName,
      currentViewStepOrder: r.currentViewStepOrder,
      stuck: r.stuck,
      completedStepOrders: r.completedStepOrders,
      status,
      statusLabel,
    };
  });
}

export async function joinSession(code: string, displayName: string, steps: LoadedStep[]) {
  const session = await getSessionByCode(code);
  if (!session) throw new Error("SESSION_NOT_FOUND");
  const orders = sortedOrders(steps);
  const start = orders[0];
  if (start === undefined) throw new Error("NO_STEPS");
  const db = getDb();
  const trimmed = displayName.trim().slice(0, 120);
  if (!trimmed) throw new Error("NAME_REQUIRED");

  const inserted = await db
    .insert(schema.students)
    .values({
      sessionId: session.id,
      displayName: trimmed,
      secretToken: randomUUID(),
      completedStepOrders: [],
      currentViewStepOrder: start,
      stuck: false,
    })
    .returning();

  const row = inserted[0];
  if (!row) throw new Error("INSERT_FAILED");
  return row;
}

export async function updateStudentProgress(opts: {
  sessionCode: string;
  token: string;
  steps: LoadedStep[];
  currentViewStepOrder?: number;
  stuck?: boolean;
  markStepDone?: boolean;
}) {
  const session = await getSessionByCode(opts.sessionCode);
  if (!session) throw new Error("SESSION_NOT_FOUND");
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.students)
    .where(
      and(eq(schema.students.sessionId, session.id), eq(schema.students.secretToken, opts.token)),
    )
    .limit(1);
  const student = rows[0];
  if (!student) throw new Error("NOT_FOUND");

  let completed = [...student.completedStepOrders];
  let currentView = student.currentViewStepOrder;
  let stuck = student.stuck;

  if (opts.stuck !== undefined) {
    stuck = opts.stuck;
  }

  if (opts.currentViewStepOrder !== undefined) {
    currentView = clampOrderToManifest(opts.steps, opts.currentViewStepOrder);
  }

  if (opts.markStepDone) {
    const doneOrder = student.currentViewStepOrder;
    if (!completed.includes(doneOrder)) {
      completed.push(doneOrder);
      completed.sort((a, b) => a - b);
    }
    const next = nextOrderAfter(opts.steps, doneOrder);
    if (next !== null) {
      currentView = next;
    }
  }

  const updated = await db
    .update(schema.students)
    .set({
      completedStepOrders: completed,
      currentViewStepOrder: currentView,
      stuck,
      updatedAt: new Date(),
    })
    .where(eq(schema.students.id, student.id))
    .returning();

  return updated[0]!;
}

export async function setTutorPointer(
  code: string,
  steps: LoadedStep[],
  mode: { kind: "next" } | { kind: "prev" } | { kind: "jump"; stepOrder: number },
) {
  const session = await getSessionByCode(code);
  if (!session) throw new Error("SESSION_NOT_FOUND");
  let nextOrder = clampOrderToManifest(steps, session.tutorStepOrder);
  if (mode.kind === "next") {
    const n = nextOrderAfter(steps, nextOrder);
    if (n !== null) nextOrder = n;
  } else if (mode.kind === "prev") {
    const orders = sortedOrders(steps);
    const idx = orders.indexOf(nextOrder);
    if (idx > 0) nextOrder = orders[idx - 1]!;
  } else {
    nextOrder = clampOrderToManifest(steps, mode.stepOrder);
  }

  const db = getDb();
  await db
    .update(schema.workshopSessions)
    .set({ tutorStepOrder: nextOrder })
    .where(eq(schema.workshopSessions.id, session.id));

  return {
    tutorStepOrder: nextOrder,
    tutorStepTitle: titleForOrder(steps, nextOrder),
  };
}

export async function resetSessionStudents(code: string, steps: LoadedStep[]) {
  const session = await getSessionByCode(code);
  if (!session) throw new Error("SESSION_NOT_FOUND");
  const orders = sortedOrders(steps);
  const first = orders[0] ?? 1;
  const db = getDb();
  await db.delete(schema.students).where(eq(schema.students.sessionId, session.id));
  await db
    .update(schema.workshopSessions)
    .set({ tutorStepOrder: first })
    .where(eq(schema.workshopSessions.id, session.id));

  return { tutorStepOrder: first, tutorStepTitle: titleForOrder(steps, first) };
}
