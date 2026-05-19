import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const workshopSessions = pgTable("workshop_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 128 }).notNull().unique(),
  tutorStepOrder: integer("tutor_step_order").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => workshopSessions.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  secretToken: uuid("secret_token").notNull().unique().defaultRandom(),
  /** Step orders the student has marked complete via "Done with this step". */
  completedStepOrders: jsonb("completed_step_orders").$type<number[]>().notNull().default([]),
  /** Step order the student is currently viewing in the nav. */
  currentViewStepOrder: integer("current_view_step_order").notNull(),
  stuck: boolean("stuck").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type WorkshopSessionRow = typeof workshopSessions.$inferSelect;
export type StudentRow = typeof students.$inferSelect;
