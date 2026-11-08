import { test } from "node:test";
import assert from "node:assert/strict";
import { authorizeUser } from "../supabase/functions/_shared/authorize.ts";

const options = {
  supabaseUrl: "https://backend.example.invalid",
  publishableKey: "public-test-fixture",
  businessId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
  permission: "members.manage",
};
const request = () =>
  new Request("https://edge.example.invalid", {
    headers: { Authorization: "Bearer fixture.jwt.signature" },
  });
test("Edge boundary rejects missing user JWT and does not treat a public key as a user", async () => {
  for (const authorization of ["", "Bearer sb_publishable_test_fixture"])
    await assert.rejects(
      authorizeUser(
        new Request("https://edge.example.invalid", {
          headers: { authorization },
        }),
        options,
        () => {
          throw new Error("Network must not be reached");
        },
      ),
    );
});
test("Edge boundary verifies identity remotely, then checks current DB authorization with the same caller token", async () => {
  const calls = [];
  const result = await authorizeUser(request(), options, async (url, init) => {
    calls.push({ url: String(url), init });
    return calls.length === 1
      ? new Response(
          JSON.stringify({ id: "11111111-1111-4111-8111-000000000001" }),
        )
      : new Response("null");
  });
  assert.equal(result.userId, "11111111-1111-4111-8111-000000000001");
  assert.equal(
    calls[0].init.headers.Authorization,
    calls[1].init.headers.Authorization,
  );
  assert.equal(JSON.parse(calls[1].init.body).p_permission, "members.manage");
  assert.equal("actor_id" in JSON.parse(calls[1].init.body), false);
});
test("Edge boundary rejects invalid identity, revoked scope and malformed business context", async () => {
  await assert.rejects(
    authorizeUser(
      request(),
      options,
      async () => new Response("{}", { status: 401 }),
    ),
  );
  let call = 0;
  await assert.rejects(
    authorizeUser(request(), options, async () =>
      ++call === 1
        ? new Response(
            JSON.stringify({ id: "11111111-1111-4111-8111-000000000001" }),
          )
        : new Response("{}", { status: 403 }),
    ),
  );
  await assert.rejects(
    authorizeUser(request(), { ...options, businessId: "not-a-uuid" }, () => {
      throw new Error("Must reject before network");
    }),
  );
});
