import {
  pgTable as table,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = table("users", {
  id: integer().primaryKey(),
  userName: text("user_name").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text().unique().notNull(),
  password: text(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
