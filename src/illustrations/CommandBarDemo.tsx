import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Calculator, Play, Search } from "lucide-react";
import { cx } from "../components/layout";
import { useOnScreen, usePrefersReducedMotion } from "../lib/motion";
import { SCENARIOS, queryAfter, type Row, type RowIcon, type Scenario } from "./commandbar/scenarios";

const ROW_STEP_MS = 55;

function Icon({ icon }: { icon: RowIcon }) {
  const box = "grid size-7 shrink-0 place-items-center rounded-lg";
  switch (icon.kind) {
    case "mono":
      return (
        <span className={cx(box, "text-[13px] font-semibold text-white")} style={{ background: icon.color }}>
          {icon.letter}
        </span>
      );
    case "calc":
      return (
        <span className={cx(box, "bg-brand-content text-white")}>
          <Calculator className="size-4" strokeWidth={2} />
        </span>
      );
    case "play":
      return (
        <span className={cx(box, "bg-[#e5484d] text-white")}>
          <Play className="size-3.5 fill-current" strokeWidth={0} />
        </span>
      );
    case "search":
      return (
        <span className={cx(box, "text-muted-foreground")}>
          <Search className="size-4" strokeWidth={2} />
        </span>
      );
  }
}

function ResultRow({
  row,
  index,
  shown,
  active,
  action,
}: {
  row: Row;
  index: number;
  shown: boolean;
  active: boolean;
  action: string;
}) {
  const style: CSSProperties = { transitionDelay: shown ? `${index * ROW_STEP_MS}ms` : "0ms" };
  const reveal = cx(
    "transition-[opacity,transform,background-color] duration-300 ease-out",
    shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
  );

  if (row.type === "group") {
    return (
      <div className={cx("flex h-8 items-center gap-2 px-3 text-xs font-medium", reveal)} style={style}>
        <span className="text-ink">{row.label}</span>
        <span className="text-muted-foreground">{row.count}</span>
      </div>
    );
  }

  const label = row.tab ? "Switch to Tab" : (row.action ?? action);
  return (
    <div
      className={cx(
        "flex h-11 items-center gap-3 rounded-xl px-3",
        reveal,
        active ? "bg-black/[0.045]" : "bg-transparent",
      )}
      style={style}
    >
      <Icon icon={row.icon} />
      <div className="flex min-w-0 flex-1 items-baseline gap-2">
        <span className="truncate text-sm font-medium text-ink">{row.title}</span>
        {row.detail && (
          <span className="hidden truncate text-[13px] text-muted-foreground sm:inline">{row.detail}</span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 text-[13px]">
        {active ? (
          <>
            <span className="hidden font-medium text-ink sm:inline">{label}</span>
            <span className="grid size-6 place-items-center rounded-md bg-white text-ink shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
              <ArrowRight className="size-3.5" strokeWidth={2.25} />
            </span>
          </>
        ) : (
          row.meta && <span className="hidden text-muted-foreground sm:inline">{row.meta}</span>
        )}
      </div>
    </div>
  );
}

function SearchRow({ sc, n }: { sc: Scenario; n: number }) {
  const { text, chipped, typedRaw } = queryAfter(sc, n);
  const hint = sc.hint(typedRaw, chipped);
  return (
    <div className="flex h-14 items-center gap-3 px-5">
      <Search className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={2} />
      <div className="flex min-w-0 flex-1 items-center gap-2 text-base font-medium text-ink">
        {chipped && sc.chip && (
          <span className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-brand/15 pr-2.5 pl-1.5 text-sm font-medium text-brand-content">
            <span
              className="grid size-4 place-items-center rounded-[5px] text-white"
              style={{ background: sc.chip.color }}
            >
              <Play className="size-2.5 fill-current" strokeWidth={0} />
            </span>
            {sc.chip.label}
          </span>
        )}
        <span className="whitespace-pre">{text}</span>
        <span className="-ml-1.5 h-[18px] w-0.5 shrink-0 animate-caret rounded-full bg-brand-content" />
      </div>
      <span
        className={cx(
          "hidden h-7 shrink-0 items-center rounded-md border border-black/10 px-2 text-xs text-muted-foreground transition-opacity duration-200 sm:inline-flex",
          hint ? "opacity-100" : "opacity-0",
        )}
      >
        {hint ?? "Tab: Search"}
      </span>
    </div>
  );
}

export function CommandBarDemo() {
  const [ref, onScreen] = useOnScreen<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [si, setSi] = useState(0);
  const [n, setN] = useState(SCENARIOS[0].actions.length);
  const [shown, setShown] = useState(true);
  const [hl, setHl] = useState(SCENARIOS[0].highlights[0]);
  const siRef = useRef(0);

  useEffect(() => {
    if (!onScreen || reduced) return;
    let alive = true;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => alive && fn(), ms));
    };

    const run = (i: number) => {
      const sc = SCENARIOS[i];
      siRef.current = i;
      setSi(i);
      setN(0);
      setShown(false);
      setHl(sc.highlights[0]);
      let t = 450;
      sc.actions.forEach((a, k) => {
        t += a === "⇥" ? 380 : 62;
        at(t, () => setN(k + 1));
      });
      at(t + 160, () => setShown(true));
      at(t + 1300, () => setHl(sc.highlights[1]));
      at(t + 2700, () => setShown(false));
      at(t + 3100, () => run((i + 1) % SCENARIOS.length));
    };
    run(siRef.current);

    return () => {
      alive = false;
      timers.forEach(window.clearTimeout);
    };
  }, [onScreen, reduced]);

  const sc = SCENARIOS[si];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,#000_68%,transparent_97%)]"
    >
      <div className="flex h-full w-full flex-col gap-4 px-4 pt-4 md:flex-row md:items-start md:gap-10 md:pt-0 md:pr-8 md:pl-0">
        <div className="shrink-0 md:mt-12 md:w-80">
          <div
            key={si}
            className="inline-block max-w-full animate-fade-up rounded-2xl bg-muted px-5 py-4 text-[17px] leading-6 font-medium text-ink md:block"
          >
            {sc.bubble}
          </div>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-white shadow-[0_28px_64px_-16px_rgba(40,30,90,0.14),0_2px_6px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.07] md:mt-2">
          <SearchRow sc={sc} n={n} />
          <div className="h-px bg-black/[0.06]" />
          <div className="h-[280px] p-2">
            {sc.rows.map((row, i) => (
              <ResultRow key={`${si}-${i}`} row={row} index={i} shown={shown} active={i === hl} action={sc.action} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
