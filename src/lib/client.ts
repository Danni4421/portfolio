import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle as neonClient } from "drizzle-orm/neon-http";
import { drizzle as pgClient } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/lib/schema";

/**
 * Load environment variables from .env file
 *
 * Environment variables are loaded from a .env file in the root of the project.
 * This file is not committed to the repository.
 */
const envFilePath =
  process.env.APP_ENV === "production" ? ".env.production" : ".env.development";
config({ path: envFilePath });

/**
 * Create a production database client
 *
 * @returns { NeonHttpDatabase }
 */
const createProductionClient = () => {
  const sql = neon(process.env.DATABASE_URL!);
  return neonClient(sql, { schema });
};

/**
 * Create a development database client
 *
 * @returns { PostgresJsDatabase }
 */
const createDevelopmentClient = () => {
  const sql = postgres(process.env.DATABASE_URL!);
  return pgClient(sql, { schema });
};

/**
 * Create a database client based on the current environment
 *
 * The database client is created based on the NODE_ENV environment variable.
 * If the NODE_ENV environment variable is set to "production", the client will
 * connect to the production database. Otherwise, the client will connect to the development database.
 */
const db =
  process.env.APP_ENV === "production"
    ? createProductionClient()
    : createDevelopmentClient();

export default db;
