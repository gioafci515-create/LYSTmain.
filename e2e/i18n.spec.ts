import ka from "../messages/ka.json";
import en from "../messages/en.json";
import ru from "../messages/ru.json";
import { expect, test } from "./fixtures";

// Every key path in a message tree, e.g. "booking.errors.timeout" or "hero.headline.0".
const keys = (o: unknown, prefix = ""): string[] =>
  o && typeof o === "object"
    ? Object.entries(o).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
    : [prefix];

test.describe("message files", () => {
  test("Georgian and Russian have exactly the English keys", () => {
    expect(keys(ka).sort()).toEqual(keys(en).sort());
    expect(keys(ru).sort()).toEqual(keys(en).sort());
  });

  test("no message says RSVP (CLAUDE.md wording rules)", () => {
    for (const m of [ka, en, ru]) expect(JSON.stringify(m)).not.toMatch(/rsvp/i);
  });
});

const homes = [
  { path: "/", lang: "ka", title: ka.meta.homeTitle, h1: ka.hero.headline.join(" ") },
  { path: "/en", lang: "en", title: en.meta.homeTitle, h1: en.hero.headline.join(" ") },
  { path: "/ru", lang: "ru", title: ru.meta.homeTitle, h1: ru.hero.headline.join(" ") },
];

for (const { path, lang, title, h1 } of homes) {
  test(`${path} is the ${lang} home page`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
  });
}

test("the URL alone decides the language: no redirect, no language cookie", async ({ page, context }) => {
  await context.setExtraHTTPHeaders({ "accept-language": "ru-RU,ru;q=0.9,en;q=0.8" });
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ka");
  expect(res?.headers()["set-cookie"] ?? "").not.toContain("NEXT_LOCALE");
  expect((await context.cookies()).map((c) => c.name)).not.toContain("NEXT_LOCALE");
});

test("/ka redirects to the unprefixed Georgian page", async ({ page }) => {
  await page.goto("/ka/privacy");
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ka");
});

test("every page lists its translations (hreflang) and a canonical URL", async ({ page, baseURL }) => {
  await page.goto("/en/privacy");
  const origin = new URL(baseURL!).origin;
  const href = (sel: string) => page.locator(sel).getAttribute("href");
  // Canonical and alternates are absolute, built from SITE_URL (lib/site.ts).
  const site = new URL((await href('link[rel="canonical"]'))!).origin;
  expect([origin, "https://lystmain.vercel.app"]).toContain(site);
  expect(await href('link[rel="canonical"]')).toBe(`${site}/en/privacy`);
  expect(await href('link[rel="alternate"][hreflang="ka"]')).toBe(`${site}/privacy`);
  expect(await href('link[rel="alternate"][hreflang="en"]')).toBe(`${site}/en/privacy`);
  expect(await href('link[rel="alternate"][hreflang="ru"]')).toBe(`${site}/ru/privacy`);
  expect(await href('link[rel="alternate"][hreflang="x-default"]')).toBe(`${site}/privacy`);
});

test("the language switch keeps the page", async ({ page }) => {
  await page.goto("/en/privacy");
  const nav = page.getByRole("navigation", { name: "Language" });
  await expect(nav.getByRole("link", { name: "English" })).toHaveAttribute("aria-current", "true");
  await expect(nav.getByRole("link", { name: "ქართული" })).toHaveAttribute("href", "/privacy");
  await nav.getByRole("link", { name: "Русский" }).click();
  await expect(page).toHaveURL(/\/ru\/privacy$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Политика конфиденциальности");
  await page.getByRole("navigation", { name: ru.common.language }).getByRole("link", { name: "ქართული" }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("კონფიდენციალურობის პოლიტიკა");
});

for (const { prefix, m } of [
  { prefix: "", m: ka },
  { prefix: "/en", m: en },
  { prefix: "/ru", m: ru },
]) {
  test(`legal pages in ${prefix || "/"} say the Georgian version prevails`, async ({ page }) => {
    for (const doc of ["privacy", "terms"]) {
      await page.goto(`${prefix}/${doc}`);
      await expect(page.getByText(m.legal.prevails)).toBeVisible();
    }
  });
}

test("sitemap lists every public page in every language", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(locs.sort()).toEqual(["/", "/en", "/en/privacy", "/en/terms", "/privacy", "/ru", "/ru/privacy", "/ru/terms", "/terms"].sort());
  expect(xml).toContain('hreflang="x-default"');
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);
});

test.describe("404", () => {
  test.use({ allowedProblems: [/status of 404/] });

  test("unknown pages show the 404 in their language", async ({ page }) => {
    const res = await page.goto("/ru/nope");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(ru.notFound.title);
    await page.goto("/nope");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(ka.notFound.title);
  });
});

test("booking dialog speaks Georgian, dates included", async ({ page }) => {
  await page.goto("/");
  await page.locator("#consultation").getByRole("button", { name: ka.consultation.cta }).click();
  const dialog = page.getByRole("dialog", { name: ka.booking.title });
  await expect(dialog).toBeVisible();
  // Month and weekday names are Georgian (Mkhedruli script, no Latin letters), even in browsers
  // whose Intl has no Georgian data (lib/intl.ts).
  await expect(dialog.locator("[role=group]")).toHaveAttribute("aria-label", /^[ა-ჿ\s–\d]+$/);
  await expect(dialog.locator("[role=group] button:not([disabled])").first()).toHaveAttribute(
    "aria-label",
    /^[ა-ჿ]+, \d{1,2} [ა-ჿ]+, \d{4}$/,
  );
});

test("the booking API answers with error codes, not English sentences", async ({ request }) => {
  const res = await request.post("/api/consultations", { data: { name: "", email: "nope", date: "", time: "" } });
  expect(res.status()).toBe(400);
  expect(await res.json()).toEqual({
    error: "checkDetails",
    fields: { name: "nameRequired", email: "emailInvalid", date: "dateRequired", time: "timeRequired" },
  });
});
