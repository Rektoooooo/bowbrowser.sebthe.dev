import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cx } from "./layout";

/**
 * Minimal disclosure menu: click (or hover, when `hover` is set) opens it; Escape, a click outside
 * or tabbing away closes it. Items are plain links, so keyboard users can Tab through them.
 */
export function useMenu<T extends HTMLElement = HTMLDivElement>({ hover = false }: { hover?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<T>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLElement>("[data-menu-trigger]")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cancelClose = useCallback(() => window.clearTimeout(closeTimer.current), []);
  const hoverProps = hover
    ? {
        onPointerEnter: (e: React.PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          cancelClose();
          setOpen(true);
        },
        onPointerLeave: (e: React.PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          closeTimer.current = window.setTimeout(() => setOpen(false), 120);
        },
      }
    : {};

  const rootProps = {
    ref: rootRef,
    onBlur: (e: React.FocusEvent) => {
      if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
    },
    ...hoverProps,
  };

  const triggerProps = {
    "data-menu-trigger": "",
    "aria-expanded": open,
    "aria-controls": id,
    onClick: () => setOpen((o) => !o),
  };

  return { open, setOpen, rootProps, triggerProps, panelId: id };
}

export function MenuPanel({
  id,
  open,
  align = "start",
  className,
  children,
}: {
  id: string;
  open: boolean;
  align?: "start" | "end" | "center";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={cx(
        "absolute top-full z-50 pt-2 transition-[opacity,transform] duration-150 ease-out",
        align === "end" && "right-0 origin-top-right",
        align === "start" && "left-0 origin-top-left",
        align === "center" && "left-1/2 origin-top -translate-x-1/2",
        open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
      )}
    >
      <div
        className={cx(
          "rounded-xl bg-white p-1 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.14),0_2px_6px_rgba(0,0,0,0.04)] ring-1 ring-black/6",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function MenuItem({
  href,
  children,
  hint,
  icon,
  onSelect,
}: {
  href: string;
  children: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  onSelect?: () => void;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      onClick={onSelect}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap text-ink outline-none hover:bg-black/4 focus-visible:bg-black/4 focus-visible:outline-none"
    >
      {icon && <span className="flex size-4 items-center justify-center text-ink/80">{icon}</span>}
      <span className="flex-1">{children}</span>
      {hint && <span className="pl-6 text-xs font-normal text-muted-foreground">{hint}</span>}
    </a>
  );
}
