// Usage: node scripts/check.mjs [url=http://localhost:5173/]
// Loads the page at phone, tablet, laptop and desktop widths and reports anything broken:
// console errors, horizontal overflow, in-page links without a target, images that failed to load,
// and whether reduced motion stops the animations.
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:5173/";
const widths = [390, 768, 1280, 1440];
const browser = await chromium.launch();
const report = {};

for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    isMobile: width < 768,
    hasTouch: width < 768,
  });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  await page.goto(url, { waitUntil: "networkidle" });
  // Scroll through so lazy effects and observers run.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 600) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
    await page.waitForTimeout(120);
  }
  const result = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const anchors = [...document.querySelectorAll("a[href^='#']")].map((a) => a.getAttribute("href"));
    const missing = [...new Set(anchors)].filter((h) => h !== "#" && !document.getElementById(h.slice(1)));
    const images = [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((i) => i.src);
    const external = [...new Set([...document.querySelectorAll("a[href^='http']")].map((a) => a.href))];
    const noRel = [...document.querySelectorAll("a[target=_blank]")].filter(
      (a) => !/noreferrer|noopener/.test(a.rel),
    ).length;
    return { scrollWidth: document.documentElement.scrollWidth, vw, missing, images, external, noRel };
  });
  report[width] = { errors, ...result, overflow: result.scrollWidth > result.vw };
  if (width !== 1440) delete report[width].external;
  await page.close();
}

// Reduced motion: the hero should not change between two frames a few seconds apart.
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const a = await page.screenshot({ clip: { x: 0, y: 380, width: 1440, height: 500 } });
await page.waitForTimeout(4000);
const b = await page.screenshot({ clip: { x: 0, y: 380, width: 1440, height: 500 } });
report.reducedMotionStill = Buffer.compare(a, b) === 0;
report.pauseButtonHidden = (await page.getByRole("button", { name: /illustration animation/ }).count()) === 0;

console.log(JSON.stringify(report, null, 1));
await browser.close();
