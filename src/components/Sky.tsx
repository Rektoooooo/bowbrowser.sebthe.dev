import { cx } from "./layout";
import avif1440 from "../assets/sky/clouds-1440.avif";
import avif2160 from "../assets/sky/clouds-2160.avif";
import avif2880 from "../assets/sky/clouds-2880.avif";
import avif3840 from "../assets/sky/clouds-3840.avif";
import webp1440 from "../assets/sky/clouds-1440.webp";
import webp2160 from "../assets/sky/clouds-2160.webp";
import webp2880 from "../assets/sky/clouds-2880.webp";
import webp3840 from "../assets/sky/clouds-3840.webp";

// The clouds are pre-rendered from `skyClouds.ts` by `scripts/render-sky.mjs`. Drawn live, their
// filters re-ran on every repaint of the glass sidebar above them (up to a second a frame).

const srcSet = (urls: string[]) => urls.map((url, i) => `${url} ${[1440, 2160, 2880, 3840][i]}w`).join(", ");
const AVIF = srcSet([avif1440, avif2160, avif2880, avif3840]);
const WEBP = srcSet([webp1440, webp2160, webp2880, webp3840]);

// The image covers the hero card. Below laptop width the card is taller than it is wide, so the image
// is scaled to the card's height and cropped to the middle; measured, it is then 1190-1360px wide
// (widest on the smallest phones, where the text wraps most). From laptops up it spans the card,
// never narrower than 1440px. The browser multiplies this by the screen's density.
const SIZES = "(max-width: 1023px) 1360px, max(100vw, 1440px)";

const GRAIN_URL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

/** Dawn sky in the colours of Bow's icon: CSS gradients under a pre-rendered cloud layer. */
export function Sky({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(55% 50% at 8% 12%, rgba(255, 196, 178, 0.95) 0%, rgba(255, 196, 178, 0) 70%)",
            "radial-gradient(50% 55% at 96% 8%, rgba(184, 146, 255, 0.85) 0%, rgba(184, 146, 255, 0) 70%)",
            "radial-gradient(80% 60% at 50% 75%, rgba(146, 168, 255, 0.75) 0%, rgba(146, 168, 255, 0) 75%)",
            "linear-gradient(180deg, #c3b4ff 0%, #d4c2fc 38%, #c9caff 100%)",
          ].join(","),
        }}
      />
      <picture>
        <source type="image/avif" srcSet={AVIF} sizes={SIZES} />
        <source type="image/webp" srcSet={WEBP} sizes={SIZES} />
        <img
          src={webp2160}
          alt=""
          draggable={false}
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </picture>
      {/* A touch of grain keeps the CSS gradients from banding. */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN_URL}")` }}
      />
    </div>
  );
}
