import { sqliteTable as table, integer, text } from "drizzle-orm/sqlite-core";

export const users = table(
    "users", 
    {
        id: integer().primaryKey({ autoIncrement: true }),
        userName: text("user_name").unique(),
        firstName: text("first_name"),
        lastName: text("last_name"),
        email: text().unique().notNull(),
        password: text(),
    }
);
