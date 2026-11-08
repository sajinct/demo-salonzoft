import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { root } from "./lib.mjs";

export function configureApp(environment) {
  if (!["local", "staging", "production"].includes(environment))
    throw new Error("Explicit app environment required.");
  const supabaseUrl = process.env.MIZNORA_SUPABASE_URL ?? "";
  const supabasePublishableKey =
    process.env.MIZNORA_SUPABASE_PUBLISHABLE_KEY ?? "";
  if (Boolean(supabaseUrl) !== Boolean(supabasePublishableKey))
    throw new Error("Supply both public configuration variables or neither.");
  if (
    supabasePublishableKey &&
    !/^sb_publishable_[A-Za-z0-9_-]{16,}$/.test(supabasePublishableKey)
  )
    throw new Error("Only publishable keys are accepted.");
  if (supabaseUrl) {
    const url = new URL(supabaseUrl);
    const local =
      environment === "local" &&
      url.protocol === "http:" &&
      ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
    if (
      (url.protocol !== "https:" && !local) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      throw new Error("Invalid public backend URL.");
  }
  mkdirSync(resolve(root, "frontend/public/app"), { recursive: true });
  writeFileSync(
    resolve(root, "frontend/public/app/config.json"),
    JSON.stringify(
      {
        environment,
        supabaseUrl,
        supabasePublishableKey,
        allowSignup:
          environment !== "production" &&
          process.env.MIZNORA_ALLOW_SIGNUP === "true",
      },
      null,
      2,
    ) + "\n",
  );
  if (!supabaseUrl)
    console.log(
      `${environment}: no backend configuration supplied; the app will display its configuration error page.`,
    );
}
