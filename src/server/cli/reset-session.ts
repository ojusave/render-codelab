/**
 * Operator script: clears students and resets tutor pointer (local or Render shell).
 */
import { closeDb } from "../db/client.js";
import { loadStepsFromDisk } from "../lib/content.js";
import { resetSessionStudents } from "../services/workshop.js";

const code = process.env.SEED_SESSION_CODE?.trim() || "cascadia-2026";
const steps = loadStepsFromDisk();
const result = await resetSessionStudents(code, steps);

console.log(
  `Reset session "${code}": removed all students, tutor pointer → step ${result.tutorStepOrder} (${result.tutorStepTitle}).`,
);
await closeDb();
