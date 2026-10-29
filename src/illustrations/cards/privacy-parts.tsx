import type { ReactNode } from "react";
import { cx } from "../../components/layout";

/** Shared finish for the privacy cards: a thin-bordered white popover with a soft shadow. */
export function Popover({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cx(
        "rounded-xl border border-black/8 bg-white text-[12px] leading-4 text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-6px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Centres a fixed-width fragment in the card. */
export function CardStage({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center overflow-hidden select-none">
      {children}
    </div>
  );
}

export function Toggle({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      className={cx(
        "relative inline-block h-[18px] w-[30px] shrink-0 rounded-full transition-colors duration-300",
        on ? "bg-[#22c55e]" : "bg-black/15",
        className,
      )}
    >
      <span
        className={cx(
          "absolute top-[2px] left-[2px] size-[14px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-transform duration-300",
          on && "translate-x-3",
        )}
      />
    </span>
  );
}
