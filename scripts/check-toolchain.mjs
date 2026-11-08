import { readFileSync } from "node:fs";

const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
const expectedNode = manifest.engines.node;
const expectedNpm = manifest.packageManager.slice("npm@".length);
const npmVersion = /^npm\/([^ ]+)/.exec(
  process.env.npm_config_user_agent ?? "",
)?.[1];

if (process.versions.node !== expectedNode || npmVersion !== expectedNpm) {
  console.error(
    `Use Node ${expectedNode} and npm ${expectedNpm}. Detected Node ${process.versions.node}, npm ${npmVersion ?? "unknown"}.`,
  );
  process.exit(1);
}
console.log(`Toolchain verified: Node ${expectedNode}, npm ${expectedNpm}.`);
