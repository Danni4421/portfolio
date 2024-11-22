import { defineConfig as drizzle } from "drizzle-kit";

export default drizzle({
  dialect: "sqlite",
  schema: "./src/lib/schema",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
