import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { root } from "./lib.mjs";

export function syncAssets() {
  const directory = resolve(root, "frontend/public/brand");
  mkdirSync(directory, { recursive: true });
  for (const name of ["logo.svg", "logo-transparent.svg", "logo-horizontal.svg", "logo-horizontal-dark.svg", "logo-monochrome.svg", "brand-mark.svg", "wordmark.svg", "app-icon.svg", "app-icon-simplified.svg"])
    copyFileSync(resolve(root, name), resolve(directory, name));
}
syncAssets();
