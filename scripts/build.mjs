import { argumentsFor, basePath, root, runNode } from "./lib.mjs";
import { configureApp } from "./configure-app.mjs";
import "./sync-assets.mjs";

const [target, ...args] = process.argv.slice(2);
if (!["demo", "local", "staging", "production"].includes(target))
  throw new Error("Explicit build target required.");
const options = argumentsFor(args, ["--base-path"]);
const base = basePath(
  options["--base-path"] ??
    (target === "demo"
      ? process.env.DEMO_BASE_PATH
      : process.env.APP_BASE_PATH) ??
    "/",
);
if (target !== "demo") configureApp(target);
runNode(
  "node_modules/@angular/cli/bin/ng.js",
  ["build", "--configuration", target, "--base-href", base, "--stats-json"],
  { cwd: `${root}/frontend` },
);
