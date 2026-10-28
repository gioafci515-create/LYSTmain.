import { expect, hasSupabase, test } from "./fixtures";

// Form checks that never reach the server.
test.describe("form validation", () => {
  test("sign-up requires the 16+ confirmation", async ({ page }) => {
    await page.goto("/signup");
    const form = page.locator("form");
    await form.getByLabel("Name").fill("Test Host");
    await form.getByLabel("Email").fill("test-host@example.com");
    await form.getByLabel("Password").fill("long-enough-1");
    await form.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText("Host accounts are for people aged 16 or older.")).toBeVisible();
    await expect(form.getByRole("checkbox", { name: /16 or older/ })).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Confirm your email.")).toBeHidden();
  });

  test("log-in asks for both fields", async ({ page }) => {
    await page.goto("/login");
    await page.locator("form").getByRole("button", { name: "Log in" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Please check your details" })).toBeVisible();
    await expect(page.getByText("Error: Enter a complete email address.")).toBeVisible();
    await expect(page.getByText("Error: Enter your password.")).toBeVisible();
  });
});

// Real round trips to Supabase through the Server Actions in app/auth/actions.ts.
test.describe("auth against Supabase", () => {
  test.beforeEach(({ baseURL }) => {
    test.skip(!hasSupabase(baseURL), "needs Supabase: add .env.local, or run test:e2e:live");
  });

  test("wrong password gets a friendly error and no readable token", async ({ page }, testInfo) => {
    // One attempt per run (desktop only) keeps well under the per-IP login limit.
    test.skip(testInfo.project.name !== "desktop", "one login attempt per run is enough");
    await page.goto("/login");
    const form = page.locator("form");
    await form.getByLabel("Email").fill(`e2e-${Date.now()}@example.com`);
    await form.getByLabel("Password").fill("definitely-not-the-password");
    await form.getByRole("button", { name: "Log in" }).click();

    // Either answer proves the server round trip; the second appears if the limit was hit.
    // Scoped to the form: Next.js adds its own (empty) role="alert" route announcer to every page.
    await expect(form.getByRole("alert")).toHaveText(
      /Email or password is incorrect\.|Too many attempts\. Please wait a few minutes and try again\./,
    );
    expect(await page.evaluate(() => document.cookie)).not.toContain("sb-");
  });

  test("logged-out visitors are sent from /account to /login", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { level: 1, name: "Host log in" })).toBeVisible();
  });

  test("logged-out visitors see the admin log-in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { level: 1, name: "Admin log in" })).toBeVisible();
  });
});
