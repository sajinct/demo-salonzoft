import { readFileSync, readdirSync } from "node:fs";
import { resolve, relative } from "node:path";
import { root } from "./lib.mjs";

const excluded = new Set([
  ".git",
  ".cache",
  ".angular",
  "node_modules",
  "dist",
  "coverage",
  "test-results",
  "playwright-report",
  ".sites-runtime",
  ".temp",
  ".branches",
]);
let count = 0;
function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      scan(file);
      continue;
    }
    if (
      entry.name === ".env" ||
      (entry.name.startsWith(".env.") && entry.name !== ".env.example") ||
      relative(root, file).replaceAll("\\", "/") ===
        "frontend/public/app/config.json"
    )
      continue;
    if (!/\.(mjs|ts|json|html|scss|md|toml|yml|yaml|sql)$/.test(file)) continue;
    const content = readFileSync(file, "utf8");
    if (
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sb_secret_[A-Za-z0-9_-]{20,}|(?:ghp|github_pat)_[A-Za-z0-9_]{30,}|postgres(?:ql)?:\/\/[^\s:]+:[^\s@]+@(?!localhost|127\.0\.0\.1)/.test(
        content,
      )
    )
      throw new Error(
        `Possible committed secret in ${relative(root, file)} (value withheld).`,
      );
    count++;
  }
}
scan(root);
console.log(
  `Static secret check passed for ${count} source/config/document files. This is a pattern check, not a secret-history audit.`,
);
