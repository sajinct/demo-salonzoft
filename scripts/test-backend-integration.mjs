// Explicitly local, real Supabase HTTP acceptance. Never substitutes an embedded DB.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { root } from "./lib.mjs";

const urlValue = process.env.MIZNORA_TEST_SUPABASE_URL;
const key = process.env.MIZNORA_TEST_SUPABASE_PUBLISHABLE_KEY;
if (!urlValue || !key)
  throw new Error(
    "Real local Supabase HTTP tests require an operational stack, MIZNORA_TEST_SUPABASE_URL and MIZNORA_TEST_SUPABASE_PUBLISHABLE_KEY. Run db:start and db:reset first.",
  );
const origin = new URL(urlValue);
if (
  !["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname) ||
  origin.username ||
  origin.password ||
  origin.pathname !== "/" ||
  origin.search ||
  origin.hash ||
  !["http:", "https:"].includes(origin.protocol)
)
  throw new Error(
    "Backend integration tests accept only an explicit loopback Supabase origin.",
  );
if (!/^sb_publishable_[A-Za-z0-9_-]{16,}$/.test(key))
  throw new Error(
    "Supply the actual local publishable key, never an elevated key.",
  );
const fixture = JSON.parse(
  readFileSync(resolve(root, "supabase/seeds/fixture-manifest.json"), "utf8"),
);
const sessions = {};
let checks = 0;
async function request(
  path,
  { token, method = "GET", body, headers = {} } = {},
) {
  return fetch(new URL(path, origin), {
    method,
    headers: {
      apikey: key,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  });
}
async function rpc(name, body, user) {
  return request(`/rest/v1/rpc/${name}`, {
    method: "POST",
    body,
    token: sessions[user],
  });
}
function passed(description) {
  checks++;
  console.log(`ok ${checks} - ${description}`);
}
for (const [name, user] of Object.entries(fixture.users)) {
  if (name === "unverified") continue;
  const response = await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email: user.email, password: fixture.password },
  });
  assert.equal(
    response.ok,
    true,
    `Local synthetic login failed for ${name}; reset fixtures before this suite.`,
  );
  const data = await response.json();
  assert.equal(typeof data.access_token, "string");
  sessions[name] = data.access_token;
}
const context = await rpc("get_workspace_context", {}, "invitee");
assert.equal(context.ok, true);
assert.equal(
  (await context.json()).length,
  0,
  "Reset local fixtures before rerunning this mutating suite.",
);
for (const [path, method, body] of [
  ["/rest/v1/businesses", "GET"],
  [
    "/rest/v1/rpc/bootstrap_business",
    "POST",
    {
      p_request_id: crypto.randomUUID(),
      p_business_name: "Unauthorized",
      p_location_name: "Muscat",
    },
  ],
]) {
  assert.equal((await request(path, { method, body })).ok, false);
  passed("publishable key without a session denied");
}
for (const [user, business] of [
  ["ownerA", fixture.businessA],
  ["ownerB", fixture.businessB],
]) {
  const response = await request("/rest/v1/businesses?select=id", {
    token: sessions[user],
  });
  const rows = await response.json();
  assert.equal(
    Array.isArray(rows) && rows.length === 1 && rows[0].id === business,
    true,
  );
  passed(`${user} REST SELECT is tenant isolated`);
}
assert.equal(
  (
    await request("/rest/v1/businesses?select=id", {
      token: sessions.nonMember,
    })
  ).ok,
  true,
);
assert.equal(
  (
    await (
      await request("/rest/v1/businesses?select=id", {
        token: sessions.nonMember,
      })
    ).json()
  ).length,
  0,
);
passed("non-member REST reads reveal no tenant records");
for (const [method, path, body] of [
  [
    "POST",
    "/rest/v1/business_members",
    {
      business_id: fixture.businessA,
      user_id: fixture.users.nonMember.id,
      role_code: "owner",
      scope_mode: "all_locations",
    },
  ],
  [
    "PATCH",
    `/rest/v1/business_members?business_id=eq.${fixture.businessA}`,
    { role_code: "owner" },
  ],
  ["DELETE", `/rest/v1/business_members?business_id=eq.${fixture.businessA}`],
  [
    "PATCH",
    `/rest/v1/locations?id=eq.${fixture.locationA1}`,
    { business_id: fixture.businessB },
  ],
  [
    "POST",
    "/rest/v1/audit_events",
    {
      business_id: fixture.businessA,
      actor_user_id: fixture.users.ownerB.id,
      action: "spoof",
      object_id: fixture.businessA,
    },
  ],
  ["PATCH", "/rest/v1/audit_events", { action: "rewritten" }],
  ["DELETE", "/rest/v1/audit_events"],
]) {
  assert.equal(
    (await request(path, { method, body, token: sessions.ownerA })).ok,
    false,
  );
  passed(`direct ${method} of protected tenant/authority/audit data denied`);
}
assert.equal(
  (
    await rpc(
      "set_member_access",
      {
        p_business_id: fixture.businessA,
        p_user_id: fixture.users.manager.id,
        p_role: "manager",
        p_scope_mode: "selected_locations",
        p_location_ids: [fixture.locationB1],
        p_active: true,
      },
      "ownerA",
    )
  ).ok,
  false,
);
passed("cross-business location reference rejected through RPC");
assert.equal(
  (
    await rpc(
      "set_member_access",
      {
        p_business_id: fixture.businessA,
        p_user_id: fixture.users.ownerA.id,
        p_role: "manager",
        p_scope_mode: "all_locations",
        p_location_ids: [],
        p_active: false,
      },
      "ownerA",
    )
  ).ok,
  false,
);
passed("last-owner mutation rejected");
const inviteResponse = await rpc(
  "issue_invitation",
  {
    p_business_id: fixture.businessA,
    p_email: fixture.users.invitee.email,
    p_role: "receptionist",
    p_scope_mode: "selected_locations",
    p_location_ids: [fixture.locationA1],
  },
  "ownerA",
);
assert.equal(inviteResponse.ok, true);
const invitation = await inviteResponse.json();
assert.equal(
  (await rpc("accept_invitation", { p_token: invitation.token }, "nonMember"))
    .ok,
  false,
);
passed("wrong verified identity cannot accept invitation");
for (let index = 0; index < 2; index++) {
  const accepted = await rpc(
    "accept_invitation",
    { p_token: invitation.token },
    "invitee",
  );
  assert.equal(accepted.ok, true);
  assert.equal(await accepted.json(), fixture.businessA);
}
passed("intended invite acceptance is idempotent over HTTP");
const fileResponse = await rpc(
  "register_file",
  {
    p_business_id: fixture.businessA,
    p_location_id: fixture.locationA1,
    p_extension: "pdf",
    p_public_marketing: false,
  },
  "ownerA",
);
assert.equal(fileResponse.ok, true);
const file = await fileResponse.json();
const uploaded = await fetch(
  new URL(`/storage/v1/object/${file.bucket}/${file.path}`, origin),
  {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${sessions.ownerA}`,
      "Content-Type": "application/pdf",
    },
    body: "%PDF-1.4\nSynthetic local workspace document\n",
    signal: AbortSignal.timeout(15000),
  },
);
assert.equal(uploaded.ok, true);
passed("authorized real Storage upload succeeds");
for (const user of ["ownerB", "nonMember", "receptionist"])
  assert.equal(
    (
      await request(
        `/storage/v1/object/authenticated/${file.bucket}/${file.path}`,
        { token: sessions[user] },
      )
    ).ok,
    false,
  );
passed(
  "cross-tenant/non-member/unauthorized-role real private downloads denied",
);
assert.equal(
  (
    await request(
      `/storage/v1/object/authenticated/${file.bucket}/${file.path}`,
      { token: sessions.manager },
    )
  ).ok,
  true,
);
assert.equal(
  (
    await rpc(
      "set_member_access",
      {
        p_business_id: fixture.businessA,
        p_user_id: fixture.users.manager.id,
        p_role: "receptionist",
        p_scope_mode: "selected_locations",
        p_location_ids: [fixture.locationA2],
        p_active: true,
      },
      "ownerA",
    )
  ).ok,
  true,
);
assert.equal(
  (
    await request(
      `/storage/v1/object/authenticated/${file.bucket}/${file.path}`,
      { token: sessions.manager },
    )
  ).ok,
  false,
);
passed("unchanged JWT loses file access after role/location revocation");
assert.equal(
  (
    await rpc(
      "set_member_access",
      {
        p_business_id: fixture.businessA,
        p_user_id: fixture.users.manager.id,
        p_role: "manager",
        p_scope_mode: "all_locations",
        p_location_ids: [],
        p_active: false,
      },
      "ownerA",
    )
  ).ok,
  true,
);
assert.equal((await rpc("get_workspace_context", {}, "manager")).ok, true);
assert.equal(
  (await (await rpc("get_workspace_context", {}, "manager")).json()).length,
  0,
);
passed("membership revocation applies without obtaining a new JWT");
const requestId = crypto.randomUUID();
const bootstrapBody = {
  p_request_id: requestId,
  p_business_name: "Concurrent local fixture",
  p_location_name: "Muscat",
};
const created = await Promise.all([
  rpc("bootstrap_business", bootstrapBody, "nonMember"),
  rpc("bootstrap_business", bootstrapBody, "nonMember"),
]);
assert.equal(
  created.every((response) => response.ok),
  true,
);
const ids = await Promise.all(created.map((response) => response.json()));
assert.equal(ids[0], ids[1]);
passed("concurrent bootstrap retries return one business");
assert.equal(
  (
    await rpc(
      "transfer_ownership",
      {
        p_business_id: fixture.businessA,
        p_new_owner: fixture.users.invitee.id,
      },
      "ownerA",
    )
  ).ok,
  true,
);
assert.equal(
  (
    await rpc(
      "list_business_members",
      { p_business_id: fixture.businessA },
      "ownerA",
    )
  ).ok,
  false,
);
assert.equal(
  (
    await rpc(
      "transfer_ownership",
      {
        p_business_id: fixture.businessA,
        p_new_owner: fixture.users.ownerA.id,
      },
      "invitee",
    )
  ).ok,
  true,
);
passed(
  "ownership transfer reauthorizes both principals and can be transferred back",
);
console.log(
  `Real local Supabase HTTP integration: ${checks} checks passed. Synthetic fixtures mutated; reset before rerunning.`,
);
