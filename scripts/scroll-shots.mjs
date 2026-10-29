// Usage: node scripts/scroll-shots.mjs <url> <outDir> <width> <height> [step]
// Screenshots the page top to bottom, one viewport per `step` pixels; reports console errors and horizontal overflow.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const [url, dir, w = "1440", h = "900", step = "800"] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 1,
  isMobile: +w < 768,
  hasTouch: +w < 768,
});
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < total; y += +step, i++) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${dir}/${String(i).padStart(2, "0")}.png` });
}
const overflow = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const wide = [...document.querySelectorAll("body *")]
    .filter(
      (el) =>
        el.getBoundingClientRect().right > vw + 1 &&
        !el.closest(".overflow-x-auto, .overflow-hidden, [class*=overflow-x]"),
    )
    .slice(0, 8)
    .map(
      (el) =>
        `${el.tagName}.${String(el.className).slice(0, 60)} right=${Math.round(el.getBoundingClientRect().right)}`,
    );
  return { scrollWidth: document.documentElement.scrollWidth, vw, wide };
});
console.log(JSON.stringify({ total, shots: i, errors, overflow }, null, 1));
await browser.close();
