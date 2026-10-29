import type { ReactNode } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Columns2,
  FileText,
  GitPullRequest,
  Link2,
  Milestone,
  PanelRight,
  X,
  Play,
  RotateCw,
  UtensilsCrossed,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Site icons: monograms and lucide glyphs, never third-party logos.   */
/* ------------------------------------------------------------------ */

type IconSpec = { bg: string; fg: string; node: (s: number) => ReactNode; serif?: boolean; ring?: boolean };
const letter = (l: string) => (s: number) => <span style={{ fontSize: s * 0.6, lineHeight: 1 }}>{l}</span>;
const glyph = (G: typeof Calendar) => (s: number) => <G size={s * 0.62} strokeWidth={2.2} />;

const ICONS: Record<string, IconSpec> = {
  wiki: { bg: "#ffffff", fg: "#1c1c1f", node: letter("W"), serif: true, ring: true },
  yarn: { bg: "#ff7a1a", fg: "#fff", node: letter("Y") },
  cal: { bg: "#ffffff", fg: "#ef4444", node: glyph(Calendar), ring: true },
  play: { bg: "#ef4444", fg: "#fff", node: glyph(Play) },
  weekly: { bg: "#6366f1", fg: "#fff", node: letter("D") },
  notes: { bg: "#10b981", fg: "#fff", node: letter("F") },
  recipes: { bg: "#fb7185", fg: "#fff", node: glyph(UtensilsCrossed) },
  docs: { bg: "#0ea5e9", fg: "#fff", node: glyph(FileText) },
  long: { bg: "#14b8a6", fg: "#fff", node: letter("L") },
  roadmap: { bg: "#8b5cf6", fg: "#fff", node: glyph(Milestone) },
  prs: { bg: "#27272a", fg: "#fff", node: glyph(GitPullRequest) },
  standup: { bg: "#f59e0b", fg: "#fff", node: glyph(Coffee) },
  split: { bg: "#ede9fe", fg: "#6d54e8", node: glyph(Columns2) },
  mood: { bg: "#f472b6", fg: "#fff", node: letter("M") },
  specs: { bg: "#3b82f6", fg: "#fff", node: letter("S") },
};

export function SiteIcon({ k, size = 16 }: { k: string; size?: number }) {
  const i = ICONS[k] ?? ICONS.docs;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center font-semibold"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: i.bg,
        color: i.fg,
        fontFamily: i.serif ? "Georgia, 'Times New Roman', serif" : undefined,
        boxShadow: i.ring ? "inset 0 0 0 1px rgba(20,20,40,0.12)" : undefined,
      }}
    >
      {i.node(size)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Browser toolbar                                                     */
/* ------------------------------------------------------------------ */

/**
 * A page's toolbar. In Split View a pane also gets a close button (`close`); `hot` gives it the hover
 * state while the cursor is on it.
 */
export function Toolbar({
  url,
  back = false,
  close = false,
  hot = false,
}: {
  url: string;
  back?: boolean;
  close?: boolean;
  hot?: boolean;
}) {
  return (
    <div className="relative flex h-11 shrink-0 items-center justify-between border-b border-black/[0.05] px-3.5">
      <div className="flex items-center gap-3.5 text-neutral-400">
        <ChevronLeft size={17} strokeWidth={1.8} className={back ? "text-neutral-500" : "opacity-50"} />
        <ChevronRight size={17} strokeWidth={1.8} className="opacity-50" />
        <RotateCw size={14} strokeWidth={1.8} className="text-neutral-500" />
      </div>
      <div className="absolute inset-x-24 flex items-center justify-center gap-1.5 text-[13px] text-neutral-500">
        <Link2 size={13} strokeWidth={2} className="shrink-0 text-neutral-400" />
        <span className="truncate">{url}</span>
      </div>
      <div className="flex items-center gap-3 text-neutral-400">
        <PanelRight size={15} strokeWidth={1.8} />
        <Columns2 size={15} strokeWidth={1.8} />
        {close && (
          <span
            data-cursor="pane-close"
            className={`-mr-1.5 flex size-6 items-center justify-center rounded-md transition-colors duration-150 ${
              hot ? "bg-black/[0.07] text-neutral-700" : "text-neutral-400"
            }`}
          >
            <X size={14} strokeWidth={2} />
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page building blocks                                                */
/* ------------------------------------------------------------------ */

function Bars({ w, gap = "gap-2.5", tone = "bg-neutral-200/80" }: { w: number[]; gap?: string; tone?: string }) {
  return (
    <div className={`flex flex-col ${gap}`}>
      {w.map((x, i) => (
        <div key={i} className={`h-2 rounded-full ${tone}`} style={{ width: `${x}%` }} />
      ))}
    </div>
  );
}

const serif = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

/**
 * Article page in the style of a small wiki. "Type design" is the link the cursor opens in Peek;
 * `tagged` marks the copy whose link the cursor aims at (Split View shows a second copy).
 */
export function WikiPage({ hot = false, tagged = false }: { hot?: boolean; tagged?: boolean }) {
  return (
    <div className="@container relative h-full overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b border-black/[0.05] px-8 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[20px] text-neutral-900" style={serif}>
            Wikilite
          </span>
          <span className="text-[11.5px] text-neutral-400">free reference</span>
        </div>
        <div className="flex h-8 w-[220px] items-center rounded-md border border-neutral-200 px-3 text-[12px] text-neutral-400">
          Search Wikilite
        </div>
      </div>
      <div className="relative mx-auto w-[440px] pt-10">
        <div className="absolute top-10 -left-[248px] hidden w-[180px] opacity-0 transition-opacity duration-500 @[700px]:block @[700px]:opacity-100">
          <div className="mb-3 text-[12px] font-semibold text-neutral-800">Contents</div>
          <div className="space-y-2.5 text-[12px] text-[#4f46e5]/80">
            {["Etymology", "History", "Text typefaces", "Display graphics", "Techniques", "See also"].map((t, i) => (
              <div key={t} className={i === 1 || i === 3 ? "pl-0" : "pl-0"}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <h1 className="text-[40px] leading-[44px] tracking-[-0.01em] text-neutral-900" style={serif}>
          Typography
        </h1>
        <div className="mt-2 border-t border-neutral-200 pt-2 text-[12px] text-neutral-500">
          From Wikilite, the free reference
        </div>
        <div className="mt-5 flex items-center gap-2 text-[12.5px] whitespace-nowrap text-neutral-500">
          Related
          <span
            data-cursor={tagged ? "peek-link" : undefined}
            className={`rounded-md px-2 py-1 font-medium text-[#4f46e5] underline-offset-2 transition-colors duration-150 ${
              hot ? "bg-[#dfe3ff] underline" : "bg-[#eef0ff]"
            }`}
          >
            Type design
          </span>
          <span className="rounded-md bg-[#eef0ff] px-2 py-1 font-medium text-[#4f46e5]">Letterforms</span>
          <span className="rounded-md bg-[#eef0ff] px-2 py-1 font-medium text-[#4f46e5]">Kerning</span>
        </div>
        <div className="mt-6">
          <Bars w={[100, 96, 100, 88, 100, 62]} gap="gap-3" />
        </div>
        <div
          className="mt-7 h-[170px] rounded-xl"
          style={{ background: "linear-gradient(135deg,#f7e6c4 0%,#f3c7a6 45%,#d9b7ef 100%)" }}
        >
          <div
            className="flex h-full items-center justify-center text-[56px] tracking-[0.2em] text-white/80"
            style={serif}
          >
            ABC
          </div>
        </div>
        <div className="mt-3 w-2/5">
          <Bars w={[100]} />
        </div>
        <h2 className="mt-8 text-[22px] text-neutral-900" style={serif}>
          History
        </h2>
        <div className="mt-4">
          <Bars w={[100, 94, 100, 72]} gap="gap-3" />
        </div>
      </div>
    </div>
  );
}

export function RecipesPage() {
  return (
    <div className="h-full overflow-hidden bg-white">
      <div className="mx-auto w-[440px] pt-8">
        <div
          className="h-[190px] rounded-2xl"
          style={{ background: "linear-gradient(140deg,#ffd9c7 0%,#fca5a5 50%,#f9a8d4 100%)" }}
        />
        <div className="mt-6 text-[11.5px] font-medium tracking-[0.08em] text-rose-500 uppercase">Weeknight</div>
        <h1
          data-cursor="recipe-title"
          className="mt-1.5 text-[28px] leading-8 font-semibold tracking-[-0.02em] text-neutral-900"
        >
          Slow-roasted tomato pasta
        </h1>
        <div className="mt-3 flex gap-2 text-[12px] text-neutral-500">
          {["35 min", "Serves 4", "Vegetarian"].map((t) => (
            <span key={t} className="rounded-full bg-neutral-100 px-2.5 py-1">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <Bars w={[100, 92, 100, 70]} gap="gap-3" />
        </div>
        <div className="mt-6 text-[15px] font-semibold text-neutral-900">Ingredients</div>
        <div className="mt-3 space-y-3">
          {[70, 55, 62, 48].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="h-3.5 w-3.5 rounded-full border border-neutral-300" />
              <div className="h-2 rounded-full bg-neutral-200/80" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Body shown inside the Peek card. */
export function PeekPage() {
  return (
    <div className="h-full overflow-hidden bg-white">
      <div className="mx-auto w-[520px] pt-8">
        <h1 className="text-[34px] leading-10 tracking-[-0.01em] text-neutral-900" style={serif}>
          Type design
        </h1>
        <div className="mt-2 border-t border-neutral-200 pt-2 text-[12px] text-neutral-500">
          From Wikilite, the free reference
        </div>
        <div className="mt-5 flex gap-5">
          <div className="flex-1">
            <Bars w={[100, 94, 100, 90, 100, 76, 100, 52]} gap="gap-3" />
          </div>
          <div
            className="h-[150px] w-[190px] shrink-0 rounded-lg"
            style={{ background: "linear-gradient(160deg,#dbeafe,#c4b5fd 60%,#fbcfe8)" }}
          />
        </div>
        <div className="mt-6">
          <Bars w={[100, 88, 100, 64]} gap="gap-3" />
        </div>
      </div>
    </div>
  );
}

/** Q4 roadmap board. `hot` lifts the first "In progress" card, the one the cursor points at. */
export function RoadmapPage({ hot = false }: { hot?: boolean }) {
  const cols = [
    { t: "Planned", c: "bg-sky-100 text-sky-700", n: 3 },
    { t: "In progress", c: "bg-amber-100 text-amber-700", n: 3 },
    { t: "Shipped", c: "bg-emerald-100 text-emerald-700", n: 2 },
  ];
  return (
    <div className="h-full overflow-hidden bg-white">
      <div className="mx-auto w-[900px] pt-9">
        <div className="text-[11.5px] font-medium tracking-[0.08em] text-orange-500 uppercase">Q4 planning</div>
        <h1 className="mt-2 text-[34px] leading-10 font-semibold tracking-[-0.025em] text-neutral-900">Roadmap</h1>
        <div className="mt-4 w-[46%]">
          <Bars w={[100, 82]} gap="gap-3" />
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
          {cols.map((c, ci) => (
            <div key={c.t} className="rounded-xl bg-neutral-50 p-3">
              <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${c.c}`}>{c.t}</span>
              <div className="mt-3 space-y-2.5">
                {Array.from({ length: c.n }).map((_, i) => (
                  <div
                    key={i}
                    data-cursor={ci === 1 && i === 0 ? "roadmap-card" : undefined}
                    className={`rounded-lg bg-white p-3 transition-[translate,box-shadow] duration-200 ${
                      hot && ci === 1 && i === 0
                        ? "-translate-y-0.5 shadow-[0_6px_16px_-4px_rgba(40,30,110,0.18),0_0_0_1.5px_rgba(109,84,232,0.45)]"
                        : "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    <div
                      className="h-2 rounded-full bg-neutral-300/80"
                      style={{ width: `${70 - ((i + ci) % 3) * 12}%` }}
                    />
                    <div
                      className="mt-2.5 h-2 rounded-full bg-neutral-200/70"
                      style={{ width: `${90 - ((i * 2 + ci) % 3) * 14}%` }}
                    />
                    <div className="mt-3 flex gap-1.5">
                      <span className="h-4 w-4 rounded-full bg-gradient-to-br from-orange-200 to-pink-300" />
                      <span className="h-4 w-4 rounded-full bg-gradient-to-br from-indigo-200 to-violet-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
