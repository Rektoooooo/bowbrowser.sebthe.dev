import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Archive,
  Briefcase,
  CornerDownLeft,
  Folder,
  FolderOpen,
  Home,
  Link2,
  PanelLeft,
  Plus,
  Search,
  X,
} from "lucide-react";
import { usePrefersReducedMotion } from "../../lib/motion";
import { PeekPage, RecipesPage, RoadmapPage, SiteIcon, Toolbar, WikiPage } from "./pages";

/** Design size of the hero window illustration; the hero scales it to fit. */
export const WINDOW_WIDTH = 1272;
export const WINDOW_HEIGHT = 720;

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

type S = {
  cmd: boolean;
  q: string;
  hl: number;
  enter: boolean;
  split: boolean;
  peek: boolean;
  space: 0 | 1;
  scroll: boolean;
  cursor: { x: number; y: number };
  cursorOn: boolean;
  down: boolean;
  /** The tagged element the cursor is resting on; it shows its hover state. */
  hot: string | null;
  origin: { x: number; y: number };
};

const INITIAL: S = {
  cmd: false,
  q: "",
  hl: 0,
  enter: false,
  split: false,
  peek: false,
  space: 0,
  scroll: false,
  cursor: { x: 880, y: 330 },
  cursorOn: true,
  down: false,
  hot: null,
  origin: { x: 380, y: 140 },
};

/** Finds a `data-cursor` element and returns a point on it in window coordinates. */
type Env = { point: (name: string, fx?: number, fy?: number) => { x: number; y: number } | null };
type Patch = Partial<S> | ((env: Env) => Partial<S>);

const QUERY = "split";
const typed = QUERY.split("").map((_, i): [number, Patch] => [4300 + i * 140, { q: QUERY.slice(0, i + 1), hl: 0 }]);

/** Content region origin inside the window, and the peek card box inside that region. */
const REGION = { x: 232, y: 8 };
const PEEK = { x: 136, y: 52, w: 760, h: 484 };

/** The arrow's tip sits 2px inside the cursor's box. */
const TIP = 2;
/** Matches the cursor's transition, so a click never starts before the cursor has arrived. */
const MOVE_MS = 900;

/** Moves the cursor so its tip lands on a tagged element (fx, fy: where on it, 0-1). */
const moveTo =
  (name: string, fx = 0.5, fy = 0.5, extra: Partial<S> = {}): Patch =>
  (env) => {
    const p = env.point(name, fx, fy);
    return p ? { cursor: { x: p.x - TIP, y: p.y - TIP }, ...extra } : extra;
  };

/**
 * Moves to an element, shows its hover state on arrival, presses, and applies `effect` on release.
 * Every element is measured when the move starts, after the layout it sits in has settled.
 */
function click(t: number, name: string, fx: number, fy: number, effect: Patch, extra: Partial<S> = {}) {
  const entries: [number, Patch][] = [
    [t, moveTo(name, fx, fy, extra)],
    [t + MOVE_MS - 60, { hot: name }],
    [t + MOVE_MS + 160, { down: true }],
    [
      t + MOVE_MS + 310,
      (env) => ({ down: false, hot: null, ...(typeof effect === "function" ? effect(env) : effect) }),
    ],
  ];
  return entries;
}

/** Peek grows out of the link that opened it. */
const peekFromLink: Patch = (env) => {
  const l = env.point("peek-link");
  return { peek: true, ...(l ? { origin: { x: l.x - REGION.x - PEEK.x, y: l.y - REGION.y - PEEK.y } } : {}) };
};

const TIMELINE: [number, Patch][] = [
  // 1. Browsing: the page scrolls under the resting cursor.
  [600, { cursor: { x: 930, y: 360 }, scroll: true }],
  [2300, { cursor: { x: 1040, y: 250 } }],
  // 2. Command Bar, all from the keyboard: ⌘T, "split", ↓ ↓, Return.
  [3500, { cursorOn: false, cmd: true }],
  ...typed,
  [5500, { hl: 1 }],
  [5900, { hl: 2 }],
  [6600, { enter: true }],
  // 3. Split View opens (the new pane has slid in by 7600), the cursor reads the recipe, then closes its pane.
  [6900, { cmd: false, enter: false, split: true }],
  [7850, moveTo("recipe-title", 0.32, 0.55, { cursorOn: true })],
  ...click(9000, "pane-close", 0.5, 0.5, { split: false }),
  // 4. Peek, once the single page has settled (about 11000): open the link, look, close it.
  ...click(11250, "peek-link", 0.42, 0.55, peekFromLink),
  ...click(13850, "peek-close", 0.5, 0.5, { peek: false }),
  // 5. Switch to Work with the Space dots, point at a card, switch back.
  ...click(15400, "dot-personal-1", 0.5, 0.5, { space: 1, scroll: false }),
  [17900, moveTo("roadmap-card", 0.55, 0.5)],
  [17900 + MOVE_MS - 60, { hot: "roadmap-card" }],
  [19300, { hot: null }],
  ...click(19300, "dot-work-0", 0.5, 0.5, { space: 0 }),
  [21000, { cursor: INITIAL.cursor }],
];
const LOOP_MS = 22200;

/* ------------------------------------------------------------------ */
/* Sidebar pieces                                                      */
/* ------------------------------------------------------------------ */

function Row({
  icon,
  label,
  active,
  indent,
  children,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  indent?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-8 items-center gap-2.5 rounded-lg px-2 text-[13px] ${indent ? "ml-[22px]" : ""} ${
        active
          ? "bg-white text-neutral-900 shadow-[0_1px_3px_rgba(50,40,110,0.14),0_0_0_0.5px_rgba(50,40,110,0.06)]"
          : "text-neutral-700"
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
      {children}
    </div>
  );
}

/** Space name and its dots; clicking a dot switches Space. `hot` is the dot under the cursor. */
function SpaceHeader({
  icon,
  name,
  active,
  hot,
}: {
  icon: ReactNode;
  name: string;
  active: 0 | 1;
  hot: string | null;
}) {
  const id = name.toLowerCase();
  return (
    <div className="flex h-8 items-center gap-2.5 px-2 text-[13px] text-neutral-500">
      {icon}
      <span>{name}</span>
      <span className="ml-auto flex items-center gap-1">
        {[0, 1].map((i) => (
          <span
            key={i}
            data-cursor={`dot-${id}-${i}`}
            className={`h-[5px] rounded-full transition-[background-color,scale] duration-150 ${
              i === active ? "w-3 bg-neutral-500/70" : "w-[5px] bg-neutral-400/50"
            } ${hot === `dot-${id}-${i}` ? "scale-150 bg-neutral-600!" : ""}`}
          />
        ))}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="mx-2 my-2 h-px bg-black/[0.08]" />;
}

function NewTab() {
  return (
    <div className="flex h-8 items-center gap-2.5 px-2 text-[13px] text-neutral-500">
      <Plus size={16} strokeWidth={1.8} className="text-neutral-400" />
      New Tab
    </div>
  );
}

function PersonalSpace({ split, hot }: { split: boolean; hot: string | null }) {
  return (
    <div className="w-[232px] shrink-0 px-3">
      <SpaceHeader
        icon={<Home size={15} strokeWidth={1.8} className="text-neutral-500" />}
        name="Personal"
        active={0}
        hot={hot}
      />
      <div className="mt-1 flex flex-col gap-0.5">
        <Row icon={<FolderOpen size={16} strokeWidth={1.8} className="text-neutral-600" />} label="Reading" />
        <Row indent icon={<SiteIcon k="weekly" />} label="Design Weekly" />
        <Row indent icon={<SiteIcon k="notes" />} label="Field notes" />
        <Row indent icon={<SiteIcon k="long" />} label="Long reads" />
        <Row icon={<SiteIcon k="docs" />} label="Docs" />
      </div>
      <Divider />
      <NewTab />
      <div className="mt-0.5 flex flex-col gap-0.5">
        <div className="relative h-8">
          <div
            className={`absolute inset-0 flex items-center gap-2.5 rounded-lg bg-white px-2 text-[13px] text-neutral-900 shadow-[0_1px_3px_rgba(50,40,110,0.14),0_0_0_0.5px_rgba(50,40,110,0.06)] transition-opacity duration-500 ${
              split ? "opacity-0" : "opacity-100"
            }`}
          >
            <SiteIcon k="wiki" />
            <span className="truncate">Typography – Wiki</span>
          </div>
          <div
            className={`absolute inset-0 flex items-stretch rounded-lg bg-white text-[13px] text-neutral-900 shadow-[0_1px_3px_rgba(50,40,110,0.14),0_0_0_0.5px_rgba(50,40,110,0.06)] transition-opacity duration-500 ${
              split ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 pr-1.5 pl-2">
              <SiteIcon k="wiki" />
              <span className="truncate">Typography</span>
            </div>
            <div className="my-1.5 w-px bg-black/10" />
            <div className="flex min-w-0 flex-1 items-center gap-2 pr-1.5 pl-2 text-neutral-600">
              <SiteIcon k="recipes" />
              <span className="truncate">Slow-roasted pasta</span>
            </div>
          </div>
        </div>
        {/* In Split View this tab is the right half of the row above, so it leaves the list. */}
        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            split ? "-mb-0.5 grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <Row icon={<SiteIcon k="recipes" />} label="Slow-roasted pasta" />
          </div>
        </div>
        <Row icon={<SiteIcon k="mood" />} label="Studio moodboard" />
      </div>
    </div>
  );
}

function WorkSpace({ hot }: { hot: string | null }) {
  return (
    <div className="w-[232px] shrink-0 px-3">
      <SpaceHeader
        icon={<Briefcase size={15} strokeWidth={1.8} className="text-neutral-500" />}
        name="Work"
        active={1}
        hot={hot}
      />
      <div className="mt-1 flex flex-col gap-0.5">
        <Row icon={<Folder size={16} strokeWidth={1.8} className="text-neutral-600" />} label="Sprint 42" />
        <Row icon={<FolderOpen size={16} strokeWidth={1.8} className="text-neutral-600" />} label="Handbook" />
        <Row indent icon={<SiteIcon k="specs" />} label="Design specs" />
        <Row indent icon={<SiteIcon k="docs" />} label="Release notes" />
        <Row indent icon={<SiteIcon k="standup" />} label="Standup notes" />
      </div>
      <Divider />
      <NewTab />
      <div className="mt-0.5 flex flex-col gap-0.5">
        <Row active icon={<SiteIcon k="roadmap" />} label="Roadmap – Q4" />
        <Row icon={<SiteIcon k="prs" />} label="Pull requests" />
        <Row icon={<SiteIcon k="cal" />} label="Team calendar" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Command Bar                                                         */
/* ------------------------------------------------------------------ */

type Result = { icon: string; title: string; sub: string; pill: string; section?: string };

const DEFAULT_RESULTS: Result[] = [
  { icon: "wiki", title: "Typography – Wiki", sub: "wikilite.example", pill: "Switch to Tab", section: "Open Tabs" },
  { icon: "recipes", title: "Slow-roasted tomato pasta", sub: "kitchen.example", pill: "Switch to Tab" },
  { icon: "mood", title: "Studio moodboard", sub: "moodboard.example", pill: "Switch to Tab" },
  { icon: "weekly", title: "Design Weekly", sub: "designweekly.example", pill: "Open", section: "History" },
];

const SPLIT_RESULTS: Result[] = [
  {
    icon: "weekly",
    title: "Split-screen layouts – Design Weekly",
    sub: "designweekly.example",
    pill: "Switch to Tab",
    section: "Open Tabs",
  },
  {
    icon: "docs",
    title: "Splitting text columns – Docs",
    sub: "docs.example/columns",
    pill: "Open",
    section: "History",
  },
  {
    icon: "split",
    title: "Split View with Slow-roasted pasta",
    sub: "Arrange both tabs side by side",
    pill: "Split View",
    section: "Actions",
  },
  { icon: "docs", title: "Search the web for “split”", sub: "", pill: "Search" },
];

function CommandBar({ open, q, hl, enter }: { open: boolean; q: string; hl: number; enter: boolean }) {
  const results = q ? SPLIT_RESULTS : DEFAULT_RESULTS;
  return (
    <div
      className={`absolute top-[84px] left-[196px] z-20 w-[640px] origin-top rounded-2xl bg-white shadow-[0_24px_70px_-12px_rgba(40,30,110,0.35),0_0_0_1px_rgba(40,30,110,0.07)] transition-[opacity,transform] duration-300 ease-out ${
        open ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"
      }`}
    >
      <div className="flex h-14 items-center gap-3 border-b border-black/[0.06] px-5">
        <Search size={18} strokeWidth={1.8} className="text-neutral-400" />
        <div className="flex items-center text-[17px] text-neutral-900">
          {q || <span className="text-neutral-400">Search or enter URL…</span>}
          {q && <span className="bow-caret ml-px h-5 w-[1.5px] bg-neutral-900" />}
        </div>
        <span className="ml-auto rounded-md bg-neutral-100 px-1.5 py-0.5 font-sans text-[11.5px] text-neutral-500">
          ⌘T
        </span>
      </div>
      <div key={q ? "q" : "e"} className="bow-rise p-2 pb-2.5">
        {results.map((r, i) => {
          const on = i === hl;
          return (
            <div key={r.title}>
              {r.section && (
                <div
                  className={`px-3 pb-1 text-[11.5px] font-medium text-neutral-400 ${i === 0 ? "pt-1.5" : "pt-2.5"}`}
                >
                  {r.section}
                </div>
              )}
              <div
                className={`flex h-11 items-center gap-3 rounded-xl px-3 transition-colors duration-200 ${on ? "bg-[#efecfd]" : ""}`}
              >
                <SiteIcon k={r.icon} size={22} />
                <span className="truncate text-[14px] text-neutral-900">{r.title}</span>
                {r.sub && <span className="truncate text-[13px] text-neutral-400">{r.sub}</span>}
                <span
                  className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-medium whitespace-nowrap transition-[opacity,transform,background-color,color] duration-200 ${
                    on ? "opacity-100" : "opacity-0"
                  } ${enter && on ? "scale-95 bg-[#6d54e8] text-white" : "bg-white/80 text-neutral-600 shadow-[0_0_0_1px_rgba(40,30,110,0.1)]"}`}
                >
                  {r.pill}
                  <CornerDownLeft size={12} strokeWidth={2} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Peek                                                                */
/* ------------------------------------------------------------------ */

function Peek({ open, origin, hot }: { open: boolean; origin: { x: number; y: number }; hot: boolean }) {
  return (
    <div
      className={`absolute z-20 flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-10px_rgba(30,20,90,0.45),0_0_0_1px_rgba(30,20,90,0.08)] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "scale-100 opacity-100" : "scale-[0.55] opacity-0"
      }`}
      style={{
        left: PEEK.x,
        top: PEEK.y,
        width: PEEK.w,
        height: PEEK.h,
        transformOrigin: `${origin.x}px ${origin.y}px`,
      }}
    >
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-black/[0.06] bg-neutral-50/80 pr-2.5 pl-4">
        <div className="flex items-center gap-1.5 text-[13px] text-neutral-500">
          <Link2 size={13} strokeWidth={2} className="text-neutral-400" />
          wikilite.example/Type_design
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-700 shadow-[0_0_0_1px_rgba(30,20,90,0.1)]">
            Open as tab
            <span className="font-sans text-[11.5px] text-neutral-400">⌘O</span>
          </span>
          <span
            data-cursor="peek-close"
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-150 ${
              hot ? "bg-black/[0.07] text-neutral-800" : "text-neutral-500"
            }`}
          >
            <X size={16} strokeWidth={1.8} />
          </span>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <PeekPage />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cursor                                                              */
/* ------------------------------------------------------------------ */

function Cursor({ x, y, on, down }: { x: number; y: number; on: boolean; down: boolean }) {
  // A new ring for every press, centred on the arrow's tip.
  const [presses, setPresses] = useState(0);
  useEffect(() => {
    if (down) setPresses((n) => n + 1);
  }, [down]);
  return (
    <div
      className="absolute top-0 left-0 z-30"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        opacity: on ? 1 : 0,
        // Moves at the pace MOVE_MS assumes; hides quickly when the keyboard takes over.
        transition: `transform ${MOVE_MS}ms cubic-bezier(0.45, 0, 0.2, 1), opacity 300ms ease-out`,
      }}
    >
      {presses > 0 && (
        <span
          key={presses}
          className="bow-press pointer-events-none absolute size-7 rounded-full border-2 border-[#6d54e8]/70 bg-[#6d54e8]/10"
          style={{ left: TIP - 14, top: TIP - 14 }}
        />
      )}
      <svg
        width="20"
        height="24"
        viewBox="0 0 20 24"
        className={`origin-top-left transition-transform duration-150 ${down ? "scale-90" : "scale-100"}`}
        style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
      >
        <path
          d="M2 2 L2 18.5 L6.4 14.6 L9.3 21.2 L12.2 19.9 L9.3 13.4 L15.2 13.1 Z"
          fill="#111"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Window                                                              */
/* ------------------------------------------------------------------ */

const CARD =
  "overflow-hidden rounded-[10px] bg-white shadow-[0_1px_3px_rgba(40,30,110,0.08),0_0_0_1px_rgba(40,30,110,0.07)]";

export function BowWindow({ paused }: { paused: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [s, setS] = useState<S>(INITIAL);
  const [cycle, setCycle] = useState(0);
  const elapsed = useRef(0);
  const startedAt = useRef(0);
  const looped = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused || reduced) return;
    const env: Env = {
      // Measured live, so targets stay right whatever the page's layout or the hero's scale.
      point: (name, fx = 0.5, fy = 0.5) => {
        const root = rootRef.current;
        const el = root?.querySelector(`[data-cursor="${name}"]`);
        if (!root || !el) return null;
        const rr = root.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const k = rr.width / WINDOW_WIDTH || 1;
        return { x: (r.left - rr.left + r.width * fx) / k, y: (r.top - rr.top + r.height * fy) / k };
      },
    };
    startedAt.current = performance.now() - elapsed.current;
    const timers: number[] = [];
    for (const [t, patch] of TIMELINE) {
      if (t <= elapsed.current) continue;
      timers.push(
        window.setTimeout(
          () => setS((p) => ({ ...p, ...(typeof patch === "function" ? patch(env) : patch) })),
          t - elapsed.current,
        ),
      );
    }
    timers.push(
      window.setTimeout(() => {
        looped.current = true;
        setS(INITIAL);
        setCycle((c) => c + 1);
      }, LOOP_MS - elapsed.current),
    );
    return () => {
      timers.forEach(window.clearTimeout);
      if (looped.current) {
        looped.current = false;
        elapsed.current = 0;
      } else {
        elapsed.current = performance.now() - startedAt.current;
      }
    };
  }, [paused, reduced, cycle]);

  const personal = s.space === 0;
  const dim = s.cmd || s.peek;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden rounded-2xl font-sans text-neutral-800 antialiased shadow-[0_40px_100px_-20px_rgba(70,40,140,0.35),0_0_0_1px_rgba(255,255,255,0.7)]"
    >
      <style>{`
        @keyframes bow-blink{0%,45%{opacity:1}55%,100%{opacity:0}}
        @keyframes bow-rise{from{opacity:0.5;transform:translateY(2px)}to{opacity:1;transform:none}}
        .bow-caret{animation:bow-blink 1s steps(1) infinite}
        .bow-rise{animation:bow-rise 220ms ease-out both}
        @keyframes bow-press{from{opacity:1;transform:scale(0.35)}to{opacity:0;transform:scale(1.25)}}
        .bow-press{animation:bow-press 520ms cubic-bezier(0.22,1,0.36,1) both}
      `}</style>

      {/* Glass + Space tint. Only the sidebar column is blurred: the page cards cover the rest, and a
          window-sized backdrop blur made every animated frame re-blur 1272×720 pixels of sky. */}
      <div className="absolute inset-y-0 left-0 w-[232px] bg-white/40 backdrop-blur-2xl" />
      <div className="absolute inset-y-0 right-0 left-[232px] bg-white/40" />
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: personal ? 1 : 0,
          background: "linear-gradient(180deg, rgba(190,175,255,0.32) 0%, rgba(170,190,255,0.26) 100%)",
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: personal ? 0 : 1,
          background: "linear-gradient(180deg, rgba(255,184,160,0.40) 0%, rgba(246,168,214,0.30) 100%)",
        }}
      />

      {/* Sidebar */}
      <div className="absolute inset-y-0 left-0 w-[232px]">
        <div className="flex h-11 items-center justify-between pr-4 pl-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <PanelLeft size={17} strokeWidth={1.7} className="text-neutral-500" />
        </div>
        <div className="grid grid-cols-4 gap-1.5 px-3">
          {["wiki", "yarn", "cal", "play"].map((k) => (
            <div
              key={k}
              className="flex h-10 items-center justify-center rounded-xl bg-white/55 shadow-[0_0_0_0.5px_rgba(60,40,140,0.08)]"
            >
              <SiteIcon k={k} size={20} />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-[104px] overflow-hidden">
          <div
            className="flex w-[464px] transition-transform duration-[800ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ transform: `translateX(${personal ? 0 : -232}px)` }}
          >
            <PersonalSpace split={s.split} hot={s.hot} />
            <WorkSpace hot={s.hot} />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-3 flex h-8 items-center justify-between px-5 text-neutral-500">
          <Archive size={17} strokeWidth={1.7} />
          <div className="flex items-center gap-3">
            <Home size={15} strokeWidth={1.8} className={personal ? "text-neutral-700" : "text-neutral-400"} />
            <Briefcase size={15} strokeWidth={1.8} className={personal ? "text-neutral-400" : "text-neutral-700"} />
          </div>
          <Plus size={18} strokeWidth={1.7} />
        </div>
      </div>

      {/* Content region */}
      <div className="absolute top-2 right-2 bottom-2 left-[232px]">
        {/* Blank page under both Spaces and both layouts, so a Space switch or a layout swap fades through
            white instead of showing two pages at once. In Split View it is clipped to the left pane, so
            the gap between the panes stays clear. */}
        <div
          className={`${CARD} absolute inset-0 transition-[clip-path] duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)]`}
          style={{ clipPath: s.split ? "inset(0 calc(50% + 4px) 0 0 round 10px)" : "inset(0 0 0 0 round 10px)" }}
        />
        {/* Personal pages */}
        <div
          className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${
            personal
              ? "translate-x-0 opacity-100 delay-[120ms] !duration-500"
              : "-translate-x-3 opacity-0 !duration-300"
          }`}
        >
          {/* Both layouts keep fixed sizes and only fade and slide, so nothing moves through the layout:
              animating the column widths moved every toolbar and pane and counted as layout shift. One
              layout fades out before the other fades in, so the two pages never show at once. */}
          <div
            className={`${CARD} absolute inset-0 flex flex-col transition-opacity ${
              s.split ? "opacity-0 duration-150" : "opacity-100 delay-150 duration-[250ms]"
            }`}
          >
            <Toolbar url="wikilite.example/Typography" />
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <div
                className="h-full transition-transform duration-[2800ms] ease-in-out"
                style={{ transform: `translateY(${s.scroll ? -64 : 0}px)` }}
              >
                <WikiPage tagged hot={s.hot === "peek-link"} />
              </div>
            </div>
          </div>
          <div className="absolute inset-0">
            <div
              className={`${CARD} absolute inset-y-0 left-0 flex w-[calc(50%-4px)] flex-col transition-opacity ${
                s.split ? "opacity-100 delay-150 duration-[250ms]" : "opacity-0 duration-150"
              }`}
            >
              <Toolbar url="wikilite.example/Typography" />
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <div
                  className="h-full transition-transform duration-[2800ms] ease-in-out"
                  style={{ transform: `translateY(${s.scroll ? -64 : 0}px)` }}
                >
                  <WikiPage />
                </div>
              </div>
            </div>
            {/* The second tab slides in from the right, as it does in Bow. */}
            <div
              className={`${CARD} absolute inset-y-0 right-0 flex w-[calc(50%-4px)] flex-col transition-[opacity,translate] duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
                s.split ? "translate-x-0 opacity-100" : "translate-x-[45%] opacity-0"
              }`}
            >
              <Toolbar url="kitchen.example/tomato-pasta" close hot={s.hot === "pane-close"} />
              <div className="min-h-0 flex-1">
                <RecipesPage />
              </div>
            </div>
          </div>
        </div>

        {/* Work page */}
        <div
          className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${
            personal ? "translate-x-3 opacity-0 !duration-300" : "translate-x-0 opacity-100 delay-[120ms] !duration-500"
          }`}
        >
          <div className={`${CARD} flex h-full flex-col`}>
            <Toolbar url="work.example/roadmap-q4" />
            <div className="min-h-0 flex-1">
              <RoadmapPage hot={s.hot === "roadmap-card"} />
            </div>
          </div>
        </div>

        {/* Dim layer shared by Command Bar and Peek */}
        <div
          className={`absolute inset-0 z-10 rounded-[10px] bg-[#1a1440]/[0.07] transition-opacity duration-300 ${dim ? "opacity-100" : "opacity-0"}`}
        />
        <CommandBar open={s.cmd} q={s.q} hl={s.hl} enter={s.enter} />
        <Peek open={s.peek} origin={s.origin} hot={s.hot === "peek-close"} />
      </div>

      <Cursor x={s.cursor.x} y={s.cursor.y} on={s.cursorOn} down={s.down} />
    </div>
  );
}
