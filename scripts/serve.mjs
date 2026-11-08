import { root, runNode } from "./lib.mjs";
import { configureApp } from "./configure-app.mjs";
import "./sync-assets.mjs";

const target = process.argv[2];
if (!["demo", "local"].includes(target))
  throw new Error("Serve supports demo or local only.");
if (target === "local") configureApp("local");
runNode(
  "node_modules/@angular/cli/bin/ng.js",
  ["serve", "--configuration", target, "--host", "127.0.0.1", "--port", "4200"],
  { cwd: `${root}/frontend` },
);
