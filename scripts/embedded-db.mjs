import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { pgtap } from "@electric-sql/pglite-pgtap";
import { root } from "./lib.mjs";

export async function createEmbeddedDatabase({ seed = false } = {}) {
  const db = new PGlite({ extensions: { pgcrypto, pgtap } });
  await db.waitReady;
  await db.exec(
    readFileSync(resolve(root, "scripts/embedded-compat.sql"), "utf8"),
  );
  for (const name of readdirSync(resolve(root, "supabase/migrations"))
    .filter((name) => name.endsWith(".sql"))
    .sort()) {
    try {
      await db.exec(
        "begin;\n" +
          readFileSync(resolve(root, "supabase/migrations", name), "utf8") +
          "\ncommit;",
      );
    } catch (error) {
      await db.close();
      throw new Error(`Migration failed: ${name}`, { cause: error });
    }
  }
  if (seed)
    await db.exec(readFileSync(resolve(root, "supabase/seed.sql"), "utf8"));
  return db;
}
