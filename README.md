# Bow website

The landing page for [Bow](https://github.com/Rektoooooo/bow), the open-source browser in the spirit of Arc.
Live at **https://bowbrowser.sebthe.dev**.

Built with Vite, React 19, TypeScript and Tailwind CSS v4. Fonts are Geist and Geist Mono (OFL), bundled through
Fontsource. Every illustration is drawn with HTML, CSS and SVG. The only images are Bow's icon and one screenshot for link previews (`public/`), and
the hero's cloud layer, which is rendered from our own SVG (`src/components/skyClouds.ts`) to AVIF and WebP in
four widths (`src/assets/sky/`, up to 3840px for Retina screens) so the page stays smooth and sharp.

## Run it

```bash
npm install
npm run dev
```

To look at it on an iPad or phone on the same Wi-Fi, run `npm run share` and open the "Network" address it
prints (or `http://<your-mac-name>.local:4173`).

`npm run build` type-checks and writes a static site to `dist/`, which any static host can serve (GitHub Pages,
Netlify, Cloudflare Pages, Vercel). `npm run preview` serves the build locally.

## How it is put together

- `src/sections/`: one file per band of the page (Hero, Intro, Arc, SplitView, Privacy, Closing).
- `src/components/`: layout primitives (`Section`, `Rail`, `Container`), type styles, the nav, menus, the split
  download button, the sky, the tile wall and the scramble-reveal heading.
- `src/illustrations/`: the animated mocks (hero window, Command Bar, Boost editor, feature cards). Each one loops
  only while it is on screen and shows a still frame when the visitor prefers reduced motion.
- `src/lib/release.ts`: download links. The page starts from the release it was written against and asks the GitHub
  API for the latest one, so new releases show up without a rebuild.
- `src/index.css`: design tokens (`@theme`).

In development, `/?demo=<name>` shows one illustration alone at its real size (`hero`, `commandbar`, `boost`,
`sidebar`, `spaces`, `archive`, `split`, `peek`, `little`, `noaccount`, `blocking`, `https`, `extensions`).

`node scripts/shot.mjs <url> <out.png> [width] [height]` and `node scripts/scroll-shots.mjs <url> <dir> [width]
[height]` take screenshots with a headless Chromium (Playwright) for visual checks.

The screenshot scripts use `playwright-core` and need a Chromium build; if none is installed, run
`npx playwright-core install chromium`. `node scripts/render-sky.mjs` re-renders the hero clouds
(`src/assets/sky/`) after changes to `src/components/skyClouds.ts`; it renders at 3x with Chromium and encodes with
sharp (`--from render.png` encodes an existing render).

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). The custom
domain is set in the repository's Pages settings (and mirrored in `public/CNAME`); DNS has a `CNAME` record
`bowbrowser` → `rektoooooo.github.io`.
