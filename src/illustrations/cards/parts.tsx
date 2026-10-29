import { useEffect, useState, type ReactNode, type Ref } from "react";
import { usePrefersReducedMotion, useOnScreen } from "../../lib/motion";

/** Shared surface style for the UI fragments (Bow's light chrome). */
export const SURFACE =
  "bg-white/85 backdrop-blur-md ring-1 ring-black/5 shadow-[0_10px_30px_-8px_rgba(40,30,80,0.18),0_2px_6px_rgba(40,30,80,0.05)]";

/**
 * Step counter for gentle loops. Only ticks while the card is on screen and motion is allowed;
 * with reduced motion it stays on `rest` (the frame that should look best as a still).
 */
export function useStep(count: number, ms: number, rest = 0) {
  const reduced = usePrefersReducedMotion();
  const [ref, onScreen] = useOnScreen<HTMLDivElement>();
  const [step, setStep] = useState(rest);
  useEffect(() => {
    if (reduced || !onScreen) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [reduced, onScreen, count, ms]);
  return { ref, step: reduced ? rest : step, reduced };
}

/** Pastel gradient wash + floating white chip + a UI fragment rising from the bottom edge. */
export function CardShell({
  rootRef,
  wash,
  streak = -20,
  chip,
  top = 66,
  width = 300,
  children,
}: {
  rootRef: Ref<HTMLDivElement>;
  wash: string;
  streak?: number;
  chip: ReactNode;
  top?: number;
  width?: number;
  children: ReactNode;
}) {
  return (
    <div ref={rootRef} aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ background: wash }}>
      <div
        className="absolute top-1/2 left-1/2 h-[140%] w-24 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-xl"
        style={{ rotate: `${streak}deg`, translate: "-30% 0" }}
      />
      <div className="absolute top-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-[14px] leading-5 font-medium whitespace-nowrap text-ink shadow-sm ring-1 ring-black/5">
        {chip}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top, width }}>
        {children}
      </div>
    </div>
  );
}

/** Keyboard shortcut text inside a chip. */
export function Keys({ children }: { children: ReactNode }) {
  return <span className="text-[14px] font-medium text-muted-foreground">{children}</span>;
}

/** Letter monogram in a coloured rounded square (generic stand-in for a favicon). */
export function Mono({ c, size = 16, children }: { c: string; size?: number; children: ReactNode }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[5px] font-semibold text-white"
      style={{ background: c, width: size, height: size, fontSize: Math.round(size * 0.58) }}
    >
      {children}
    </span>
  );
}

/** Skeleton line for fake page content. */
export function Bar({
  w = "100%",
  h = 5,
  className = "bg-black/10",
}: {
  w?: string | number;
  h?: number;
  className?: string;
}) {
  return <div className={`shrink-0 rounded-full ${className}`} style={{ width: w, height: h }} />;
}

export const MONO_COLORS = {
  violet: "#9b7cf6",
  blue: "#6f8cf7",
  pink: "#e58ac9",
  peach: "#f2916f",
  mint: "#4fb893",
  amber: "#e8a53a",
};
