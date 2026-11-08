import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const root = fileURLToPath(new URL("../", import.meta.url));
export function basePath(value = "/") {
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(value))
    throw new Error(
      "Base path must be / or /path/ (no origin, query, traversal or fragment).",
    );
  return value;
}
export function argumentsFor(args, allowed) {
  const values = {};
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    if (!allowed.includes(flag) || values[flag] !== undefined)
      throw new Error(`Unknown or repeated argument: ${flag}`);
    const value = args[++index];
    if (!value || value.startsWith("--"))
      throw new Error(`Value required: ${flag}`);
    values[flag] = value;
  }
  return values;
}
export function runNode(script, args = [], options = {}) {
  const result = spawnSync(process.execPath, [resolve(root, script), ...args], {
    cwd: root,
    stdio: "inherit",
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `Command failed (${result.status ?? result.signal}): ${script}`,
    );
  return result;
}
export function cliEnvironment() {
  return {
    ...process.env,
    SUPABASE_HOME: resolve(root, ".cache/supabase-cli"),
    SUPABASE_TELEMETRY_DISABLED: "1",
  };
}
