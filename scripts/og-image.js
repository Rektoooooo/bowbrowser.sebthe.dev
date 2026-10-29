// Renders the link-preview image (og:image) from the live hero. Run through the Playwright MCP's run_code
// while `npm run preview` (or `npm run share`) serves the build on port 4173, then convert the PNG with:
//   node -e "require('sharp')('.playwright-mcp/og.png').jpeg({quality:82,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile('public/og-image.jpg')"
// It shows the hero edge to edge at 1200x630 (2x), with the Command Bar open mid-search in the window.
async (page) => {
  const OUT = globalThis.OG_OUT ?? ".playwright-mcp/og.png"; // relative paths: the Playwright MCP server's directory
  const SCENE = globalThis.OG_SCENE ?? "commandbar"; // or "browsing" (the still first scene)
  const ctx = await page
    .context()
    .browser()
    .newContext({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 2,
      reducedMotion: SCENE === "browsing" ? "reduce" : "no-preference",
    });
  const p = await ctx.newPage();
  await p.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  // Edge to edge: no page margin, corners, shadow or inner ring around the hero card; less air above and below
  // the headline so more of the window shows; no pause button.
  await p.addStyleTag({
    content: `
      #top { padding: 0 !important; }
      #top > div { border-radius: 0 !important; box-shadow: none !important; }
      #top > div > .pointer-events-none.absolute.inset-0.z-20 { display: none !important; }
      #top header { padding-top: 34px !important; padding-bottom: 36px !important; }
      #top button[aria-label*="illustration animation"] { display: none !important; }
    `,
  });
  if (SCENE === "commandbar") {
    // Wait for the Command Bar to have typed "split" and shown its results, then let the row settle.
    await p.waitForFunction(() => document.querySelector("#top")?.innerText.includes("Split View with Slow-roasted pasta"), null, { timeout: 30000 });
    await p.waitForTimeout(450);
  } else {
    await p.waitForTimeout(1500);
  }
  await p.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 }, scale: "device" });
  await ctx.close();
  return OUT;
}
