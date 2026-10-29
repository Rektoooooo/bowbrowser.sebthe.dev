import type { CSSProperties, ReactNode } from "react";
import { useInView, usePrefersReducedMotion } from "../lib/motion";
import { cx } from "./layout";

/**
 * Fades its content up into place the first time it scrolls into view. Off-screen content inside a
 * horizontal scroller (the mobile card rows) waits until it is swiped into view.
 */
export function Reveal({
  delay = 0,
  y = 14,
  threshold = 0.15,
  className,
  style,
  children,
}: {
  delay?: number;
  /** Starting offset in px. */
  y?: number;
  /** Share of the element that must be visible first. Cards in a swipe row use 0, so a peeking card shows. */
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const [ref, seen] = useInView<HTMLDivElement>({ threshold, rootMargin: "0px 0px -6% 0px" });
  // Without motion there is nothing to reveal: show the content from the start.
  const reduced = usePrefersReducedMotion();
  const inView = seen || reduced;
  return (
    <div
      ref={ref}
      className={cx(
        "transition-[opacity,translate] duration-[900ms] ease-out-soft",
        inView ? "translate-y-0 opacity-100" : "opacity-0",
        className,
      )}
      style={{ ...style, translate: inView ? undefined : `0 ${y}px`, transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
