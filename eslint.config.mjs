import js from "@eslint/js";
import ts from "typescript-eslint";
import angular from "angular-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["**/database.generated.ts", "frontend/public/**"] },
  {
    ...js.configs.recommended,
    files: ["scripts/**/*.mjs", "*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        URL: "readonly",
        Buffer: "readonly",
        fetch: "readonly",
        crypto: "readonly",
        Request: "readonly",
        Response: "readonly",
        AbortSignal: "readonly",
        setTimeout: "readonly",
      },
    },
  },
  ...ts.configs.recommended.map((config) => ({
    ...config,
    files: ["frontend/**/*.ts", "tests/**/*.ts", "supabase/functions/**/*.ts"],
  })),
  {
    files: ["frontend/**/*.ts"],
    extends: angular.configs.tsRecommended,
    processor: angular.processInlineTemplates,
  },
  {
    files: ["frontend/**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  },
]);
