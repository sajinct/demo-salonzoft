import { test } from "node:test";
import assert from "node:assert/strict";
import { basePath, argumentsFor } from "./lib.mjs";
import { validateReleaseTarget } from "./release-target.mjs";

test("base paths support root and repository/custom subpaths without guessing identity", () => {
  for (const path of ["/", "/sample-repo/", "/products/miznora/"])
    assert.equal(basePath(path), path);
  for (const path of [
    "//evil/",
    "/a/../",
    "https://example.org/",
    "/a?b/",
    "/a#b/",
    "/a",
    "/%2e/",
  ])
    assert.throws(() => basePath(path));
});
test("script arguments reject unknown, repeated and incomplete targets", () => {
  assert.deepEqual(argumentsFor(["--base-path", "/"], ["--base-path"]), {
    "--base-path": "/",
  });
  for (const args of [
    ["--remote", "x"],
    ["--base-path"],
    ["--base-path", "/", "--base-path", "/a/"],
  ])
    assert.throws(() => argumentsFor(args, ["--base-path"]));
});
test("remote release requires explicit matching protected environment identity", () => {
  const ref = "a".repeat(20);
  assert.deepEqual(validateReleaseTarget("staging", ref, ref), {
    environment: "staging",
    projectRef: ref,
  });
  for (const args of [
    [undefined, ref, ref],
    ["demo", ref, ref],
    ["production", ref, undefined],
    ["staging", ref, "b".repeat(20)],
    ["staging", "https://example.org", ref],
  ])
    assert.throws(() => validateReleaseTarget(...args));
});
