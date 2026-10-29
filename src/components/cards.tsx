import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Caption } from "./typography";
import { Reveal } from "./Reveal";
import { cx } from "./layout";

/**
 * Lays the illustration out at least `width` px wide and scales it down to fit narrower boxes, so a
 * card shows the same composition at every breakpoint instead of cropping it. Below `minScale` it
 * stops shrinking (to keep the UI text legible) and lets the edges crop instead.
 */
export function FitArt({
  width,
  minScale = 0.86,
  children,
}: {
  width: number;
  minScale?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = box ? Math.min(1, Math.max(minScale, box.w / width)) : 1;
  return (
    <div ref={ref} className="absolute inset-0">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={
          box && scale < 1
            ? { width: box.w / scale, height: box.h / scale, transform: `scale(${scale})` }
            : { right: 0, bottom: 0 }
        }
      >
        {children}
      </div>
    </div>
  );
}

/** Illustration box + caption. In a row it snaps horizontally below `lg` and becomes a grid above. */
export function FeatureCard({
  title,
  children,
  art,
  artWidth = 340,
  artMinScale,
  artClassName,
  height = "md:h-64 h-72 lg:h-80 2xl:h-96",
  index = 0,
}: {
  title: string;
  children: ReactNode;
  art: ReactNode;
  /** Narrowest width the illustration was designed for. */
  artWidth?: number;
  /** How far the illustration may shrink before it crops instead (its smallest text must stay 9px+). */
  artMinScale?: number;
  artClassName?: string;
  height?: string;
  /** Position in its row, for the staggered entrance. */
  index?: number;
}) {
  return (
    <Reveal
      delay={index * 90}
      threshold={0}
      className="w-[min(18rem,calc(100vw-5rem))] shrink-0 snap-start sm:w-80 lg:w-auto"
    >
      <div
        className={cx(
          "pointer-events-none relative w-full overflow-hidden rounded-lg bg-neutral-100 select-none",
          height,
          artClassName,
        )}
      >
        <FitArt width={artWidth} minScale={artMinScale}>
          {art}
        </FitArt>
      </div>
      <Caption title={title}>{children}</Caption>
    </Reveal>
  );
}

/** The horizontally scrolling (mobile) / gridded (desktop) row that holds FeatureCards. */
export function CardRow({ cols = 3, children }: { cols?: 3 | 4; children: ReactNode }) {
  return (
    <div className="scrollbar-none snap-x snap-mandatory scroll-pl-4 overflow-x-auto scroll-smooth md:scroll-pl-6">
      <div
        className={cx(
          "flex gap-4 pl-4 md:gap-6 md:pl-6 lg:grid lg:px-6",
          // Four cards go two by two on small laptops, where four in a row would be under 210px each.
          cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2 xl:grid-cols-4",
          // trailing space so the last card can snap fully into view on mobile
          "after:block after:w-px after:shrink-0 lg:after:hidden",
        )}
      >
        {children}
      </div>
    </div>
  );
}
