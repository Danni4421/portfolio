import {
  boolean,
  integer,
  pgTable as table,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const workExperience = table("work_experience", {
  id: integer().primaryKey(),
  logo: text(),
  title: text(),
  place: text(),
  isDone: boolean().default(false),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
