import { expect, test } from "./fixtures";

const pages = [
  { path: "/", title: "LYST | Beyond the invitation" },
  { path: "/login", title: "Log in | LYST" },
  { path: "/signup", title: "Sign up | LYST" },
  { path: "/forgot-password", title: "Forgot password | LYST" },
  { path: "/privacy", title: "Privacy Policy | LYST" },
  { path: "/terms", title: "Terms of Service | LYST" },
];

test("legal pages are linked from the footer, sign-up and booking", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
  await expect(footer.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/terms");
  await page.locator("#consultation").getByRole("button", { name: /book a consultation/i }).click();
  await expect(page.getByRole("dialog").getByRole("link", { name: /Privacy Policy/ })).toHaveAttribute("target", "_blank");
  await page.goto("/signup");
  await expect(page.locator("form").getByRole("link", { name: /Terms of Service/ })).toHaveAttribute("href", "/terms");
  await page.goto("/privacy");
  await expect(page.locator("article[lang=ka] h2")).toHaveText("კონფიდენციალურობის პოლიტიკა");
  await expect(page.getByText(/Version 1\.0 · Last updated: 30 October 2026/)).toBeVisible();
});

for (const { path, title } of pages) {
  test(`${path} loads cleanly`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}

test("security headers are sent", async ({ page }) => {
  const headers = (await page.goto("/"))!.headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("home page shows every section", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Beyond the\s+invitation\./ })).toBeVisible();
  for (const id of ["about", "capabilities", "experience", "consultation"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  // The footer sits inside <main>, so it has no contentinfo landmark role.
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: /Instagram/ })).toHaveAttribute("href", /instagram\.com/);
  await expect(footer.getByRole("link", { name: /TikTok/ })).toHaveAttribute("href", /tiktok\.com/);
});

test("no unfinished placeholder text is public", async ({ page }) => {
  await page.goto("/");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/\[[^\]]*required\]|content approval|proposal:/i);
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: "lystinvites@gmail.com" })).toHaveAttribute("href", "mailto:lystinvites@gmail.com");
  await expect(footer.getByRole("link", { name: "+995 568 13 02 60" })).toHaveAttribute("href", "tel:+995568130260");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("headings are readable and booking has an email fallback", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1 .rw > span").first()).toHaveCSS("opacity", "1");
    await expect(page.locator("#about h2 .rw > span").first()).toHaveCSS("opacity", "1");
    await expect(page.locator("#consultation").getByRole("link", { name: "lystinvites@gmail.com" })).toBeVisible();
  });
});

test("booking keeps the draft when closed, and Back closes it", async ({ page }) => {
  await page.goto("/");
  const open = () => page.locator("#consultation").getByRole("button", { name: /book a consultation/i }).click();
  const dialog = page.getByRole("dialog", { name: "Book a consultation" });
  await open();
  await dialog.locator("[role=group] button:not([disabled])").first().click();
  await dialog.getByRole("button", { name: /continue to time/i }).click();
  await dialog.getByRole("radio").first().click();
  await dialog.getByRole("button", { name: /continue to details/i }).click();
  await dialog.getByLabel("Name").fill("Keep Me");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await open();
  await expect(dialog.getByLabel("Name")).toHaveValue("Keep Me");

  await page.goBack();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("booking dialog opens and closes without submitting", async ({ page }) => {
  await page.goto("/");
  await page.locator("#consultation").getByRole("button", { name: /book a consultation/i }).click();

  const dialog = page.getByRole("dialog", { name: "Book a consultation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("list", { name: "Progress" })).toBeVisible();

  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
});
