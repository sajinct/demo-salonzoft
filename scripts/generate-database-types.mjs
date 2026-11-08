import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { createEmbeddedDatabase } from "./embedded-db.mjs";
import { root } from "./lib.mjs";
import { format, resolveConfig } from "prettier";

const check = process.argv.includes("--check");
const db = await createEmbeddedDatabase();
const quote = (name) => JSON.stringify(name);
function typeName(type) {
  if (type.endsWith("[]")) return `(${typeName(type.slice(0, -2))})[]`;
  if (["boolean"].includes(type)) return "boolean";
  if (
    ["integer", "smallint", "real", "double precision", "numeric"].includes(
      type,
    )
  )
    return "number";
  if (type === "json" || type === "jsonb") return "Json";
  if (type === "void") return "undefined";
  return "string";
}
try {
  const tables = (
    await db.query(
      `select c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' order by c.relname`,
    )
  ).rows;
  const output = [
    "// Generated from executed Phase 02 migrations using PostgreSQL/PGlite with managed-schema test fixtures.",
    "// Regenerate: npm run db:types:embedded. Full local Supabase generation remains npm run db:types.",
    "export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];",
    "export type Database = { public: { Tables: {",
  ];
  for (const { relname } of tables) {
    const columns = (
      await db.query(
        `select a.attname,format_type(a.atttypid,a.atttypmod) as type,a.attnotnull,(d.oid is not null) as has_default from pg_attribute a join pg_class c on c.oid=a.attrelid join pg_namespace n on n.oid=c.relnamespace left join pg_attrdef d on d.adrelid=c.oid and d.adnum=a.attnum where n.nspname='public' and c.relname=$1 and a.attnum>0 and not a.attisdropped order by a.attnum`,
        [relname],
      )
    ).rows;
    output.push(`${quote(relname)}: {`);
    for (const kind of ["Row", "Insert", "Update"]) {
      output.push(`${kind}: {`);
      for (const column of columns) {
        const optional =
          kind === "Update" ||
          (kind === "Insert" && (column.has_default || !column.attnotnull));
        output.push(
          `${quote(column.attname)}${optional ? "?" : ""}: ${typeName(column.type)}${column.attnotnull ? "" : " | null"};`,
        );
      }
      output.push("};");
    }
    const relations = (
      await db.query(
        `select con.conname,foreign_table.relname as foreign_table,exists(select 1 from pg_index ix where ix.indrelid=con.conrelid and ix.indisunique and ix.indpred is null and ix.indnkeyatts=cardinality(con.conkey) and ix.indkey::smallint[] @> con.conkey and con.conkey @> ix.indkey::smallint[]) as one_to_one,array(select a.attname from unnest(con.conkey) with ordinality k(num,ord) join pg_attribute a on a.attrelid=con.conrelid and a.attnum=k.num order by k.ord) as columns,array(select a.attname from unnest(con.confkey) with ordinality k(num,ord) join pg_attribute a on a.attrelid=con.confrelid and a.attnum=k.num order by k.ord) as foreign_columns from pg_constraint con join pg_class c on c.oid=con.conrelid join pg_namespace n on n.oid=c.relnamespace join pg_class foreign_table on foreign_table.oid=con.confrelid where con.contype='f' and n.nspname='public' and c.relname=$1 order by con.conname`,
        [relname],
      )
    ).rows;
    output.push("Relationships: [");
    for (const relation of relations)
      output.push(
        `{ foreignKeyName: ${quote(relation.conname)}; columns: ${JSON.stringify(relation.columns)}; isOneToOne: ${relation.one_to_one}; referencedRelation: ${quote(relation.foreign_table)}; referencedColumns: ${JSON.stringify(relation.foreign_columns)}; },`,
      );
    output.push("]; };");
  }
  output.push("}; Views: { [_ in never]: never }; Functions: {");
  const functions = (
    await db.query(
      `select p.proname,p.pronargdefaults,p.proretset,format_type(p.prorettype,null) as return_type,p.proargnames,coalesce(p.proargmodes,array_fill('i'::"char",array[p.pronargs])) as modes,array(select format_type(t,null) from unnest(coalesce(p.proallargtypes,p.proargtypes::oid[])) t) as types from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' order by p.proname`,
    )
  ).rows;
  for (const fn of functions) {
    const args = [];
    const results = [];
    for (let index = 0; index < fn.types.length; index++) {
      const entry = {
        name: fn.proargnames[index],
        type: typeName(fn.types[index]),
      };
      if (fn.modes[index] === "i") args.push(entry);
      else if (["o", "t", "b"].includes(fn.modes[index])) results.push(entry);
    }
    output.push(`${quote(fn.proname)}: { Args: {`);
    if (!args.length) output.push("[_ in never]: never;");
    for (let index = 0; index < args.length; index++)
      output.push(
        `${quote(args[index].name)}${index >= args.length - fn.pronargdefaults ? "?" : ""}: ${args[index].type};`,
      );
    output.push(
      "}; Returns: " +
        (results.length
          ? `{ ${results.map((item) => `${quote(item.name)}: ${item.type} | null`).join("; ")} }[]`
          : typeName(fn.return_type) + (fn.proretset ? "[]" : "")) +
        "; };",
    );
  }
  output.push(
    "}; Enums: { [_ in never]: never }; CompositeTypes: { [_ in never]: never }; }; };",
    "",
  );
  // Hash the canonical generated text; the check compares catalog structure independently of formatting.
  const destination = resolve(
    root,
    "frontend/src/app/core/api/database.types.ts",
  );
  const content = await format(output.join("\n"), {
    ...(await resolveConfig(destination)),
    filepath: destination,
    endOfLine: "lf",
  });
  const normalize = (value) =>
    value.replaceAll(/\s/g, "").replaceAll(";", "").replaceAll('"', "'");
  if (check) {
    if (normalize(readFileSync(destination, "utf8")) !== normalize(content))
      throw new Error(
        "Generated database types are stale. Run npm run db:types:embedded.",
      );
  } else {
    mkdirSync(resolve(root, "frontend/src/app/core/api"), { recursive: true });
    writeFileSync(destination, content);
  }
  console.log(
    `Executed-schema database types ${check ? "verified" : "generated"}: ${createHash("sha256").update(content).digest("hex").slice(0, 12)}.`,
  );
} finally {
  await db.close();
}
