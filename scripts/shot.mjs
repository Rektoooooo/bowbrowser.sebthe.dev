// Usage: node scripts/shot.mjs <url> <out.png> [width=1440] [height=900] [--full] [--wait=ms] [--scroll=y] [--selector=css]
// Takes a screenshot with its own headless Chromium, so several people can use it at once.
import { chromium } from "playwright-core";

const [url, out, w = "1440", h = "900", ...flags] = process.argv.slice(2);
const opt = Object.fromEntries(flags.map((f) => f.replace(/^--/, "").split("=")).map(([k, v]) => [k, v ?? true]));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.goto(url, { waitUntil: "networkidle" });
if (opt.scroll) await page.evaluate((y) => window.scrollTo({ top: +y, behavior: "instant" }), opt.scroll);
if (opt.selector) await page.locator(opt.selector).first().scrollIntoViewIfNeeded();
await page.waitForTimeout(+(opt.wait ?? 800));
if (opt.selector && !opt.viewport) await page.locator(opt.selector).first().screenshot({ path: out });
else await page.screenshot({ path: out, fullPage: !!opt.full });
console.log(JSON.stringify({ out, errors }));
await browser.close();
