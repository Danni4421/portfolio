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
  id: integer().primaryKey(),
  image: text(),
  title: text(),
  description: text(),
  type: achievementType(),
  dateAchieve: timestamp("date_achieve"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
