import {
  boolean,
  integer,
  pgTable as table,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const project = table("project", {
  id: integer().primaryKey().notNull(),
  name: text().notNull(),
  description: text().notNull(),
  files: text().array().notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isDone: boolean().default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
