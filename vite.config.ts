/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import netlify from "@netlify/vite-plugin";

export default defineConfig({
  plugins: [react(), netlify()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
