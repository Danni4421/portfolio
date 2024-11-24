import {
  integer,
  pgEnum,
  pgTable as table,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const achievementType = pgEnum("type", [
  "Awward",
  "Certificate",
  "Other",
]);

export const achievement = table("achievement", {
  id: integer().primaryKey().notNull(),
  icon: text(),
  file: text().notNull(),
  title: text().notNull(),
  description: text().notNull(),
  type: achievementType().notNull(),
  dateAchieve: timestamp("date_achieve").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
