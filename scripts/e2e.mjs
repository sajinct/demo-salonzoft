import { fork, spawn } from "node:child_process";
import { clearTimeout, setTimeout } from "node:timers";
import { resolve } from "node:path";
import { root } from "./lib.mjs";

const servers = [];
async function start(target, base, port) {
  const child = fork(
    resolve(root, "scripts/static-server.mjs"),
    ["--target", target, "--base-path", base, "--port", port],
    {
      cwd: root,
      windowsHide: true,
      stdio: ["ignore", "inherit", "inherit", "ipc"],
    },
  );
  servers.push(child);
  await new Promise((accept, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Static preview readiness timed out.")),
      10000,
    );
    child.once("error", reject);
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Static preview exited before readiness (${code}).`));
    });
    child.once("message", (message) => {
      if (message === "ready") {
        clearTimeout(timer);
        accept();
      }
    });
  });
}

try {
  await start("demo", "/phase-01-preview/", "4173");
  await start("production", "/app-preview/", "4174");
  await start("staging", "/auth-preview/", "4175");
  const child = spawn(
    process.execPath,
    [
      resolve(root, "node_modules/@playwright/test/cli.js"),
      "test",
      ...process.argv.slice(2),
    ],
    { cwd: root, stdio: "inherit", windowsHide: true },
  );
  process.exitCode = await new Promise((accept, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => accept(code ?? 1));
  });
} finally {
  await Promise.all(
    servers.map(
      (child) =>
        new Promise((accept) => {
          if (child.exitCode !== null || child.signalCode !== null) {
            accept();
            return;
          }
          // Direct child IPC avoids Windows process-tree discovery/taskkill permissions.
          const timer = setTimeout(() => child.kill(), 3000);
          child.once("exit", () => {
            clearTimeout(timer);
            accept();
          });
          if (child.connected) child.send("shutdown");
          else child.kill();
        }),
    ),
  );
}
