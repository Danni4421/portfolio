import {
  integer,
  pgTable as table,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const workExperienceTask = table("work_experience_task", {
  id: integer().primaryKey(),
  wo_id: integer(),
  task: text(),
  description: text(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
