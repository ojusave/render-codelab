/**
 * Deletes all students for a session and resets the tutor pointer to step 1.
 * Usage: npm run db:reset
 * Optional: SEED_SESSION_CODE=cascadia-2026
 */
import { closeDb } from "../src/server/db/client.js";
import { loadStepsFromDisk } from "../src/server/lib/content.js";
import { resetSessionStudents } from "../src/server/services/workshop.js";

const code = process.env.SEED_SESSION_CODE?.trim() || "cascadia-2026";

const steps = loadStepsFromDisk();
const result = await resetSessionStudents(code, steps);

console.log(
  `Reset session "${code}": removed all students, tutor pointer → step ${result.tutorStepOrder} (${result.tutorStepTitle}).`,
);

await closeDb();
