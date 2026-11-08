import { expect, test } from "@playwright/test";
const demo = "http://127.0.0.1:4173/phase-01-preview/";
const app = "http://127.0.0.1:4174/app-preview/";

test("demo loads SVGs and lazy routes at a non-root base; refresh preserves navigation", async ({
  page,
  request,
}) => {
  const violations: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (event) => {
    if (
      !event.url().startsWith("http://127.0.0.1:4173/") ||
      !["GET", "HEAD"].includes(event.method())
    )
      violations.push(event.url());
  });
  await page.goto(demo);
  await expect(
    page.getByRole("heading", { name: "A better way to run your salon.", exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Sample workspace" }),
  ).toBeVisible();
  await page.getByRole("combobox", { name: "Sample workspace" }).click();
  await page.getByRole("option", { name: "Waha Wellness" }).click();
  await expect(
    page.getByRole("heading", { name: "Waha Wellness" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset sample selection" }).click();
  await expect(
    page.getByRole("heading", { name: "Noura Studio" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Workspace guide", exact: true })
    .click();
  await expect(page).toHaveURL(demo + "#/guide");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your foundation, at a glance." }),
  ).toBeVisible();
  for (const name of ["logo.svg", "logo-transparent.svg", "app-icon.svg"]) {
    const response = await request.get(demo + "assets/brand/" + name);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  }
  expect((await request.get(demo + "config.json")).status()).toBe(404);
  expect((await request.get(demo + "missing.js")).status()).toBe(404);
  expect(violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("demo selection resets on reload and unknown routes display a real not-found state", async ({
  page,
}) => {
  await page.goto(demo);
  await page.getByRole("combobox", { name: "Sample workspace" }).click();
  await page.getByRole("option", { name: "Waha Wellness" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Noura Studio" }),
  ).toBeVisible();
  await page.goto(demo + "#/missing");
  await expect(
    page.getByRole("heading", { name: "This page is not here." }),
  ).toBeVisible();
});

test("Arabic RTL foundation is usable on mobile, including workspace selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(demo);
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByRole("combobox", { name: "مساحة تجريبية" }).click();
  await page.getByRole("option", { name: "واحة العافية" }).click();
  await expect(
    page.getByRole("heading", { name: "واحة العافية" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/foundation-mobile-ar.png",
    fullPage: true,
  });
});

test("real app deep-link startup without configuration fails clearly and never falls back to demo", async ({
  page,
  request,
}) => {
  await page.goto(app + "guide");
  await expect(page.getByTestId("configuration-error")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "App configuration is needed." }),
  ).toBeVisible();
  await expect(page.getByRole("combobox")).toHaveCount(0);
  expect((await request.get(app + "missing.js")).status()).toBe(404);
  await page.reload();
  await expect(page.getByTestId("configuration-error")).toBeVisible();
});

test("real app accepts only injected public fixture config, without making backend requests", async ({
  page,
}) => {
  const backendRequests: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4174/"))
      backendRequests.push(request.url());
  });
  await page.route("**/config.json", (route) =>
    route.fulfill({
      json: {
        environment: "production",
        supabaseUrl: "https://backend.example.invalid",
        supabasePublishableKey: "sb_publishable_" + "test_fixture_only_123456",
      },
    }),
  );
  await page.goto(app);
  await expect(
    page.getByRole("heading", { name: "A better way to run your salon.", exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("combobox")).toHaveCount(0);
  expect(backendRequests).toEqual([]);
});
