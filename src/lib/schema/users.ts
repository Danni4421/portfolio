import { pgTable as table, text, timestamp, serial } from "drizzle-orm/pg-core";

export const users = table("users", {
  id: serial("id").primaryKey().notNull(),
  userName: text("user_name").unique().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
