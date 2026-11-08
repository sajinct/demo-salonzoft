import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { argumentsFor, basePath, root } from "./lib.mjs";

const options = argumentsFor(process.argv.slice(2), [
  "--target",
  "--base-path",
  "--port",
]);
const target = options["--target"];
if (!["demo", "production", "staging"].includes(target))
  throw new Error("Preview target must be demo, staging or production.");
const base = basePath(options["--base-path"]);
const directory = resolve(root, "dist", target, "browser");
const port = Number(options["--port"] ?? 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("Invalid preview port.");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};
const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith(base)) {
      response.writeHead(404).end();
      return;
    }
    const suffix = pathname.slice(base.length) || "index.html";
    let file = resolve(directory, suffix);
    if (!file.startsWith(directory + sep)) {
      response.writeHead(404).end();
      return;
    }
    try {
      if (!statSync(file).isFile()) throw new Error("Not a file");
    } catch {
      if (target !== "demo" && !extname(suffix))
        file = resolve(directory, "index.html");
      else {
        response.writeHead(404).end();
        return;
      }
    }
    response.writeHead(200, {
      "Content-Type": `${mime[extname(file)] ?? "application/octet-stream"}; charset=utf-8`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : readFileSync(file));
  } catch {
    response.writeHead(400).end();
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Local: http://127.0.0.1:${port}${base}`);
  process.send?.("ready");
});
process.on("message", (message) => {
  if (message === "shutdown") {
    server.closeAllConnections();
    server.close(() => process.disconnect?.());
  }
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close());
