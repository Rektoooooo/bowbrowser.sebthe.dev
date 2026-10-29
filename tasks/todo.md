# Bow website — plan

Goal: a landing page for Bow (open-source Arc-style browser, github.com/Rektoooooo/bow) that follows the layout,
rhythm and visual language of aside.com as closely as possible, with Bow's own content, colours and illustrations.
No Aside text, images, logos or fonts are copied: we reproduce the *design system*, not the assets.

Stack: Vite + React 19 + TypeScript + Tailwind CSS v4. Fonts: Geist (body, OFL) and an open display face standing in
for Aside's proprietary "AsideDisplay". Single page; download goes straight to the GitHub release.

## Design tokens (measured on aside.com at 1440px)
- Page: white; ink `#0a0a0b`-ish; muted text `#737373` (lab 48.5); neutral-50 `#f9f9f9`; muted `#f5f5f5`.
- Content column: `max-w-screen-2xl`, side padding 16/24/48/96 px; inner column has `border-x black/6` guide rails.
  Sections are separated by full-width `border-b black/6` lines. Inner padding xl:px-36 (144px) or xl:px-66 (264px).
- Hero: rounded-3xl card inset 16px, shadow-xl, inset 1px ring black/6, sky image background; nav (h-14) inside the
  card; badge pill (h-6, text-xs, border primary/20); H1 48/52 display, weight ~450, tracking -0.01em; button group
  (black, rounded-xl, "Download for macOS" + chevron split); animated browser mock below, clipped by the card.
- Sticky nav after the hero: white, border-b black/6, h-14.
- H2 44/48 weight 450; H3 30/40 weight 500; body 18/28 muted; eyebrow link 16px medium brand colour with chevron,
  dotted underline on hover; "Learn more" inline links dotted underline.
- Cards: illustration box rounded-lg (11px) h-80 + caption `px-4 py-5` "<b>Title</b> muted text".
- Segmented tabs: bg muted, rounded-2xl, p-1, active tab white with shadow.
- CTA banner: rounded-2xl, soft radial gradient with dot grid, H2 + big download button.
- Footer: 5 link columns (14px medium, heads muted/80), bottom rule, © left, icons right.

## Bow mapping (section by section)
1. Hero — sky in Bow's icon colours (peach → pink → violet → periwinkle) with clouds; badge "Free and open source";
   H1 "The browser in the spirit of Arc, / open source and here to stay."; animated Bow window mock (sidebar with
   Favorites, Space, pinned folder, Today tabs; scenes: browsing → Command Bar → Split View → Peek → Space switch);
   pause button.
2. Intro (2-col) — "Introducing Bow ›" | "Arc is being shut down. …" / "Bow keeps the way of browsing …".
3. Import (gradient-from-neutral-50) — "Coming from Arc ›", H2 "Everything you set up in Arc, / ready in Bow in a
   minute."; masked 3-row grid of frosted glass feature tiles; paragraph; 3 cards: Sidebar / Spaces / Auto-archive.
4. Keyboard — H3 "Made for the keyboard." + rows of shortcuts with keycaps (replaces Aside's benchmark table) with a
   segmented control (Tabs / Spaces / Split & Peek / Windows).
5. Command Bar — H3 "A Command Bar that knows what you mean." + query bubble + animated Command Bar mock.
6. Split View & Peek — eyebrow, H2 with scramble-reveal word, 3 cards (Split View / Peek / Little Windows), then a
   2-col block "Boosts — make any site yours" with a dark illustration panel.
7. Privacy (neutral-50) — "Privacy and control ›", H2 "******* without an account." reveals "Private"; 4 cards:
   No account / Tracker blocking / HTTPS-Only + forget on quit / Chrome extensions.
8. CTA banner — "Browse the way Arc taught you. / Start with Bow today." + download.
9. Footer — Features / Get Bow / Project / Coming from Arc / License; "Not affiliated with The Browser Company."

## Steps
- [x] Scaffold Vite + React + TS + Tailwind v4, fonts, tokens, base layout primitives (Section, Rail, Eyebrow…)
- [x] Display font: Geist for both (advisor call; H1 looks right next to the reference, no comparison needed)
- [x] Hero: CSS/SVG sky (no image assets), nav + dropdowns, badge, H1, download split button (live latest-release lookup)
- [x] Sticky nav (hidden until the hero has scrolled under it) + mobile menu
- [x] Sections 2–9 with copy and layout
- [x] Illustrations (4 workers in parallel, reviewed): hero window · Command Bar + Boost · 6 feature cards · 4 privacy cards · tile wall
- [x] Motion: scramble-reveal headings, loops only while on screen, reduced-motion still frames, hero pause button
- [x] Verify with Playwright: desktop 1440 + 1280 + tablet 768 + mobile 390 screenshots vs reference, no console
      errors, no horizontal scroll, links correct, `npm run build` clean, typecheck clean
- [x] Review section in this file

## Review

What shipped: a single-page site with the reference's structure, rails, type scale, spacing, nav behaviour, split
download button, cards, segmented control, scramble headings, closing banner and footer, filled with Bow's own copy
(facts checked against Bow's README) and Bow-styled illustrations drawn in HTML/CSS/SVG.

Checks (scripts/check.mjs, scripts/scroll-shots.mjs):
- 390 / 768 / 1280 / 1440 px: no console errors, no horizontal overflow, every in-page anchor has a target,
  every image loads, every `target=_blank` link has `rel=noreferrer`.
- Reduced motion: hero is a still frame, the pause button is hidden.
- `npm run build` and `tsc -b` clean. JS 103 KB gzip, CSS 14 KB gzip, clouds 259 KB WebP.
- All GitHub links point at files that exist on Bow's `main` (docs/sync.md and docs/backup-format.md are on
  origin/main, not yet in the local checkout).

Performance finding: the inline SVG cloud filters plus the glass sidebar's backdrop-filter caused frames of up to
1.1 s at hero scene changes (backdrop re-sampled the sky, which re-ran feTurbulence). Removing either fixed it.
The clouds are now pre-rendered by `scripts/render-sky.mjs` from `src/components/skyClouds.ts` (see the
hero quality pass below for the current pipeline). Production build: 60 fps over a full 20 s loop with at most one or two ~117 ms
hitches at scene changes (headless Chromium, Metal).

Second pass (after the advisor review):
- Watched the hero loop frame by frame (every 600 ms for 21 s, then every 150 ms around each scene change). Fixed a
  ~250 ms flash of the empty window when the Space switched back: a blank page card now sits under both Spaces.
- The window-sized 40px backdrop blur is now limited to the 232px sidebar (the page cards cover the rest), and the
  hero Command Bar is opaque (the headline showed through it). Tablet scroll went from several 0.3–1.1 s frames to
  61 fps almost everywhere.
- The latest-release answer is cached for an hour in localStorage: GitHub allows 60 unauthenticated calls an hour per
  IP, and the many test loads hit that limit (the page fell back to the v0.1.0 links, as designed).
- Phone cards are 288px wide so the next card peeks in and the row reads as swipeable.
- Re-checked 390 and 768 visually with every illustration in place.

Not done / follow-ups:
- `og:image` is relative (`/screenshot-light.jpg`); set it and `og:url` to absolute URLs once the domain is known,
  or link previews (Slack, X, iMessage) show no image.
- No deploy target set up (any static host serves `dist/`).
- OG image is a Bow screenshot; a designed 1200×630 card would look better in link previews.

## Polish pass (2026-10-28)

Audit: measured the horizontal centre of every heading, paragraph and button at 390 / 1024 / 1440 (all centred
items within 1px of the page centre), and screenshotted the page at 320, 390, 768, 1024, 1280, 1440 and 1920.

Fixed:
- 320px: the page scrolled sideways (shortcut labels had a fixed 160px width). Labels now flex and truncate.
- Card illustrations cropped at 1024–1280 ("ersonal", "ield notes"): `FitArt` lays each one out at its design
  width and scales it to the box (down to 80%, then crops gently), so every breakpoint shows the whole composition.
- Privacy cards: 2×2 on small laptops (four in a row were ~200px wide), four in a row from 1280px.
- Boost editor on phones overlapped itself; it now scales as one piece in a box with the same shape.
- Download button wrapped to two lines at 320px; it no longer wraps and drops "for macOS" below 360px.
- Footer: the ↗ arrow no longer drops onto its own line.
- Shortcuts list now lines up with its heading (same text column).
- Keyboard focus ring on the black download button was invisible (Tailwind v4 `outline-none` overrode it); now an
  inset white ring following the pill's corners.
- Dropdown menus are opaque (the headline showed through).
- Headings balance their lines; paragraphs use `text-wrap: pretty` (Chrome 117+, Safari 26) against orphans.

Motion added (all respect reduced motion: content is simply shown, nothing moves):
- Hero entrance on load: badge, headline, button fade up in turn, the window rises in.
- Tile wall pops in as a wave from the centre with a soft overshoot, like the reference's icon wall; tiles lift on
  hover.
- Section headings, paragraphs, cards (staggered) and the Command Bar demo fade up as they scroll into view.
- Download button presses in slightly when clicked.

Checked after: no horizontal overflow at 320–1920, no console errors, every in-page link has a target, every
reveal has played after scrolling (only the closed download menu stays hidden, as it should), reduced motion shows
everything and freezes the hero, 21 s of the hero loop with one 90 ms frame. Prettier added (`npm run format`).

## Hero quality pass and swatch ring (2026-10-28)

- Boost swatch ring was 4px above its swatch (36px ring at top -4px in a 36px row whose 28px swatches sit 4px
  down). Now top 0; measured ring centre = swatch centre (0px off) at every step of the loop.
- Hero clouds looked low quality on Retina: one 2160px image (1.5x, WebP q80) was upscaled ~1.33x at 1440 and
  ~1.75x at 1920. Two fixes:
  - Art: clouds are now generated cumulus (billows heaped on a flat base, seeded), each billow a dome in a height
    map lit from the upper left (feDiffuseLighting), with lavender undersides and a soft glow. Picked from four
    rendered variants.
  - Resolution: rendered at 3x (4320x3000) and encoded with sharp to AVIF (q62, 4:4:4) and WebP (q88) at
    1440/2160/2880/3840 in a `<picture>` with `sizes` that accounts for the phone crop. AVIF vs lossless source:
    mean difference 0.42/255, max 5. Browser picks 2880 at 1440@2x, 3840 at 1920@2x, 2880 on a 3x phone,
    1440 at 1x. Retina download is 58 KB (was 259 KB).
- Performance A/B at 2x (Chrome 116 via the Playwright MCP, GPU): 3 slow frames per 21 s loop with the new clouds,
  with no clouds, and with the small image alike, so the image adds nothing; the hitches belong to the Space-switch
  scene in that older Chrome.

## Detail audit (2026-10-29)

New `scripts/detail-audit.js` (run through the Playwright MCP): at 1440/1024/768 @2x and 390 @3x, 375/320 @2x,
scrolling the page and sampling every animation several times, it measures label centring in pills/buttons/chips,
icon centring, ring concentricity, toggle knob insets, text overlapping text, text cut by an edge, text under 9px,
and images upscaled for the screen. Validated by reintroducing the swatch-ring bug (caught: dy=4.0). Coverage per
viewport: ~300-550 labels, ~260-350 icons, 3-6 rings, 3-21 toggles, ~1500-2300 text runs.

Found and fixed:
- Hero window shrank to 0.5x on phones/tablets: its UI text rendered at 5.5-6.7px. Now never below 0.8x
  (smallest text 9.2px); on narrow screens it is cropped on the right instead.
- Card illustrations rendered 7-8.8px text at 1024/320: min scale 0.86 (Spaces 0.78), smallest sizes raised
  (Split 9->10.5px, Spaces pill 10->12px, hero pages 11->11.5px).
- Little Window: "Open in Personal" pill overlapped the chat text; it now sits in the window's own toolbar.
- Peek card header text 8.2px -> 12px.
- Spaces card cropped "Side project" at 1024: layout narrowed to 300px, Space renamed "Projects", item names that
  truncated shortened.
- Shortcut tabs: "Windows" cut off at 320-375px; "Split and Peek" shows as "Split" below 390px. Tabs fit at every
  width (scrollWidth = clientWidth).
- 320px: first card was cut on the right and the next never showed; cards are min(18rem, 100vw-5rem), and cards
  in swipe rows reveal as soon as any part is visible, so the peek shows.
- Hero sky: `sizes` was estimated; measured cover widths (1190-1360px below 1024) -> every viewport now gets
  98-119% of the pixels it needs (was 74-89% on phones/tablets).

Left as designed: UI fragments that run off the bottom edge of a card (reference composition), and the next
card's caption peeking at the edge of a mobile swipe row.

Final: audit clean at all six viewports apart from those two, plus no overflow, console errors, missing anchors or
broken images at 320-1920, tabs fit everywhere, reduced motion still and fully visible.

## iPad (2026-10-29)

- `npm run share` builds and serves the site on the local network (port 4173); `vite.config.ts` allows `.local`
  Bonjour names next to the IP.
- Detail audit at iPad mini 744x1133, iPad 820x1180 / 1180x820, iPad Pro 13" 1032x1376 (2x, touch, iPad Safari UA):
  clean apart from the swipe-row peek. Taps checked: Features menu, Download menu (closes on tap outside),
  portrait menu (opens, navigates, releases scroll lock), swipe rows.
- Found and fixed: the hero window was laid out at full size for the first frame and shrank once a ResizeObserver
  reported the width. The content below started off-screen, so its scroll reveal could miss the move into view
  and stay hidden until the first scroll (seen at iPad portrait). The hero now measures in useLayoutEffect before
  paint, and the reveal accepts any intersecting entry in a callback. 8/8 fresh loads reveal everything on screen;
  layout shift on load is 0.000 at 320, 390, 820, 1024, 1440 and 1920.

## Tile wall drift and hero re-choreography (2026-10-29)

Tile wall: each row holds three identical sets and slides left by one set per loop (CSS keyframes, linear),
74/62/48 s from back to front with staggered phases. Checked at 320/820/1440/1920: every repeat is exactly one
step long (seamless), the rows cover the wall at every phase, ~100 fps, paused off screen, still with reduced
motion. Tiles still rise in on first view (now a left-to-right sweep) and lift on hover.

Hero, studied frame by frame (every 250 ms over the loop, contact sheets, close-ups of each click) plus a probe
that records, at each press, the tagged element under the arrow's tip:
- Clicks were aimed at fixed coordinates: the Peek link was hit 20 px from its edge, the Peek close button was
  pressed while the cursor was still moving, and Split View closing and the Space switch happened with no click.
  Now every target carries `data-cursor`, is measured live when the move starts (after its layout has settled),
  shows a hover state on arrival, and gets a press ring. Five clicks per loop: close the split pane, open the
  Peek link, close Peek, Space dot to Work (after pointing at a roadmap card), Space dot back. Probe at
  1440/1180/820: all 15 on target, hover shown, cursor at rest, fully visible.
- Logic: the tab merged into Split View still showed as its own row (now collapses away); split halves and the
  Command Bar action now use the tabs' real names.
- Command Bar results went blank for a moment on the first keystroke (re-keyed fade from 0); now a soft rise.
- The cursor took 900 ms to fade when the keyboard took over; opacity now 300 ms (movement still 900 ms).
- Space switches showed an empty page for ~300 ms; the pages now cross-fade.
- Split View animated grid columns, which moved toolbars and panes through layout: CLS 0.03-0.17 per loop and
  the loop's slow frames. Both layouts now keep fixed sizes; the new pane slides in with a transform, the two
  layouts fade through a white underlay clipped with clip-path (no double heading). CLS 0.000 over the loop and
  a full scroll at 390/820/1180/1440; hero loop 100 fps with no frame over 50 ms.

## Live at bowbrowser.sebthe.dev (2026-10-29)

- [x] Repo `Rektoooooo/bowbrowser.sebthe.dev` (public, named after the domain like the other sites); commits use
      the GitHub no-reply address, staged files scanned for personal data before the first push.
- [x] `.github/workflows/deploy.yml`: push to main → `npm ci` + `npm run build` → GitHub Pages (workflow source).
- [x] Pages custom domain `bowbrowser.sebthe.dev` set before DNS (no takeover window); `public/CNAME` mirrors it.
- [x] Namecheap Advanced DNS (sebthe.dev): CNAME `bowbrowser` → `rektoooooo.github.io.`, Automatic TTL; added in the
      Playwright browser after Seb signed in himself and approved the row. Other records untouched.
- [x] Certificate: GitHub only requested it after the domain was removed and re-added once DNS resolved; approved,
      HTTPS enforced, http → 301.
- [x] canonical, og:url and og:image are absolute https://bowbrowser.sebthe.dev URLs.
- [x] Live check at 390 @3x / 820 @2x / 1440 @2x: 200, no console errors or failed requests, no broken images, no
      overflow, right sky size per screen, Download → v0.1.0 DMG (302 to GitHub's CDN).
- [ ] Optional: point the Bow repo's "Website" field and README at https://bowbrowser.sebthe.dev.
