import { useEffect, useState } from "react";
import { ChevronDown, Palette } from "lucide-react";
import { cx } from "../components/layout";
import { useOnScreen, usePrefersReducedMotion } from "../lib/motion";
import { MiniPage } from "./boost/MiniPage";

const SWATCHES = ["#f9b6a8", "#e6a6d6", "#c08cf8", "#8199fb", "#8fd9c0", "#f6d98b"];
const STEP = 40; // swatch 28px + 12px gap
// The ring is 36px around a 28px swatch in a 36px-tall row: 4px out on each side, so left -4px and top 0.
const CYCLE_MS = 2800;
const CLICK_DELAY_MS = 850;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")";

function Cursor({ index, clickKey }: { index: number; clickKey: number }) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-10 transition-transform duration-700 ease-[cubic-bezier(0.45,0,0.2,1)]"
      style={{ transform: `translate(${index * STEP + 15}px, 17px)` }}
    >
      <svg
        key={clickKey}
        width="22"
        height="24"
        viewBox="0 0 22 24"
        className="origin-top-left drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]"
      >
        <path
          d="M2 2l15 8.2-6.4 1.9L8.1 19 2 2z"
          fill="#fff"
          stroke="#16181b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex h-11 items-center justify-between border-t border-white/[0.07] px-4">
      <span className="text-[13px] text-white/60">{label}</span>
      {children}
    </div>
  );
}

export function BoostPanel() {
  const [ref, onScreen] = useOnScreen<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [cursor, setCursor] = useState(0);
  const [sel, setSel] = useState(0);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (!onScreen || reduced) return;
    let alive = true;
    const timers: number[] = [];
    let next = sel;
    const step = () => {
      next = (next + 1) % SWATCHES.length;
      const target = next;
      setCursor(target);
      timers.push(
        window.setTimeout(() => {
          if (!alive) return;
          setSel(target);
          setClicks((c) => c + 1);
        }, CLICK_DELAY_MS),
      );
    };
    const first = window.setTimeout(() => {
      step();
      timers.push(window.setInterval(step, CYCLE_MS));
    }, 1000);
    timers.push(first);
    return () => {
      alive = false;
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onScreen, reduced]);

  const accent = SWATCHES[sel];

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 55% at 15% 5%, rgba(192,140,248,0.5), transparent 70%), radial-gradient(60% 50% at 90% 95%, rgba(249,182,168,0.38), transparent 70%), radial-gradient(40% 30% at 90% 12%, rgba(129,153,251,0.14), transparent 70%)",
        }}
      />
      {/* dot texture */}
      <div
        className="absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_45%,#000,transparent)] opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1.2px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* grain */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />

      {/* page preview peeking below the card */}
      <div className="absolute bottom-0 left-1/2 h-[154px] w-[440px] max-w-[calc(100%-32px)] -translate-x-1/2 overflow-hidden rounded-t-2xl shadow-[0_-12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/15">
        <MiniPage accent={accent} />
      </div>

      {/* editor card */}
      <div className="absolute top-8 left-1/2 w-[368px] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-2xl bg-white/[0.08] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.65)] ring-1 ring-white/12 backdrop-blur-xl">
        <div className="flex h-12 items-center gap-2.5 px-4">
          <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-bow-violet to-bow-peach text-[#2a2230]">
            <Palette className="size-3.5" strokeWidth={2.25} />
          </span>
          <span className="text-[13px] font-medium text-white">Boost</span>
          <span className="text-[13px] text-white/35">·</span>
          <span className="truncate text-[13px] text-white/60">designweekly.example</span>
        </div>

        <Row label="Color">
          <div className="relative h-9">
            <div
              className="absolute top-0 -left-[4px] size-9 rounded-full border-2 border-white transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${sel * STEP}px)` }}
            />
            <div className="flex h-9 items-center gap-3">
              {SWATCHES.map((c, i) => (
                <span
                  key={c}
                  className={cx(
                    "block size-7 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] transition-transform duration-300",
                    i === sel && "scale-90",
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
            <Cursor index={cursor} clickKey={clicks} />
          </div>
        </Row>
        <Row label="Font">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-white/10 pr-2 pl-3 font-serif text-[13px] text-white ring-1 ring-white/10">
            Serif
            <ChevronDown className="size-3.5 text-white/60" strokeWidth={2.25} />
          </span>
        </Row>
        <Row label="Zap elements">
          <span className="relative h-5 w-9 rounded-full bg-brand ring-1 ring-white/20">
            <span className="absolute top-0.5 right-0.5 size-4 rounded-full bg-white shadow-sm" />
          </span>
        </Row>

        <div className="border-t border-white/[0.07] p-3">
          <pre className="m-0 rounded-lg bg-black/30 px-3 py-2.5 font-mono text-xs leading-5 text-white/50 ring-1 ring-white/[0.06]">
            <span className="text-[#c9a7ff]">body</span> {"{ "}
            <span className="text-[#8fb4ff]">background</span>: <span className="text-[#ffc2b4]">#fff7f2</span>
            {" }"}
            {"\n"}
            <span className="text-[#c9a7ff]">a</span> {"{ "}
            <span className="text-[#8fb4ff]">color</span>: <span className="text-[#ffc2b4]">{accent}</span>
            {" }"}
            {"\n"}
            <span className="text-[#c9a7ff]">h1</span> {"{ "}
            <span className="text-[#8fb4ff]">font-family</span>: <span className="text-[#ffc2b4]">serif</span>
            {" }"}
          </pre>
        </div>
      </div>
    </div>
  );
}
