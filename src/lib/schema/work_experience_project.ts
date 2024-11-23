import {
  integer,
  pgTable as table,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const workExperienceProject = table("work_experience_project", {
  id: integer().primaryKey(),
  wo_id: integer(),
  projectImages: text().array(),
  projectName: text(),
  description: text(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
