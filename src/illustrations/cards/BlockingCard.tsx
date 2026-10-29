import { useEffect, useState } from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { usePrefersReducedMotion, useOnScreen } from "../../lib/motion";
import { CardStage, Popover, Toggle } from "./privacy-parts";

const TARGET = 23;

/** Site popover: blocking is off by default; one switch and the tracker counter climbs. */
export function BlockingCard() {
  const reduced = usePrefersReducedMotion();
  const [ref, onScreen] = useOnScreen<HTMLDivElement>();
  const [on, setOn] = useState(reduced);
  const [count, setCount] = useState(reduced ? TARGET : 0);

  useEffect(() => {
    if (reduced) {
      setOn(true);
      setCount(TARGET);
      return;
    }
    if (!onScreen) return;
    const timers = new Set<number>();
    let tick = 0;
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const run = () => {
      setOn(false);
      setCount(0);
      later(() => setOn(true), 1500);
      later(() => {
        let n = 0;
        tick = window.setInterval(() => {
          n += 1;
          setCount(n);
          if (n >= TARGET) window.clearInterval(tick);
        }, 55);
      }, 1900);
      later(run, 7000);
    };
    run();
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.clearInterval(tick);
    };
  }, [onScreen, reduced]);

  return (
    <div ref={ref} className="absolute inset-0">
      <CardStage>
        <Popover className="w-[236px] p-1.5">
          <div className="flex items-center gap-2 px-2 pt-1 pb-2">
            <span className="size-4 rounded-[5px] bg-black/8" />
            <span className="font-medium">news-site.example</span>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg bg-black/5 px-2 py-2">
            <span>Block ads and trackers</span>
            <Toggle on={on} />
          </div>
          <div className="flex items-center justify-between px-2 pt-2.5 pb-1 text-muted-foreground">
            <span>Trackers blocked</span>
            <span className="font-mono text-[12px] text-ink tabular-nums">{count}</span>
          </div>
          <div className="mx-1 my-1.5 h-px bg-black/6" />
          <div className="flex items-center gap-2 px-2 pt-0.5 pb-1">
            <ShieldCheck className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            <span className="flex-1">Privacy report</span>
            <ChevronRight className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
          </div>
        </Popover>
      </CardStage>
    </div>
  );
}
