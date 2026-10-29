/**
 * Source of the hero's cloud layer. `scripts/render-sky.mjs` renders this SVG to the bitmaps in
 * `src/assets/sky/`; run it again after changing anything here.
 *
 * Each cumulus is built from billows (circles) heaped on a flat base, seeded so the sky is the same
 * on every render. A light filter then gives the billows volume: their alpha, blurred and roughened
 * with noise, becomes a height map lit from the upper left, so tops glow white and undersides fall
 * into lavender shade.
 */

type CloudSpec = {
  /** Centre of the cloud's base, in the 1440×1000 design space. */
  x: number;
  y: number;
  /** Overall width and height of the cloud. */
  w: number;
  h: number;
  billows: number;
  seed: number;
  opacity?: number;
};

const CLOUDS: CloudSpec[] = [
  { x: 205, y: 200, w: 330, h: 150, billows: 26, seed: 3 }, // top left
  { x: 120, y: 500, w: 470, h: 165, billows: 30, seed: 11 }, // left, low and long
  { x: 1290, y: 360, w: 470, h: 290, billows: 38, seed: 5 }, // right tower
  { x: 1150, y: 545, w: 640, h: 170, billows: 34, seed: 21 }, // right, low bank behind the window
  { x: 585, y: 330, w: 150, h: 50, billows: 10, seed: 8, opacity: 0.75 }, // wisp left of the headline
  { x: 895, y: 255, w: 120, h: 40, billows: 8, seed: 14, opacity: 0.6 }, // wisp right of the headline
];

function random(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Billows of one cloud: big and tall in the middle, smaller towards the sides, all above the base.
 * Each is filled with a dome (light centre, dark rim) that the light filter reads as height, and
 * lower billows are drawn over higher ones, so every overlap becomes a crease between two lobes.
 */
function cloudShape({ x, y, w, h, billows, seed }: CloudSpec) {
  const rnd = random(seed);
  const half = w / 2;
  const circles: { cx: number; cy: number; r: number }[] = [];
  for (let i = 0; i < billows; i++) {
    const t = rnd() * 2 - 1; // -1..1 across the cloud
    const edge = 1 - Math.abs(t);
    const r = h * (0.13 + rnd() * 0.17) * (0.45 + 0.55 * edge);
    const cx = x + t * (half - r * 0.6);
    const top = h - r; // highest a billow's centre may go
    const cy = y - r * 0.9 - Math.pow(rnd(), 0.8) * top * Math.pow(edge, 0.7) * 0.85;
    circles.push({ cx, cy, r });
  }
  circles.sort((a, b) => a.cy - b.cy);
  // A flat base the billows sit on, drawn first so the billows rise out of it.
  return (
    `<ellipse cx="${x}" cy="${y - h * 0.2}" rx="${half}" ry="${h * 0.26}"/>` +
    circles.map((c) => `<circle cx="${c.cx.toFixed(1)}" cy="${c.cy.toFixed(1)}" r="${c.r.toFixed(1)}"/>`).join("")
  );
}

const defs =
  // Flat cloud bases: everything below each base line is cut off before the edges are roughened.
  CLOUDS.map(
    (c, i) =>
      `<clipPath id="base${i}"><rect x="${c.x - c.w}" y="${c.y - c.h * 2}" width="${c.w * 2}" height="${c.h * 2}"/></clipPath>`,
  ).join("") +
  `<radialGradient id="dome" cx="50%" cy="50%" r="50%">` +
  `<stop offset="0" stop-color="#fff"/><stop offset="0.55" stop-color="#e4e4e4"/><stop offset="1" stop-color="#6e6e6e"/>` +
  `</radialGradient>` +
  `<filter id="cloud" x="-15%" y="-25%" width="130%" height="150%" color-interpolation-filters="sRGB">` +
  // 1. Roughen the outline (and the domes with it) into small billows.
  `<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" seed="7" result="edgeNoise"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="edgeNoise" scale="30" xChannelSelector="R" yChannelSelector="G" result="domes"/>` +
  `<feColorMatrix in="domes" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="shape"/>` +
  `<feGaussianBlur in="shape" stdDeviation="1.4" result="alpha"/>` +
  // 2. Height map: the domes (one per billow, creased where they overlap) plus soft lumps.
  `<feColorMatrix in="domes" type="luminanceToAlpha" result="domeHeight"/>` +
  `<feGaussianBlur in="domeHeight" stdDeviation="4" result="smoothDomes"/>` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="2" result="lumps"/>` +
  `<feComposite in="smoothDomes" in2="lumps" operator="arithmetic" k1="0" k2="1" k3="0.1" k4="-0.04" result="height"/>` +
  // 3. Light it from the upper left.
  `<feDiffuseLighting in="height" surfaceScale="6" diffuseConstant="1.12" lighting-color="#ffffff" result="light">` +
  `<feDistantLight azimuth="235" elevation="40"/></feDiffuseLighting>` +
  // 4. Map light to colour: shade is lavender, light is warm white.
  `<feComponentTransfer in="light" result="lit">` +
  `<feFuncR type="table" tableValues="0.72 0.82 0.94 1 1"/>` +
  `<feFuncG type="table" tableValues="0.67 0.77 0.91 0.985 1"/>` +
  `<feFuncB type="table" tableValues="0.93 0.95 0.985 1 1"/>` +
  `</feComponentTransfer>` +
  // 5. Shade the underside a little: the band a copy of the cloud, moved up, does not cover.
  `<feOffset in="alpha" dy="-34" result="raised"/>` +
  `<feComposite in="alpha" in2="raised" operator="out" result="underside"/>` +
  `<feGaussianBlur in="underside" stdDeviation="14" result="undersideSoft"/>` +
  `<feFlood flood-color="#a291e4" flood-opacity="0.4"/>` +
  `<feComposite in2="undersideSoft" operator="in" result="shade"/>` +
  `<feMerge result="shaded"><feMergeNode in="lit"/><feMergeNode in="shade"/></feMerge>` +
  // 6. Keep it inside the cloud, then add a faint glow around the edge.
  `<feComposite in="shaded" in2="alpha" operator="in" result="body"/>` +
  `<feGaussianBlur in="alpha" stdDeviation="10" result="halo"/>` +
  `<feColorMatrix in="halo" type="matrix" values="0 0 0 0 1  0 0 0 0 0.98  0 0 0 0 1  0 0 0 0.32 0" result="glow"/>` +
  `<feMerge><feMergeNode in="glow"/><feMergeNode in="body"/></feMerge>` +
  `</filter>` +
  `<filter id="haze" x="-30%" y="-80%" width="160%" height="260%">` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="21" result="n"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="n" scale="90" xChannelSelector="R" yChannelSelector="G"/>` +
  `<feGaussianBlur stdDeviation="18"/></filter>`;

export const CLOUDS_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1000" viewBox="0 0 1440 1000"><defs>${defs}</defs>` +
  // Thin haze far away, near the horizon.
  `<g filter="url(#haze)" opacity="0.5" fill="#fff"><ellipse cx="380" cy="590" rx="420" ry="46"/><ellipse cx="1120" cy="640" rx="460" ry="56"/></g>` +
  CLOUDS.map(
    (c, i) =>
      `<g filter="url(#cloud)" opacity="${c.opacity ?? 1}"><g clip-path="url(#base${i})" fill="url(#dome)">${cloudShape(c)}</g></g>`,
  ).join("") +
  `</svg>`;
