import { useEffect, useState } from "react";
import { useInView, usePrefersReducedMotion } from "../lib/motion";

/**
 * Shows a word as asterisks (like a password field) and types the real letters in, one by one,
 * when it scrolls into view. Screen readers always get the real word.
 */
export function Scramble({ text, delay = 250, step = 70 }: { text: string; delay?: number; step?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setRevealed(text.length);
      return;
    }
    let i = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setRevealed(i);
        if (i >= text.length) window.clearInterval(interval);
      }, step);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [inView, reduced, text, delay, step]);

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split("").map((ch, i) =>
          i < revealed || ch === " " ? (
            <span key={i}>{ch}</span>
          ) : (
            // Geist's asterisk sits high like a superscript; enlarge it and drop it onto the x-height.
            <span key={i} className="inline-block w-[0.56em] translate-y-[0.3em] scale-[1.35] text-center text-ink/85">
              *
            </span>
          ),
        )}
      </span>
    </span>
  );
}
