import { useId } from "react";
import { cx } from "./layout";

/** Vector version of Bow's app icon: a white arch on the peach → violet → periwinkle tile. */
export function BowMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cx("size-8", className)}>
      <defs>
        <radialGradient id={`${id}-a`} cx="20%" cy="25%" r="70%">
          <stop offset="0" stopColor="#f6a596" />
          <stop offset="1" stopColor="#f6a596" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-b`} cx="85%" cy="35%" r="65%">
          <stop offset="0" stopColor="#bb86f9" />
          <stop offset="1" stopColor="#bb86f9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-c`} cx="50%" cy="95%" r="60%">
          <stop offset="0" stopColor="#7d97fc" />
          <stop offset="1" stopColor="#7d97fc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="32" height="32" rx="8.5" fill="#e3c4ee" />
      <rect width="32" height="32" rx="8.5" fill={`url(#${id}-a)`} />
      <rect width="32" height="32" rx="8.5" fill={`url(#${id}-b)`} />
      <rect width="32" height="32" rx="8.5" fill={`url(#${id}-c)`} />
      <path
        d="M8.6 20.4v-1.6a7.4 7.4 0 0 1 14.8 0v1.6"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.95"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="none" stroke="#fff" strokeOpacity="0.35" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cx("group flex items-center gap-2 select-none", className)} aria-label="Bow home">
      <BowMark className="size-7 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="font-display text-[23px] leading-none font-[550] tracking-[-0.02em]">Bow</span>
    </a>
  );
}
