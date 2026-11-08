import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { root } from "./lib.mjs";

export function assertDemoArtifact(directory) {
  if (!existsSync(resolve(directory, "index.html")))
    throw new Error("Build the demo first.");
  const walk = (folder) =>
    readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? walk(resolve(folder, entry.name))
        : [resolve(folder, entry.name)],
    );
  for (const file of walk(directory)) {
    if (/config\.json$|\.map$|\.env/.test(file))
      throw new Error("Configuration/source map found in demo artifact.");
    if (!/\.(js|json|html|css|svg|txt)$/.test(file)) continue;
    const content = readFileSync(file, "utf8");
    if (
      /https?:\/\/[^\s"'<>]*supabase\.(?:co|in)|sb_(?:publishable|secret)_[A-Za-z0-9_-]{16,}|eyJ[A-Za-z0-9_-]{20,}\./.test(
        content,
      )
    )
      throw new Error(
        "Backend configuration or credential found in demo artifact.",
      );
  }
  const stats = readFileSync(
    resolve(directory, "../browser-stats.json"),
    "utf8",
  );
  if (
    /node_modules\/(?:@supabase|supabase)\/|core\/app-data-access\.ts|(?:core|features)\/auth\/[^"\s]+\.(?:ts|html)/.test(
      stats,
    )
  )
    throw new Error(
      "Real backend adapter or SDK entered the demo dependency graph.",
    );
  if (!stats.includes("core/demo-data-access.ts"))
    throw new Error(
      "The explicit demo adapter is absent from the build graph.",
    );
  console.log(
    "Demo artifact: no backend config, credentials, real adapter, SDK or source maps.",
  );
}
if (import.meta.url === pathToFileURL(process.argv[1]).href)
  assertDemoArtifact(resolve(root, "dist/demo/browser"));
