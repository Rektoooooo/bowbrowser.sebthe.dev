// Hero click probe. Run through the Playwright MCP's run_code. Watches one full loop of the hero window
// and, at every press of the cursor, reports which tagged element (data-cursor) the arrow's tip is in,
// how far the tip is from that element's edges, whether the cursor was still moving, and whether the
// target already showed its hover state.
async (page) => {
  const URL = "http://localhost:5174/";
  const VIEWPORTS = [
    [1440, 900, 1],
    [1180, 820, 2],
    [820, 1180, 2],
  ];
  const results = {};
  for (const [w, h, dpr] of VIEWPORTS) {
    const ctx = await page.context().browser().newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    const p = await ctx.newPage();
    await p.goto(URL, { waitUntil: "networkidle" });
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    results[`${w}x${h}`] = await p.evaluate(
      () =>
        new Promise((resolve) => {
          const root = document.querySelector('#top [aria-hidden="true"].relative.h-full.w-full');
          const cursor = [...root.children].find((c) => c.className.includes("z-30"));
          const svg = cursor.querySelector("svg");
          const t0 = performance.now();
          const clicks = [];
          let wasDown = false;
          const tick = () => {
            const t = performance.now() - t0;
            const down = svg.className.baseVal.includes("scale-90");
            if (down && !wasDown) {
              const rr = root.getBoundingClientRect();
              const k = rr.width / 1272;
              const sr = svg.getBoundingClientRect();
              // The press scales the arrow from its top-left corner; the tip is 2/20 of the way in.
              const tip = { x: sr.left + sr.width * 0.1, y: sr.top + sr.height * (2 / 24) };
              const hits = [...root.querySelectorAll("[data-cursor]")]
                .map((el) => ({ el, r: el.getBoundingClientRect() }))
                .filter(({ r }) => tip.x >= r.left && tip.x <= r.right && tip.y >= r.top && tip.y <= r.bottom);
              const hit = hits[0];
              const moving = cursor
                .getAnimations()
                .some((a) => a.playState === "running" && a.transitionProperty === "transform");
              clicks.push({
                t: Math.round(t),
                target: hit ? hit.el.dataset.cursor : "NOTHING",
                margin: hit
                  ? Math.round(
                      Math.min(tip.x - hit.r.left, hit.r.right - tip.x, tip.y - hit.r.top, hit.r.bottom - tip.y) / k,
                    )
                  : null,
                hoverShown: hit ? hit.el.className.includes("bg-black/[0.07]") || hit.el.className.includes("scale-150") || hit.el.className.includes("bg-[#dfe3ff]") : false,
                stillMoving: moving,
                cursorOpacity: +getComputedStyle(cursor).opacity,
              });
            }
            wasDown = down;
            if (t < 22600) requestAnimationFrame(tick);
            else resolve(clicks);
          };
          requestAnimationFrame(tick);
        }),
    );
    await ctx.close();
  }
  return results;
}
