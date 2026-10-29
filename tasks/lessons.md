# Lessons

## Visual QA (2026-10-29)
- A polish pass that only checks page-level layout at 1x misses what people actually notice. The user found an
  off-centre swatch ring (4px) and a soft hero background after I had reported the page as polished.
- Check details at the screen's real density (2x/3x), and measure instead of eyeballing:
  ring vs circle centres, label cap-height vs pill centre, toggle knob insets, icon centres, text drawn over text,
  text cut by an edge, text under 9px after scaling, bitmaps shown larger than their pixels.
  `scripts/detail-audit.js` does all of this across 6 viewports and several moments of each animation.
- Before trusting a detector, reintroduce a known bug and confirm it is caught (the ring check reported dy=4.0).
- Report what a check covered (how many labels, rings, toggles it examined), not just "no findings".
- Scaled illustrations need a floor: shrinking a 12px UI below ~0.78x makes 9px text. Crop past that point.
- Responsive image `sizes` must come from measured rendered widths at each breakpoint, not estimates; they change
  whenever the layout above them changes.

## Animated illustrations (2026-10-29)
- A scripted cursor must aim at the real element, measured when it moves (`data-cursor` + getBoundingClientRect),
  never at hand-picked coordinates, and must press only after its move transition has finished.
- Every state change in a demo needs a visible cause (a click or a key); things that change on their own read as
  bugs.
- Layout-shift (CLS) counts movements inside decorative animations too. Measure CLS over a full loop, not just at
  load, and animate with transform/opacity/clip-path, never widths, grid tracks or margins.
- When cross-fading two layouts of the same content, fade one out before the other in, over a neutral underlay,
  or both copies show at once.
