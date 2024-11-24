import {
  integer,
  pgTable as table,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const DO = table("do", {
  id: integer().primaryKey().notNull(),
  icon: text().notNull(),
  title: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
