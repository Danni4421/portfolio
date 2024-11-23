import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

/**
 * Load environment variables from .env file
 *
 * Environment variables are loaded from a .env file in the root of the project.
 * This file is not committed to the repository.
 */
config({ path: ".env.production" });

/**
 * Define the configuration for the Drizzle Kit
 *
 * The configuration object is defined using the `defineConfig` function from the Drizzle Kit.
 * The configuration object is exported as the default export of this module.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/schema",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
