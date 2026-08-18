import { boolean, integer, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  email: text("email"),
  name: text("name"),
  plan: varchar("plan", { length: 16 }).notNull().default("free"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  difficulty: varchar("difficulty", { length: 16 }).notNull(),
  topic: varchar("topic", { length: 64 }).notNull(),
  prompt: text("prompt").notNull(),
  starter: text("starter"),
  isPlus: boolean("is_plus").notNull().default(false),
});

export const solves = pgTable(
  "solves",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    questionId: integer("question_id").notNull(),
    solvedAt: timestamp("solved_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("solves_user_question").on(table.userId, table.questionId)],
);

export type Profile = typeof profiles.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Solve = typeof solves.$inferSelect;
