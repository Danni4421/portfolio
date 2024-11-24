import {
  integer,
  pgTable as table,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const workExperienceProject = table("work_experience_project", {
  id: integer().primaryKey().notNull(),
  wo_id: integer().notNull(),
  projectImages: text().array().notNull(),
  projectName: text().notNull(),
  description: text().notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
