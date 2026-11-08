import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createEmbeddedDatabase } from "./embedded-db.mjs";
import { root } from "./lib.mjs";

const db = await createEmbeddedDatabase({ seed: true });
try {
  console.log(
    "Embedded PostgreSQL only: managed Auth/Storage schemas are compatibility fixtures; no HTTP services are tested.",
  );
  console.log((await db.query("select version()")).rows[0]);
  let assertions = 0;
  for (const file of readdirSync(resolve(root, "supabase/tests"))
    .filter((file) => file.endsWith(".sql"))
    .sort()) {
    const results = await db.exec(
      readFileSync(resolve(root, "supabase/tests", file), "utf8"),
    );
    let failed = false;
    for (const result of results)
      for (const row of result.rows)
        for (const value of Object.values(row)) {
          if (typeof value !== "string") continue;
          if (/^ok \d+/.test(value)) assertions++;
          if (/^not ok|^# Looks like/.test(value)) failed = true;
          if (/^(?:not )?ok \d+|^#|^1\.\./.test(value)) console.log(value);
        }
    if (failed) throw new Error(`Database assertion failure: ${file}`);
  }
  if (!assertions) throw new Error("No database assertions ran.");
  console.log(
    `Embedded PostgreSQL: ${assertions} assertions passed. Full Supabase integration remains a separate check.`,
  );
} finally {
  await db.close();
}
