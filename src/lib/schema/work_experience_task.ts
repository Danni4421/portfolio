import {
  integer,
  pgTable as table,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const workExperienceTask = table("work_experience_task", {
  id: integer().primaryKey().notNull(),
  wo_id: integer().notNull(),
  task: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
