import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { argumentsFor, root, runNode, cliEnvironment } from "./lib.mjs";
import { validateReleaseTarget } from "./release-target.mjs";

const options = argumentsFor(process.argv.slice(2), [
  "--environment",
  "--project-ref",
]);
const target = validateReleaseTarget(
  options["--environment"],
  options["--project-ref"],
  process.env.SUPABASE_PROJECT_REF,
);
if (
  !readdirSync(resolve(root, "supabase/migrations")).some((name) =>
    name.endsWith(".sql"),
  )
)
  throw new Error(
    "No migrations yet: backend release planning begins after Phase 02 schema and tests.",
  );
if (!process.env.SUPABASE_ACCESS_TOKEN || !process.env.SUPABASE_DB_PASSWORD)
  throw new Error(
    "Protected environment requires SUPABASE_ACCESS_TOKEN and SUPABASE_DB_PASSWORD.",
  );
// Planning only: never applies migrations, seeds, vault values, functions or remote resets.
runNode(
  "node_modules/supabase/dist/supabase.js",
  [
    "db",
    "push",
    `--remote=${target.projectRef}`,
    "--dry-run",
    "--skip-vault",
    "--workdir",
    root,
  ],
  { env: cliEnvironment() },
);
