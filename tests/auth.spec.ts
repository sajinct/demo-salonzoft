import { expect, Page, Route, test } from "@playwright/test";
const app = "http://127.0.0.1:4175/auth-preview/";
const backend = "https://phase02.example.invalid";
const userId = "11111111-1111-4111-8111-000000000001";
const businessId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1";
const locationId = "a1000000-0000-4000-8000-000000000001";
const memberId = "11111111-1111-4111-8111-000000000003";
const user = {
  id: userId,
  aud: "authenticated",
  role: "authenticated",
  email: "owner-a@miznora.example.test",
  email_confirmed_at: "2026-01-01T00:00:00Z",
  confirmed_at: "2026-01-01T00:00:00Z",
  app_metadata: { provider: "email" },
  user_metadata: { role: "owner" },
  created_at: "2026-01-01T00:00:00Z",
};
function session() {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const expires = Math.floor(Date.now() / 1000) + 3600;
  return {
    access_token: [
      encode({ alg: "HS256", typ: "JWT" }),
      encode({
        sub: userId,
        role: "authenticated",
        aud: "authenticated",
        exp: expires,
        iat: expires - 3600,
        iss: backend + "/auth/v1",
      }),
      "dGVzdC1maXh0dXJlLXNpZ25hdHVyZQ",
    ].join("."),
    token_type: "bearer",
    expires_in: 3600,
    expires_at: expires,
    refresh_token: "synthetic-refresh-token",
    user,
  };
}
interface MockState {
  role: "owner" | "receptionist";
  empty: boolean;
  offline: boolean;
  userExpired: boolean;
  pkceCalls: number;
  passwordChanges: number;
  invocations: { name: string; body: Record<string, unknown> }[];
}
async function mockBackend(page: Page, { allowSignup = true } = {}) {
  const state: MockState = {
    role: "owner",
    empty: false,
    offline: false,
    userExpired: false,
    pkceCalls: 0,
    passwordChanges: 0,
    invocations: [],
  };
  let invites: {
    id: string;
    email: string;
    role_code: string;
    expires_at: string;
    accepted_at: null;
    revoked_at: string | null;
  }[] = [];
  const fulfill = (route: Route, json: unknown, status = 200) =>
    route.fulfill({ json, status });
  await page.route("**/config.json", (route) =>
    fulfill(route, {
      environment: "staging",
      supabaseUrl: backend,
      supabasePublishableKey:
        "sb_publishable_" + "synthetic_browser_fixture_value",
      allowSignup,
    }),
  );
  await page.route(backend + "/**", async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    const body: Record<string, unknown> =
      method === "GET"
        ? {}
        : (route.request().postDataJSON() as Record<string, unknown>);
    if (url.pathname === "/auth/v1/token") {
      if (url.searchParams.get("grant_type") === "pkce") {
        state.pkceCalls++;
        if (!body["code_verifier"] || body["auth_code"] === "expired-code")
          return fulfill(
            route,
            {
              error: "invalid_grant",
              error_description: "Invalid flow state.",
            },
            400,
          );
      }
      if (body["password"] === "wrong-password")
        return fulfill(
          route,
          { code: "invalid_credentials", msg: "Invalid login credentials" },
          400,
        );
      return fulfill(route, session());
    }
    if (url.pathname === "/auth/v1/user") {
      if (state.userExpired) return fulfill(route, { message: "expired" }, 401);
      if (method === "PUT") {
        state.passwordChanges++;
        return fulfill(route, user);
      }
      return fulfill(route, user);
    }
    if (url.pathname === "/auth/v1/signup")
      return fulfill(route, { user, session: null });
    if (
      ["/auth/v1/recover", "/auth/v1/resend", "/auth/v1/logout"].includes(
        url.pathname,
      )
    )
      return fulfill(route, {});
    const name = url.pathname.split("/").at(-1) ?? "";
    state.invocations.push({ name, body });
    if (name === "get_workspace_context") {
      if (state.offline)
        return fulfill(route, { message: "fixture unavailable" }, 503);
      return fulfill(
        route,
        state.empty
          ? []
          : [
              {
                id: businessId,
                name: "Noura Studio / استوديو نورة",
                status: "active",
                role: state.role,
                scope_mode: "all_locations",
                permissions:
                  state.role === "owner"
                    ? ["members.manage", "workspace.read"]
                    : ["workspace.read"],
                locations: [{ id: locationId, name: "Muscat / مسقط" }],
              },
            ],
      );
    }
    if (
      state.role !== "owner" &&
      [
        "list_business_members",
        "list_invitations",
        "issue_invitation",
      ].includes(name)
    )
      return fulfill(route, { message: "forbidden" }, 403);
    if (name === "list_business_members")
      return fulfill(route, [
        {
          user_id: userId,
          display_name: "Owner fixture",
          role_code: "owner",
          scope_mode: "all_locations",
          active: true,
          location_ids: [],
        },
        {
          user_id: memberId,
          display_name: "Manager fixture",
          role_code: "manager",
          scope_mode: "selected_locations",
          active: true,
          location_ids: [locationId],
        },
      ]);
    if (name === "list_invitations") return fulfill(route, invites);
    if (name === "issue_invitation") {
      const id = "55555555-5555-4555-8555-000000000001";
      invites = [
        {
          id,
          email: String(body["p_email"]),
          role_code: String(body["p_role"]),
          expires_at: new Date(Date.now() + 86400000).toISOString(),
          accepted_at: null,
          revoked_at: null,
        },
      ];
      return fulfill(route, { id, token: "a".repeat(64) });
    }
    if (name === "revoke_invitation") {
      invites = invites.map((entry) => ({
        ...entry,
        revoked_at: new Date().toISOString(),
      }));
      return fulfill(route, null);
    }
    if (name === "bootstrap_business") {
      state.empty = false;
      return fulfill(route, businessId);
    }
    if (name === "accept_invitation") {
      state.empty = false;
      return fulfill(route, businessId);
    }
    if (name === "transfer_ownership") {
      state.role = "receptionist";
      return fulfill(route, null);
    }
    if (name === "set_member_access") return fulfill(route, null);
    return fulfill(route, { message: "Unmocked request" }, 500);
  });
  return state;
}
async function signIn(page: Page) {
  await page.goto(app + "auth/sign-in");
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("MiznoraLocal!2026");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Choose your business." }),
  ).toBeVisible();
}

test("staging guards, real SDK sign-in, session restore, server role denial and local sign-out (HTTP fixtures)", async ({
  page,
}) => {
  const state = await mockBackend(page);
  state.role = "receptionist";
  await page.goto(app + "businesses/select");
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
  await expect(
    page.getByText("Noura Studio / استوديو نورة", { exact: true }),
  ).toHaveCount(0);
  await signIn(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Choose your business." }),
  ).toBeVisible();
  await page.goto(app + "access/" + businessId);
  await expect(
    page.getByRole("heading", {
      name: "You do not have access to this workspace.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create invitation link", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Back to businesses" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("miznora:staging:phase02.example.invalid:auth"),
    ),
  ).toBeNull();
  await page.goto(app + "businesses/select");
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
});

test("failed sign-in, explicit signup/confirmation and safe return destinations (HTTP fixtures)", async ({
  page,
}) => {
  await mockBackend(page);
  await page.goto(app + "auth/sign-in?returnUrl=https://evil.example.invalid/");
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "The request could not be completed.",
  );
  await page.getByLabel("Password", { exact: true }).fill("MiznoraLocal!2026");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(app + "businesses/select");
  await page.getByRole("button", { name: "Sign out" }).click();
  await page
    .getByRole("link", { name: "Create an account", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("new@miznora.example.test");
  await page.getByLabel("Password", { exact: true }).fill("MiznoraLocal!2026");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "If this address is eligible",
  );
  await page.getByRole("link", { name: "Resend confirmation" }).click();
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("new@miznora.example.test");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "If this address is eligible",
  );
});

test("recovery uses one SDK PKCE exchange and verified recovery context; refresh cannot forge it (HTTP fixtures)", async ({
  page,
}) => {
  const state = await mockBackend(page);
  await page.goto(app + "auth/forgot-password");
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill(user.email);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "If this address is eligible",
  );
  await page.goto(app + "auth/recovery-callback?code=synthetic-recovery-code");
  await expect(
    page.getByRole("heading", { name: "Choose a new password." }),
  ).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("ChangedLocal!2026");
  await page
    .getByLabel("Confirm password", { exact: true })
    .fill("ChangedLocal!2026");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Password updated.");
  expect(state.pkceCalls).toBe(1);
  expect(state.passwordChanges).toBe(1);
  expect(page.url()).not.toContain("code=");
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "Start a new recovery request",
  );
  expect(state.pkceCalls).toBe(1);
});

test("missing/expired callbacks and another-browser recovery are safe failures (HTTP fixtures)", async ({
  page,
  browser,
}) => {
  const state = await mockBackend(page);
  await page.goto(
    app +
      "auth/callback?error=access_denied&error_description=sensitive-detail",
  );
  await expect(page.getByRole("heading")).toContainText("This link is missing");
  expect(page.url()).not.toContain("sensitive-detail");
  expect(state.pkceCalls).toBe(0);
  await page.goto(app + "auth/forgot-password");
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill(user.email);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("status")).toBeVisible();
  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await mockBackend(otherPage);
  await otherPage.goto(
    app + "auth/recovery-callback?code=synthetic-other-browser-code",
  );
  await expect(otherPage.getByRole("heading")).toContainText(
    "This link is missing",
  );
  await other.close();
  await page.goto(app + "auth/recovery-callback?code=expired-code");
  await expect(page.getByRole("heading")).toContainText("This link is missing");
  expect(page.url()).not.toContain("expired-code");
  await page.reload();
  expect(state.pkceCalls).toBe(1);
});

test("first-business creation, owner invitations, access change and ownership transfer call backend RPCs (HTTP fixtures)", async ({
  page,
}) => {
  const state = await mockBackend(page);
  state.empty = true;
  await signIn(page);
  await expect(
    page.getByText("No accessible businesses were returned.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Create first business", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Business name", exact: true })
    .fill("Noura Studio");
  await page
    .getByRole("textbox", { name: "First location name", exact: true })
    .fill("Muscat");
  await page
    .getByRole("button", { name: "Create first business", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Noura Studio / استوديو نورة" }),
  ).toBeVisible();
  const creation = state.invocations.find(
    (entry) => entry.name === "bootstrap_business",
  );
  expect(String(creation?.body["p_request_id"])).toMatch(/^[0-9a-f-]{36}$/);
  await page.getByRole("link", { name: "Manage access" }).click();
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("invitee@miznora.example.test");
  await page
    .getByRole("button", { name: "Create invitation link", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Invitation link (shown once)" }),
  ).toHaveValue(new RegExp("/invitations/accept#token="));
  await page.getByRole("button", { name: "Revoke", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "Revoked", exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "الأشخاص والصلاحيات." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/access-mobile-ar.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "English", exact: true }).click();
  const access = page.locator("article").filter({
    has: page.getByRole("heading", { name: "Save access", exact: true }),
  });
  await access.getByRole("combobox", { name: "Member", exact: true }).click();
  await page
    .getByRole("option", { name: "Manager fixture", exact: true })
    .click();
  await access
    .getByRole("button", { name: "Save access", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("The backend confirmed");
  const transfer = page.locator("article").filter({
    has: page.getByRole("heading", {
      name: "Transfer ownership",
      exact: true,
    }),
  });
  await transfer.getByRole("combobox", { name: "Member", exact: true }).click();
  await page
    .getByRole("option", { name: "Manager fixture", exact: true })
    .click();
  await transfer.getByRole("checkbox").check();
  await transfer
    .getByRole("button", { name: "Transfer ownership", exact: true })
    .click();
  await expect(page).toHaveURL(app + "businesses/select");
  expect(
    state.invocations.some((entry) => entry.name === "set_member_access"),
  ).toBe(true);
  expect(
    state.invocations.some((entry) => entry.name === "transfer_ownership"),
  ).toBe(true);
});

test("invitation fragment is kept in memory across sign-in and accepted through RPC (HTTP fixtures)", async ({
  page,
}) => {
  const state = await mockBackend(page);
  await page.goto(app + "invitations/accept#token=" + "a".repeat(64));
  await page.getByRole("link", { name: "Sign in", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("MiznoraLocal!2026");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByLabel("Invitation token", { exact: true }),
  ).toHaveValue("a".repeat(64));
  expect(page.url()).not.toContain("token=");
  await page
    .getByRole("button", { name: "Accept invitation", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Choose your business." }),
  ).toBeVisible();
  expect(
    state.invocations.some((entry) => entry.name === "accept_invitation"),
  ).toBe(true);
});

test("Arabic mobile credentials, disabled signup, context errors and expired restoration are explicit (HTTP fixtures)", async ({
  page,
}) => {
  const state = await mockBackend(page, { allowSignup: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(app + "auth/sign-up");
  await expect(page.getByRole("alert")).toContainText(
    "Account registration is disabled",
  );
  await page.goto(app + "auth/sign-in");
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(
    page.getByRole("heading", { name: "مرحباً بعودتك." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/auth-mobile-ar.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "English", exact: true }).click();
  state.offline = true;
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("MiznoraLocal!2026");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Workspace access is unavailable",
  );
  state.offline = false;
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Noura Studio / استوديو نورة" }),
  ).toBeVisible();
  state.userExpired = true;
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
  await expect(
    page.getByText("Noura Studio / استوديو نورة", { exact: true }),
  ).toHaveCount(0);
});
