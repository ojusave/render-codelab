import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { requireEnv } from "../config.js";
import { getRepoRoot } from "../lib/paths.js";

const url = requireEnv("DATABASE_URL");
const sql = postgres(url, { max: 1 });
const db = drizzle(sql);

const migrationsFolder = path.join(getRepoRoot(), "drizzle");
await migrate(db, { migrationsFolder });
await sql.end({ timeout: 5 });
console.log(`Migrations applied from ${migrationsFolder}`);
