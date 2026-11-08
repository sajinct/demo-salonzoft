import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { root, runNode, cliEnvironment } from "./lib.mjs";

const [command, ...flags] = process.argv.slice(2);
const allowed =
  command === "reset" ? ["--local", "--confirm-local-reset"] : ["--local"];
if (
  !["status", "start", "stop", "reset", "test", "types"].includes(command) ||
  flags.length !== allowed.length ||
  !allowed.every((flag) => flags.includes(flag))
)
  throw new Error(
    "Only explicit local commands are accepted. Reset also requires --confirm-local-reset. Remote flags are rejected.",
  );
if (
  command === "test" &&
  !readdirSync(resolve(root, "supabase/tests")).some((name) =>
    name.endsWith(".sql"),
  )
)
  throw new Error(
    "No database assertions exist yet. Phase 02 must add real security tests; no passing database check is claimed.",
  );
const commands = {
  status: ["status"],
  start: ["start"],
  stop: ["stop"],
  reset: ["db", "reset"],
  test: ["test", "db"],
  types: ["gen", "types", "typescript"],
};
// CLI v3 defaults these allowlisted commands to local. Never forward arbitrary flags.
const result = runNode(
  "node_modules/supabase/dist/supabase.js",
  [...commands[command], "--workdir", root],
  {
    env: cliEnvironment(),
    ...(command === "types"
      ? { stdio: ["ignore", "pipe", "inherit"], encoding: "utf8" }
      : {}),
  },
);
if (command === "types") {
  if (!result.stdout?.includes("export type"))
    throw new Error("No valid generated database types returned.");
  mkdirSync(resolve(root, "frontend/src/app/core/api"), { recursive: true });
  writeFileSync(
    resolve(root, "frontend/src/app/core/api/database.types.ts"),
    result.stdout,
  );
}
