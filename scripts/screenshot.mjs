// Képernyőképek a futó oldalról (critic loop / vizuális QA).
// Használat: node scripts/screenshot.mjs <címke> [url] [--full]
import { chromium, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const [label = "shot", url = "http://localhost:3100", flag] = process.argv.slice(2);
const full = flag === "--full";
await mkdir("screenshots", { recursive: true });
const browser = await chromium.launch();
for (const [name, opts] of [
  ["desktop", { viewport: { width: 1440, height: 900 } }],
  ["mobile", { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } }],
]) {
  const page = await browser.newPage({ ...opts, reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle" });
  if (full) {
    // lazy képek betöltése: végiggörgetés, majd vissza a tetejére
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const path = `screenshots/${label}-${name}.png`;
  await page.screenshot({ path, fullPage: full });
  console.log(`${path} (vízszintes túlcsordulás: ${overflow}px)`);
  await page.close();
}
await browser.close();
