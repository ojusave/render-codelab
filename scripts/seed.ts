/**
 * Creates a workshop session row if it does not exist.
 * Usage: DATABASE_URL=... tsx scripts/seed.ts
 * Optional: SEED_SESSION_CODE=cascadia-2026
 */
import { eq } from "drizzle-orm";
import { closeDb, getDb } from "../src/server/db/client.js";
import { workshopSessions } from "../src/server/db/schema.js";
import { loadStepsFromDisk } from "../src/server/lib/content.js";

const code = process.env.SEED_SESSION_CODE?.trim() || "cascadia-2026";

const steps = loadStepsFromDisk();
const firstOrder = steps[0]?.order ?? 1;

const db = getDb();
const existing = await db
  .select({ id: workshopSessions.id })
  .from(workshopSessions)
  .where(eq(workshopSessions.code, code))
  .limit(1);

if (existing.length > 0) {
  console.log(`Session "${code}" already exists.`);
  await closeDb();
  process.exit(0);
}

await db.insert(workshopSessions).values({
  code,
  tutorStepOrder: firstOrder,
});

console.log(`Created session "${code}" with tutor pointer on step order ${firstOrder}.`);

await closeDb();
