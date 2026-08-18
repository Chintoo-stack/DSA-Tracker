import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./netlify/functions/_shared/schema.ts",
  out: "netlify/database/migrations",
});
