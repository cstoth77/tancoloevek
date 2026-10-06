import { expect, test } from "@playwright/test";

test("szekciók, horgonyok és a plakátok adatai", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const id of ["orak", "rolam", "helyszin", "kapcsolat"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.getByText("Minden kedden")).toBeVisible();
  // képernyőolvasó számára egyben felolvasható időpont
  await expect(page.locator(".sr-only", { hasText: "18:00–19:00" })).toHaveCount(1);
  await expect(page.getByText("1173 Budapest, Pesti út 193.")).toBeVisible();
});

test("hero videó mozgással, reduced-motion esetén csak kép", async ({ browser }) => {
  const normal = await browser.newPage();
  await normal.goto("/");
  await expect(normal.getByTestId("hero-video")).toHaveCount(1);
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto("/");
  await expect(reduced.getByTestId("hero-video")).toHaveCount(0);
  await expect(reduced.getByAltText(/Táncos lassú mozdulatai/)).toBeVisible();
});

test("plakát lightbox Esc-re bezárul", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Plakát megtekintése" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("a térkép csak kattintásra töltődik be", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: /Térkép megjelenítése/ }).click();
  await expect(page.locator("iframe[title^='Térkép']")).toHaveCount(1);
});

test("Resend kulcs nélkül mailto-fallback jelenik meg", async ({ page }) => {
  await page.goto("/#kapcsolat");
  await expect(page.getByTestId("mailto-fallback")).toHaveAttribute("href", /^mailto:tancoloevek@gmail\.com/);
});

test("nincs vízszintes görgetés", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("JSON-LD érvényes és tartalmazza a táncsulit", async ({ page }) => {
  await page.goto("/");
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw ?? "[]") as { "@type": string }[];
  expect(data.map((d) => d["@type"])).toEqual(expect.arrayContaining(["Person", "DanceSchool"]));
});

test("elavult (cache-elt) HTML esetén is eltűnik a lejárt egyszeri időpont", async ({ page }) => {
  // a build október 14. előtt készült; a látogató október 16-án nyitja meg
  await page.clock.setFixedTime(new Date("2026-10-16T10:00:00+02:00"));
  await page.goto("/");
  await expect(page.getByText("OKT. 14. SZERDA 9:00")).toHaveCount(0);
  await expect(page.getByText("Írj az időpontért")).toBeVisible();
  await expect(page.getByText("Írj nekem az aktuális időpontokért!")).toHaveCount(1);
  await expect(page.getByText("KEDD 18:00")).toBeVisible();
});
