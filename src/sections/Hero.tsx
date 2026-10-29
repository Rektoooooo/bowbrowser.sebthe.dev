import { useLayoutEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { HeroNav } from "../components/Nav";
import { Sky } from "../components/Sky";
import { DownloadButton } from "../components/DownloadButton";
import { ChevronRight } from "../components/typography";
import { REPO } from "../lib/release";
import { BowWindow, WINDOW_HEIGHT, WINDOW_WIDTH } from "../illustrations/hero/BowWindow";
import { usePrefersReducedMotion } from "../lib/motion";

// Below this the window's 11.5–13px UI text would drop under 9px, so the window is cropped instead.
const MIN_SCALE = 0.8;

/**
 * Scales the fixed-size window illustration to the card. Where it would have to shrink below
 * MIN_SCALE it keeps that size and is cropped on the right, showing the sidebar and the page's start.
 */
function HeroIllustration() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(WINDOW_WIDTH + 120);
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  // Measured before the first paint, so the window is drawn at its final size straight away: no jump
  // on tablets and phones, and the content below is already in place when the reveals start watching.
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    setFrameWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => {
      setFrameWidth(entry.contentRect.width);
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const stopped = paused || reduced || !visible;
  const fit = frameWidth / (WINDOW_WIDTH + 120);
  const scale = Math.max(MIN_SCALE, Math.min(1, fit));
  const cropped = fit < MIN_SCALE;
  const left = cropped ? (frameWidth < 640 ? 20 : 40) : (frameWidth - WINDOW_WIDTH * scale) / 2;

  return (
    <div ref={frameRef} className="relative z-1 -mb-32 w-full" style={{ height: WINDOW_HEIGHT * scale }}>
      <div style={{ animationDelay: "380ms" }} className="absolute inset-0 animate-rise">
        <div
          className="pointer-events-none absolute top-0 select-none"
          style={{
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            left,
          }}
        >
          <BowWindow paused={stopped} />
        </div>
      </div>
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play illustration animation" : "Pause illustration animation"}
          className="absolute right-4 bottom-36 z-20 flex size-9 items-center justify-center rounded-full bg-white/80 text-ink shadow-sm ring-1 ring-black/6 backdrop-blur transition hover:bg-white"
        >
          {paused ? <Play className="size-3.5 fill-current" /> : <Pause className="size-3.5 fill-current" />}
        </button>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <div id="top" className="p-2 pb-0 md:p-4 md:pb-0">
      <div className="relative overflow-hidden rounded-xl bg-muted shadow-xl md:rounded-2xl lg:rounded-3xl">
        <Sky />
        <HeroNav />
        <header className="relative z-10 py-16 text-center max-sm:px-6 max-sm:text-left">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            style={{ animationDelay: "80ms" }}
            className="mb-4 inline-flex h-6 animate-fade-up items-center gap-0.5 rounded-full border border-ink/20 px-2.5 font-display text-xs font-[550] tracking-[0.01em] text-ink/70 transition-colors hover:bg-ink/5"
          >
            Free and open source
            <ChevronRight className="size-3" />
          </a>
          <h1
            style={{ animationDelay: "160ms" }}
            className="animate-fade-up font-display text-4xl leading-10 font-[450] tracking-display text-ink md:text-[44px] md:leading-12 xl:text-5xl xl:leading-13"
          >
            The browser in the spirit of Arc,
            <br className="max-sm:hidden" /> open source and here to stay.
          </h1>
          <div style={{ animationDelay: "260ms" }} className="mt-8 flex animate-fade-up sm:justify-center">
            <DownloadButton size="md" align="center" />
          </div>
        </header>
        <HeroIllustration />
        <div className="pointer-events-none absolute inset-0 z-20 rounded-xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] md:rounded-2xl lg:rounded-3xl" />
      </div>
    </div>
  );
}
