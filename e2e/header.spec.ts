import ka from "../messages/ka.json";
import en from "../messages/en.json";
import ru from "../messages/ru.json";
import { expect, test } from "./fixtures";

const links = [en.nav.about, en.nav.capabilities, en.nav.experience];

test.describe("header on wide screens", () => {
  test.skip(({ isMobile }) => isMobile, "phones and tablets use the menu");

  test("links, language switch and one call to action, no account links", async ({ page }) => {
    await page.goto("/en");
    const header = page.locator("#hero-header");
    await expect(header.getByRole("navigation", { name: en.nav.main }).getByRole("link")).toHaveText(links);
    await expect(header.getByRole("navigation", { name: en.common.language })).toBeVisible();
    await expect(header.getByRole("button")).toHaveCount(1);
    await expect(header.getByRole("link", { name: /log in|sign up|account/i })).toHaveCount(0);

    await header.getByRole("button", { name: en.nav.cta }).click();
    await expect(page.getByRole("dialog", { name: en.booking.title })).toBeVisible();
  });

  test("a header link jumps to its section", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#hero-header").getByRole("link", { name: en.nav.capabilities }).click();
    await expect(page).toHaveURL(/\/en#capabilities$/);
    await expect(page.locator("#capabilities")).toBeInViewport();
  });
});

test.describe("header on phones", () => {
  test.skip(({ isMobile }) => !isMobile, "wide screens show the links inline");

  test("the menu opens, closes with Escape and jumps to a section", async ({ page }) => {
    await page.goto("/en");
    const header = page.locator("#hero-header");
    await expect(header.getByRole("navigation", { name: en.common.language })).toBeVisible();
    const menu = header.getByRole("button", { name: en.nav.menu });
    await expect(menu).toHaveAttribute("aria-expanded", "false");

    await menu.click();
    const sheet = page.getByRole("dialog", { name: en.nav.menu });
    await expect(sheet).toBeVisible();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(sheet.getByRole("navigation", { name: en.nav.main }).getByRole("link")).toHaveText(links.map((l, i) => `0${i + 1}${l}`));
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(menu).toBeFocused();

    await menu.click();
    await sheet.getByRole("link", { name: en.nav.experience }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/\/en#experience$/);
    await expect(page.locator("#experience")).toBeInViewport();
  });

  test("the menu's call to action opens the booking dialog", async ({ page }) => {
    await page.goto("/");
    await page.locator("#hero-header").getByRole("button", { name: ka.nav.menu }).click();
    await page.getByRole("dialog", { name: ka.nav.menu }).getByRole("button", { name: ka.nav.cta }).click();
    await expect(page.getByRole("dialog", { name: ka.nav.menu })).toBeHidden();
    await expect(page.getByRole("dialog", { name: ka.booking.title })).toBeVisible();
  });
});

test("the island has the call to action and no account links", async ({ page, isMobile }) => {
  await page.goto("/en");
  await page.locator("#capabilities").scrollIntoViewIfNeeded();
  const island = page.getByRole("navigation", { name: en.nav.quickNavigation });
  await expect(island).toBeAttached();
  await expect(island.getByRole("link", { name: /log in|sign up|account/i })).toHaveCount(0);
  await expect(island.getByRole("button", { name: isMobile ? en.nav.ctaShort : en.nav.cta, exact: true })).toHaveCount(1);
});

for (const { prefix, m, login } of [
  { prefix: "", m: ka, login: "/login" },
  { prefix: "/en", m: en, login: "/en/login" },
  { prefix: "/ru", m: ru, login: "/ru/login" },
]) {
  test(`footer in ${prefix || "/"}: "LYST · Invite Smarter." and a client login link`, async ({ page }) => {
    await page.goto(prefix || "/");
    const footer = page.locator("footer");
    await expect(footer.getByText("Invite Smarter.", { exact: true })).toBeVisible();
    await expect(footer.getByText("Invite Smarter.", { exact: true })).toHaveAttribute("lang", "en");
    await expect(footer.getByRole("link", { name: m.footer.clientLogin })).toHaveAttribute("href", login);
    await expect(footer.getByRole("link", { name: /sign up|account/i })).toHaveCount(0);
  });
}
