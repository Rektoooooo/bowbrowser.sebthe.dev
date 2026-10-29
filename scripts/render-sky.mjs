// Renders the hero clouds (src/components/skyClouds.ts) and writes the responsive bitmaps the hero uses:
// src/assets/sky/clouds-{1440,2160,2880,3840}.{avif,webp}.
//
// Usage:
//   node scripts/render-sky.mjs                  render at 3x with Playwright's Chromium, then encode
//   node scripts/render-sky.mjs --from file.png  encode an existing 4320x3000 transparent render
//
// Rendering needs a Playwright Chromium (`npx playwright-core install chromium`); encoding needs sharp.
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const WIDTHS = [1440, 2160, 2880, 3840];
const SCALE = 3; // 4320px wide, so even the 3840 variant is downscaled (sharper than rendering at size)
const outDir = new URL("../src/assets/sky/", import.meta.url);

async function render() {
  const { chromium } = await import("playwright-core");
  const { CLOUDS_SVG } = await import("../src/components/skyClouds.ts");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: SCALE });
  await page.setContent(
    `<body style="margin:0;background:transparent"><div id="sky" style="width:1440px;height:1000px;line-height:0">${CLOUDS_SVG}</div></body>`,
  );
  const png = await page.locator("#sky").screenshot({ omitBackground: true, scale: "device" });
  await browser.close();
  return png;
}

const fromIndex = process.argv.indexOf("--from");
const source = fromIndex > -1 ? sharp(process.argv[fromIndex + 1]) : sharp(await render());
const { width, height } = await source.metadata();
console.log(`source ${width}x${height}`);

mkdirSync(outDir, { recursive: true });
for (const w of WIDTHS) {
  const resized = source.clone().resize({ width: w, kernel: "lanczos3" });
  // Soft gradients band easily: keep quality high and use 4:4:4 chroma for AVIF.
  const avif = await resized.clone().avif({ quality: 62, effort: 6, chromaSubsampling: "4:4:4" }).toBuffer();
  const webp = await resized
    .clone()
    .webp({ quality: 88, alphaQuality: 90, effort: 6, smartSubsample: true })
    .toBuffer();
  writeFileSync(new URL(`clouds-${w}.avif`, outDir), avif);
  writeFileSync(new URL(`clouds-${w}.webp`, outDir), webp);
  console.log(`${w}px  avif ${Math.round(avif.length / 1024)} KB  webp ${Math.round(webp.length / 1024)} KB`);
}
