import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  rmdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertDemoArtifact } from "./check-demo-artifact.mjs";

test("demo gate rejects configuration files, embedded keys and a real backend dependency", () => {
  const temporary = mkdtempSync(join(tmpdir(), "miznora-artifact-"));
  const directory = join(temporary, "browser");
  mkdirSync(directory);
  writeFileSync(join(directory, "index.html"), "<html></html>");
  writeFileSync(join(temporary, "browser-stats.json"), "{}");
  try {
    writeFileSync(join(directory, "config.json"), "{}");
    assert.throws(() => assertDemoArtifact(directory), /Configuration/);
    rmSync(join(directory, "config.json"));
    writeFileSync(
      join(directory, "main.js"),
      "sb_publishable_" + "synthetic_invalid_fixture_value",
    );
    assert.throws(() => assertDemoArtifact(directory), /credential/);
    writeFileSync(join(directory, "main.js"), "");
    writeFileSync(
      join(temporary, "browser-stats.json"),
      JSON.stringify({
        inputs: { "node_modules/@supabase/supabase-js/index.js": {} },
      }),
    );
    assert.throws(() => assertDemoArtifact(directory), /backend adapter/);
  } finally {
    // Only the named files created by this test are removed; no recursive deletion.
    for (const file of ["config.json", "main.js", "index.html"])
      rmSync(join(directory, file), { force: true });
    rmSync(join(temporary, "browser-stats.json"), { force: true });
    rmdirSync(directory);
    rmdirSync(temporary);
  }
});
