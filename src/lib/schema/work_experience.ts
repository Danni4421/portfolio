import {
  boolean,
  integer,
  pgTable as table,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const workExperience = table("work_experience", {
  id: integer().primaryKey().notNull(),
  logo: text(),
  title: text().notNull(),
  place: text().notNull(),
  isDone: boolean().notNull().default(false),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
