import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  ArrowLeftRight,
  BookOpen,
  Columns2,
  Copy,
  EyeOff,
  Layers,
  Library,
  NotebookPen,
  PanelLeft,
  Pin,
  Plus,
  RotateCcw,
  Search,
  SquareArrowOutUpRight,
  Sparkles,
  SquareSplitHorizontal,
  SquareX,
  X,
} from "lucide-react";
import { Kbd } from "../components/typography";
import { cx } from "../components/layout";

type Row = { icon: LucideIcon; action: string; detail: string; keys: string[] };

// Taken from Bow's README ("Keyboard shortcuts").
const GROUPS: { label: string; short?: string; rows: Row[] }[] = [
  {
    label: "Tabs",
    rows: [
      { icon: Plus, action: "New tab", detail: "Opens the Command Bar", keys: ["⌘", "T"] },
      {
        icon: RotateCcw,
        action: "Reopen closed tab",
        detail: "Brings back what you just closed",
        keys: ["⇧", "⌘", "T"],
      },
      { icon: Pin, action: "Pin or unpin", detail: "Keeps a tab above the line", keys: ["⌘", "D"] },
      { icon: Search, action: "Search tabs", detail: "Find any open tab by name", keys: ["⇧", "⌘", "A"] },
      { icon: Sparkles, action: "Clear Today", detail: "Clears today's tabs in one go", keys: ["⇧", "⌘", "K"] },
    ],
  },
  {
    label: "Spaces",
    rows: [
      { icon: PanelLeft, action: "Toggle sidebar", detail: "For a full-width page", keys: ["⌘", "S"] },
      { icon: ArrowLeftRight, action: "Next Space", detail: "Or ⌥⌘← for the previous one", keys: ["⌥", "⌘", "→"] },
      { icon: Layers, action: "Go to Space", detail: "Jump straight to Space 1 to 9", keys: ["⌃", "1–9"] },
      { icon: NotebookPen, action: "New note", detail: "A rich-text note of your own", keys: ["⌃", "⌘", "N"] },
      { icon: Library, action: "Library", detail: "Media, downloads, archive and more", keys: ["⇧", "⌘", "L"] },
    ],
  },
  {
    label: "Split and Peek",
    short: "Split",
    rows: [
      { icon: Columns2, action: "Split view", detail: "Put two tabs side by side", keys: ["⌃", "⇧", "="] },
      { icon: SquareX, action: "Close pane", detail: "Back to a single page", keys: ["⌃", "⇧", "-"] },
      { icon: SquareSplitHorizontal, action: "Swap panes", detail: "Left becomes right", keys: ["⌃", "⌥", "⌘", "S"] },
      { icon: ArrowLeftRight, action: "Next pane", detail: "Move focus across the split", keys: ["⌃", "⌥", "⌘", "→"] },
      { icon: SquareArrowOutUpRight, action: "Keep a Peek", detail: "Turns the preview into a tab", keys: ["⌘", "O"] },
    ],
  },
  {
    label: "Windows",
    rows: [
      { icon: AppWindow, action: "Little Window", detail: "A small window for a quick look", keys: ["⌥", "⌘", "N"] },
      { icon: EyeOff, action: "Private window", detail: "Keeps nothing when you close it", keys: ["⇧", "⌘", "N"] },
      { icon: BookOpen, action: "Reader view", detail: "Just the article", keys: ["⌃", "⌘", "R"] },
      { icon: Copy, action: "Copy URL", detail: "Add ⌥ to copy it as Markdown", keys: ["⇧", "⌘", "C"] },
      { icon: X, action: "Close window", detail: "Windows reopen at the next start", keys: ["⇧", "⌘", "W"] },
    ],
  },
];

export function Shortcuts() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + GROUPS.length) % GROUPS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="flex w-full flex-col gap-6 md:gap-10">
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="order-1 text-sm"
      >
        <ul key={active}>
          {GROUPS[active].rows.map((row, i) => {
            const Icon = row.icon;
            return (
              <li
                key={row.action}
                className="flex h-14 animate-fade-up items-center gap-2.5 border-t border-black/8 last:border-b sm:gap-3"
                style={{ animationDelay: `${i * 45}ms`, animationDuration: "0.45s" }}
              >
                <Icon className="size-5 shrink-0 text-ink/80" strokeWidth={1.75} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium sm:text-base md:w-48 md:flex-none xl:text-lg">
                  {row.action}
                </span>
                <span className="hidden flex-1 truncate text-sm text-muted-foreground md:block xl:text-base">
                  {row.detail}
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-1" aria-label={row.keys.join(" ")}>
                  {row.keys.map((k, j) => (
                    <Kbd key={j} className="h-6 min-w-6 text-xs sm:h-7 sm:min-w-7 sm:text-sm">
                      {k}
                    </Kbd>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div
        role="tablist"
        aria-label="Shortcut groups"
        className="order-2 mx-auto scrollbar-none inline-flex w-fit max-w-full items-center overflow-x-auto rounded-2xl bg-muted p-1 text-muted-foreground"
      >
        {GROUPS.map((g, i) => (
          <button
            key={g.label}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
            className={cx(
              "h-8 rounded-xl px-2 text-[13px] font-medium whitespace-nowrap transition-colors max-[359px]:px-1.5 max-[359px]:text-[12px] sm:px-3 sm:text-sm",
              i === active ? "bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-ink/60 hover:text-ink",
            )}
          >
            {g.short ? (
              <>
                <span className="max-[389px]:hidden">{g.label}</span>
                <span className="min-[390px]:hidden">{g.short}</span>
              </>
            ) : (
              g.label
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
