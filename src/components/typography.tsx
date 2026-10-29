import type { ReactNode } from "react";
import { cx } from "./layout";

export function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cx("size-4", className)}>
      <path d="m9.5 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Small brand-coloured link that introduces a section ("Introducing Bow ›"). */
export function Eyebrow({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <p className={className}>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group inline-flex items-center gap-0.5 text-sm font-medium text-brand-content decoration-brand/50 decoration-dotted decoration-2 underline-offset-4 hover:underline md:text-base"
      >
        {children}
        <ChevronRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    </p>
  );
}

/** Inline "Learn more" style link with a dotted underline. */
export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="inline-block font-medium text-brand-content underline decoration-brand/40 decoration-dotted underline-offset-3 hover:decoration-brand"
    >
      {children}
    </a>
  );
}

export function H2({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h2
      className={cx(
        "font-display text-3xl leading-9 font-[450] tracking-display text-ink sm:text-4xl sm:leading-11 xl:text-display-md xl:leading-12",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h3
      className={cx(
        "font-display text-2xl leading-8 font-medium tracking-display text-ink xl:text-3xl xl:leading-10",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function Lead({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cx("text-base text-muted-foreground xl:text-lg", className)}>{children}</p>;
}

/** Card caption: a dark lead-in followed by muted text. */
export function Caption({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-4 py-5">
      <p className="text-sm text-muted-foreground xl:text-base">
        <span className="font-medium text-ink">{title}</span> {children}
      </p>
    </div>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cx(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-black/8 bg-white px-1.5 font-sans text-xs font-medium text-ink/80 shadow-[0_1px_0_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
