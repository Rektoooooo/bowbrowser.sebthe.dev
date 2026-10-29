// Detail audit: geometry checks a screenshot review misses. Paste into the Playwright MCP's run_code
// (or adapt for playwright-core). For each viewport it scrolls through the page and, at several moments
// of every looping illustration, measures:
//   text-offcenter   label's cap-height centre vs its pill/button/chip centre (> 1px)
//   icon-offcenter   small icon's centre vs its box centre (> 1px)
//   ring-offcenter   a ring around a circle that is not concentric (> 0.75px)
//   toggle-inset     a toggle knob not evenly inset in its track
//   text-overlap     two visible pieces of text drawn over each other
//   text-clipped     text cut by an overflow edge (ellipsis truncation excluded)
//   text-tiny        text rendered under 9px
//   image-upscaled   a bitmap shown larger than its pixels at this device scale
// and saves a 2x/3x crop of each finding into .playwright-mcp/detail/.
async (page) => {
  const OUT = ".playwright-mcp/detail"; // relative to the Playwright MCP server's working directory
  const URL = globalThis.AUDIT_URL ?? "http://localhost:5174/";
  const VIEWPORTS = [
    [1440, 900, 2],
    [1024, 768, 2],
    [768, 1024, 2],
    [390, 844, 3],
    [320, 640, 2],
  ];

  async function auditInPage() {
    const style = document.createElement("style");
    style.textContent = "* { pointer-events: auto !important; }";
    document.head.appendChild(style);
    const issues = [];
    const checked = { labels: 0, icons: 0, rings: 0, toggles: 0, texts: 0, images: 0 };
    const vh = innerHeight,
      vw = innerWidth;
    const onScreen = (r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    const label = (el) =>
      `${el.tagName.toLowerCase()}.${String(el.className.baseVal ?? el.className)
        .split(" ")
        .slice(0, 4)
        .join(".")}`;
    const where = (el) => el.closest("[id]")?.id ?? "";
    const opacity = (el) => {
      let o = 1;
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
        const s = getComputedStyle(e);
        o *= +s.opacity;
        if (s.visibility === "hidden" || s.display === "none") return 0;
      }
      return o;
    };
    const cv = document.createElement("canvas").getContext("2d");
    const capCentre = (textNode) => {
      const el = textNode.parentElement;
      const s = getComputedStyle(el);
      cv.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      const m = cv.measureText("H");
      const f = cv.measureText("Hg");
      const range = document.createRange();
      range.selectNodeContents(textNode);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      if (rects.length !== 1) return null; // only single-line labels
      const r = rects[0];
      const scale = r.height / (f.fontBoundingBoxAscent + f.fontBoundingBoxDescent);
      const baseline = r.top + f.fontBoundingBoxAscent * scale;
      return {
        y: baseline - (m.actualBoundingBoxAscent * scale) / 2,
        rect: r,
        scale,
        size: parseFloat(s.fontSize) * scale,
      };
    };
    const boxed = (el) => {
      const s = getComputedStyle(el);
      const bg = s.backgroundColor;
      const hasBg = bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg);
      return hasBg || s.backgroundImage !== "none" || parseFloat(s.borderTopWidth) > 0 || s.boxShadow !== "none";
    };
    const innerBox = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const sc = r.height / (el.offsetHeight || r.height);
      const t = (k) => parseFloat(s[k]) * sc;
      return {
        top: r.top + t("borderTopWidth") + t("paddingTop"),
        bottom: r.bottom - t("borderBottomWidth") - t("paddingBottom"),
        left: r.left + t("borderLeftWidth") + t("paddingLeft"),
        right: r.right - t("borderRightWidth") - t("paddingRight"),
        r,
      };
    };
    // Something on the way to the root is mid-transition: its geometry is not final, skip it.
    const moving = (el) => {
      for (let e = el; e && e !== document.body; e = e.parentElement)
        if (
          e
            .getAnimations()
            .some((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity)
        )
          return true;
      return false;
    };
    const srOnly = (el) => {
      for (let e = el; e && e !== document.body; e = e.parentElement) {
        const s = getComputedStyle(e);
        if ((s.position === "absolute" && e.offsetWidth <= 1) || (s.clip && s.clip !== "auto")) return true;
      }
      return false;
    };
    const textNodes = (root) => {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
      });
      const out = [];
      while (w.nextNode()) out.push(w.currentNode);
      return out;
    };
    const all = [...document.querySelectorAll("body *")].filter((el) => !el.closest("script,style,noscript"));

    // text and icon centring inside small boxes
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (!onScreen(r)) continue;
      const scaleY = r.height / (el.offsetHeight || r.height);
      const hCss = r.height / scaleY;
      if (hCss < 14 || hCss > 64 || !boxed(el) || opacity(el) < 0.3) continue;
      const s = getComputedStyle(el);
      if (!/flex|grid/.test(s.display) && !["BUTTON", "KBD", "A"].includes(el.tagName)) continue;
      if (s.display.includes("flex") && s.flexDirection.startsWith("column")) continue;
      if (s.display.includes("flex") && !["center"].includes(s.alignItems)) continue;
      const box = innerBox(el);
      const cy = (box.top + box.bottom) / 2;
      // texts belonging to this box (not to a nested boxed element)
      const own = textNodes(el).filter((t) => {
        for (let p = t.parentElement; p && p !== el; p = p.parentElement) if (boxed(p)) return false;
        return true;
      });
      for (const t of own.slice(0, 3)) {
        const c = capCentre(t);
        if (!c) continue;
        checked.labels++;
        const d = (c.y - cy) / scaleY;
        if (Math.abs(d) > 1)
          issues.push({
            type: "text-offcenter",
            where: where(el),
            what: `${label(el)} "${t.nodeValue.trim().slice(0, 30)}" ${d > 0 ? "low" : "high"} by ${Math.abs(d).toFixed(1)}px`,
            rect: r.toJSON(),
          });
      }
      for (const svg of el.querySelectorAll(":scope > svg, :scope > span > svg")) {
        const sr = svg.getBoundingClientRect();
        if (sr.height / scaleY > 32) continue;
        checked.icons++;
        const d = ((sr.top + sr.bottom) / 2 - cy) / scaleY;
        if (Math.abs(d) > 1)
          issues.push({
            type: "icon-offcenter",
            where: where(el),
            what: `${label(el)} icon ${d > 0 ? "low" : "high"} by ${Math.abs(d).toFixed(1)}px`,
            rect: r.toJSON(),
          });
      }
    }

    // rings around circles, toggle knobs
    const circles = all.filter((el) => {
      const r = el.getBoundingClientRect();
      if (!onScreen(r) || r.width > 140) return false;
      const s = getComputedStyle(el);
      const rad = parseFloat(s.borderTopLeftRadius);
      return Math.abs(r.width - r.height) < 1 && rad >= el.offsetWidth / 2 - 1 && opacity(el) > 0.3;
    });
    for (const ring of circles) {
      const s = getComputedStyle(ring);
      const isRing =
        parseFloat(s.borderTopWidth) > 0 || /0px 0px 0px [1-9]/.test(s.boxShadow) || s.outlineStyle !== "none";
      if (!isRing) continue;
      const rr = ring.getBoundingClientRect();
      const inner = circles
        .filter((c) => c !== ring)
        .filter((c) => {
          const b = c.getBoundingClientRect();
          return (
            b.width < rr.width &&
            b.width > rr.width * 0.45 &&
            b.left >= rr.left - 2 &&
            b.right <= rr.right + 2 &&
            b.top >= rr.top - 2 &&
            b.bottom <= rr.bottom + 2
          );
        });
      for (const c of inner) {
        checked.rings++;
        const b = c.getBoundingClientRect();
        const sc = rr.width / ring.offsetWidth;
        const dx = ((b.left + b.right) / 2 - (rr.left + rr.right) / 2) / sc,
          dy = ((b.top + b.bottom) / 2 - (rr.top + rr.bottom) / 2) / sc;
        if (Math.hypot(dx, dy) > 0.75)
          issues.push({
            type: "ring-offcenter",
            where: where(ring),
            what: `${label(ring)} vs ${label(c)} dx=${dx.toFixed(1)} dy=${dy.toFixed(1)}`,
            rect: rr.toJSON(),
          });
      }
    }
    for (const track of all) {
      const r = track.getBoundingClientRect();
      if (!onScreen(r)) continue;
      const sc = r.height / (track.offsetHeight || r.height);
      const h = r.height / sc,
        w = r.width / sc;
      if (h > 32 || w < h * 1.4 || w > h * 3) continue;
      const s = getComputedStyle(track);
      if (parseFloat(s.borderTopLeftRadius) < h / 2 - 1) continue;
      const knobs = [...track.children].filter((k) => {
        const b = k.getBoundingClientRect();
        return Math.abs(b.width - b.height) < 1 && b.height < r.height;
      });
      if (knobs.length !== 1) continue;
      const b = knobs[0].getBoundingClientRect();
      checked.toggles++;
      const top = (b.top - r.top) / sc,
        bottom = (r.bottom - b.bottom) / sc,
        side = Math.min(b.left - r.left, r.right - b.right) / sc;
      if (Math.abs(top - bottom) > 0.75 || Math.abs(side - top) > 1)
        issues.push({
          type: "toggle-inset",
          where: where(track),
          what: `${label(track)} knob insets top=${top.toFixed(1)} bottom=${bottom.toFixed(1)} side=${side.toFixed(1)}`,
          rect: r.toJSON(),
        });
    }

    // text overlap, clipping, tiny text
    const runs = [];
    for (const t of textNodes(document.body)) {
      const el = t.parentElement;
      if (!el || el.closest("[role=dialog],script,style")) continue;
      const range = document.createRange();
      range.selectNodeContents(t);
      for (const r of range.getClientRects()) {
        if (onScreen(r) && r.width > 2) runs.push({ t, el, r });
      }
    }
    const visible = runs.filter((x) => opacity(x.el) > 0.35 && !srOnly(x.el) && !moving(x.el));
    checked.texts = visible.length;
    for (const x of visible) {
      const s = getComputedStyle(x.el);
      const c = capCentre(x.t);
      const px = c ? c.size : parseFloat(s.fontSize);
      if (px < 9 && x.t.nodeValue.trim().length > 1)
        issues.push({
          type: "text-tiny",
          where: where(x.el),
          what: `"${x.t.nodeValue.trim().slice(0, 30)}" at ${px.toFixed(1)}px`,
          rect: x.r.toJSON(),
        });
      for (let p = x.el; p && p !== document.body; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (ps.overflowX === "visible" && ps.overflowY === "visible") continue;
        if (ps.textOverflow === "ellipsis" || getComputedStyle(x.el).textOverflow === "ellipsis") break;
        const b = p.getBoundingClientRect();
        const cutX = x.r.right > b.right + 1 || x.r.left < b.left - 1;
        const cutY = x.r.top < b.bottom && x.r.bottom > b.bottom + 1;
        if ((cutX || cutY) && x.r.left < b.right && x.r.right > b.left && x.r.top < b.bottom)
          issues.push({
            type: String(p.className).includes("rounded-lg bg-neutral-100") ? "card-edge-crop" : "text-clipped",
            where: where(x.el),
            what: `"${x.t.nodeValue.trim().slice(0, 30)}" cut by ${label(p)} (${cutX ? "side" : "bottom"})`,
            rect: b.toJSON(),
          });
        break;
      }
    }
    const alpha = (c) => {
      if (!c || c === "transparent") return 0;
      const slash = c.match(/\/\s*([\d.]+)(%?)\s*\)$/);
      if (slash) return parseFloat(slash[1]) / (slash[2] ? 100 : 1);
      const rgba = c.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/);
      return rgba ? parseFloat(rgba[1]) : 1;
    };
    const opaque = (e) => {
      const s = getComputedStyle(e);
      return (
        alpha(s.backgroundColor) > 0.8 || (s.backgroundImage !== "none" && !s.backgroundImage.startsWith('url("data'))
      );
    };
    for (let i = 0; i < visible.length; i++)
      for (let j = i + 1; j < visible.length; j++) {
        const A = visible[i],
          B = visible[j];
        if (A.el === B.el || A.el.contains(B.el) || B.el.contains(A.el)) continue;
        const ix = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left),
          iy = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
        if (ix < 3 || iy < Math.min(A.r.height, B.r.height) * 0.35) continue;
        const px = Math.max(A.r.left, B.r.left) + ix / 2,
          py = Math.max(A.r.top, B.r.top) + iy / 2;
        const stack = document.elementsFromPoint(px, py);
        const ia = stack.indexOf(A.el),
          ib = stack.indexOf(B.el);
        if (ia < 0 || ib < 0) continue;
        const [top, bottom, it, ibt] = ia < ib ? [A, B, ia, ib] : [B, A, ib, ia];
        // Anything opaque drawn between the two texts (that is not a box around both) hides the lower one.
        const covered = stack.slice(it, ibt).some((e) => !e.contains(bottom.el) && opaque(e));
        if (!covered)
          issues.push({
            type: "text-overlap",
            where: where(A.el),
            what: `"${A.t.nodeValue.trim().slice(0, 24)}" over "${B.t.nodeValue.trim().slice(0, 24)}"`,
            rect: { x: px - 60, y: py - 30, width: 120, height: 60 },
          });
      }

    // images
    for (const img of document.images) {
      const r = img.getBoundingClientRect();
      if (!onScreen(r) || !img.naturalWidth) continue;
      checked.images++;
      const probe = new Image();
      probe.src = img.currentSrc;
      await probe.decode().catch(() => {});
      const fit = getComputedStyle(img).objectFit;
      const shownW = fit === "cover" ? Math.max(r.width, (r.height * img.naturalWidth) / img.naturalHeight) : r.width;
      const need = shownW * devicePixelRatio;
      if (probe.naturalWidth < need * 0.9)
        issues.push({
          type: "image-upscaled",
          where: where(img),
          what: `${img.currentSrc.split("/").pop()} ${probe.naturalWidth}px for ${Math.round(need)} device px`,
          rect: r.toJSON(),
        });
    }
    style.remove();
    return { issues, checked };
  }

  const report = {};
  const crops = [];
  for (const [w, h, dpr] of VIEWPORTS) {
    const ctx = await page
      .context()
      .browser()
      .newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: w < 768, hasTouch: w < 768 });
    const p = await ctx.newPage();
    await p.goto(URL, { waitUntil: "networkidle" });
    await p.waitForTimeout(1500);
    const total = await p.evaluate(() => document.documentElement.scrollHeight);
    const seen = new Map();
    const coverage = { labels: 0, icons: 0, rings: 0, toggles: 0, texts: 0, images: 0 };
    for (let y = 0; y < total; y += Math.round(h * 0.6)) {
      await p.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
      // several moments of whatever is animating on screen
      for (let k = 0; k < (y === 0 ? 8 : 3); k++) {
        await p.waitForTimeout(y === 0 ? 2400 : 1300);
        const { issues: found, checked } = await p.evaluate(auditInPage);
        for (const k in coverage) coverage[k] += checked[k];
        for (const f of found) {
          const key = `${f.type}|${f.what}`;
          if (seen.has(key)) continue;
          seen.set(key, f);
          if (crops.length < 60) {
            const pad = 24;
            const clip = {
              x: Math.max(0, f.rect.x - pad),
              y: Math.max(0, f.rect.y - pad),
              width: Math.min(w, f.rect.width + pad * 2),
              height: Math.min(h, f.rect.height + pad * 2),
            };
            if (clip.width > 4 && clip.height > 4 && clip.y < h) {
              const file = `${OUT}/${String(crops.length).padStart(2, "0")}-${w}-${f.type}.png`;
              try {
                await p.screenshot({
                  path: file,
                  clip: { ...clip, height: Math.min(clip.height, h - clip.y) },
                  scale: "device",
                });
                crops.push(file.split("/").pop());
                f.crop = file.split("/").pop();
              } catch {}
            }
          }
        }
      }
    }
    report[`${w}@${dpr}x checked`] = coverage;
    report[`${w}@${dpr}x`] = [...seen.values()].map(
      (f) => `${f.type.padEnd(15)} ${f.where.padEnd(11)} ${f.what}${f.crop ? "  [" + f.crop + "]" : ""}`,
    );
    await ctx.close();
  }
  return report;
}
