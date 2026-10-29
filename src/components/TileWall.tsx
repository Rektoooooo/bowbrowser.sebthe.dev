import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Archive,
  BookOpen,
  Brush,
  Columns2,
  Command,
  Download,
  Eye,
  FolderHeart,
  Layers,
  LayoutGrid,
  Moon,
  NotebookPen,
  PanelLeft,
  PictureInPicture2,
  Puzzle,
  RefreshCw,
  Route,
  Shield,
  Sparkles,
  Star,
  SunMedium,
  Palette,
  Library,
  Keyboard,
} from "lucide-react";
import { cx } from "./layout";
import { useInView, useOnScreen, usePrefersReducedMotion } from "../lib/motion";

type Tile = { icon: LucideIcon; label: string; tint: string };

// Tints run through the icon's palette so the wall reads as one gradient from left to right.
const peach = "from-[#ffc9bd] via-[#f7b2b9] to-[#e7a6d6]";
const pink = "from-[#f9c2d6] via-[#e9a9dc] to-[#cf9cf2]";
const violet = "from-[#dcb8ff] via-[#c29af9] to-[#a59cfb]";
const blue = "from-[#c6c9ff] via-[#a3abfb] to-[#8199fb]";
const lilac = "from-[#efd7ff] via-[#d7c0fb] to-[#b9b6fb]";

const ROWS: Tile[][] = [
  [
    { icon: Star, label: "Favorites", tint: peach },
    { icon: Layers, label: "Spaces", tint: pink },
    { icon: FolderHeart, label: "Pinned folders", tint: violet },
    { icon: Command, label: "Command Bar", tint: blue },
    { icon: Columns2, label: "Split View", tint: lilac },
    { icon: Eye, label: "Peek", tint: peach },
    { icon: Archive, label: "Archive", tint: violet },
    { icon: Palette, label: "Themes", tint: pink },
  ],
  [
    { icon: PanelLeft, label: "Sidebar", tint: violet },
    { icon: AppWindow, label: "Little Windows", tint: blue },
    { icon: Brush, label: "Boosts", tint: peach },
    { icon: BookOpen, label: "Reader", tint: lilac },
    { icon: NotebookPen, label: "Notes", tint: pink },
    { icon: LayoutGrid, label: "Easels", tint: blue },
    { icon: PictureInPicture2, label: "Picture in picture", tint: violet },
    { icon: Puzzle, label: "Extensions", tint: peach },
    { icon: Route, label: "Air Traffic Control", tint: lilac },
  ],
  [
    { icon: Shield, label: "Privacy report", tint: blue },
    { icon: RefreshCw, label: "Sync", tint: pink },
    { icon: Download, label: "Import", tint: violet },
    { icon: Library, label: "Library", tint: peach },
    { icon: Keyboard, label: "Shortcuts", tint: lilac },
    { icon: SunMedium, label: "Light", tint: peach },
    { icon: Moon, label: "Dark", tint: blue },
    { icon: Sparkles, label: "Auto-archive", tint: pink },
  ],
];

function GlassTile({
  tile,
  shown,
  delay,
  className,
}: {
  tile: Tile;
  shown: boolean;
  delay: number;
  className?: string;
}) {
  const Icon = tile.icon;
  return (
    // Outer: the entrance (rises and settles with a little overshoot). Inner: the hover lift, kept on
    // its own element so the entrance delay never slows the hover down.
    <div
      className={cx("shrink-0", className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(56px) scale(0.86)",
        transition: "opacity 500ms ease-out, transform 900ms cubic-bezier(0.34, 1.45, 0.64, 1)",
        transitionDelay: shown ? `${delay}ms` : "0ms",
      }}
    >
      <div
        title={tile.label}
        className={cx(
          "relative flex aspect-[1.45] items-center justify-center rounded-[22%] bg-gradient-to-br ring-1 ring-white/60 transition-[translate,box-shadow] duration-300 ease-out-soft hover:-translate-y-1.5",
          "shadow-[0_10px_22px_-12px_rgba(110,80,200,0.5),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-6px_14px_rgba(120,90,220,0.16)]",
          "hover:shadow-[0_18px_28px_-12px_rgba(110,80,200,0.55),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-6px_14px_rgba(120,90,220,0.16)]",
          tile.tint,
        )}
      >
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/45 via-white/0 to-white/0" />
        <Icon
          className="relative size-[42%] text-white drop-shadow-[0_2px_3px_rgba(90,60,170,0.35)]"
          strokeWidth={2.1}
        />
      </div>
    </div>
  );
}

/**
 * Seconds for each row to drift by one full set of tiles. The back row moves slowest, so the wall has
 * depth; the phases keep the rows' columns from lining up.
 */
const DRIFT_S = [74, 62, 48];
const PHASE = [0, 0.37, 0.71];
/** Each row repeats its tiles this many times and slides by one repeat, so the loop has no seam. */
const COPIES = 3;

/** Three rows of frosted tiles, one per thing Bow does, drifting slowly left and fading into the page. */
export function TileWall() {
  const [ref, seen] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const [screenRef, onScreen] = useOnScreen<HTMLDivElement>("200px");
  const reduced = usePrefersReducedMotion();
  const shown = seen || reduced;
  return (
    <div ref={ref} className="relative -mt-4 h-64 w-full overflow-hidden tiles-mask sm:h-72 lg:h-80" aria-hidden="true">
      <div
        ref={screenRef}
        className="absolute inset-0 flex flex-col justify-center gap-3 sm:gap-4"
        style={{ transform: "perspective(1100px) rotateX(24deg) scale(1.08)", transformOrigin: "50% 100%" }}
      >
        {ROWS.map((row, r) => (
          <div
            key={r}
            className="flex w-max will-change-transform"
            style={
              reduced
                ? { transform: `translateX(${-PHASE[r] * 30}%)` }
                : {
                    animationName: "tile-drift",
                    animationDuration: `${DRIFT_S[r]}s`,
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationDelay: `${-DRIFT_S[r] * PHASE[r]}s`,
                    animationPlayState: onScreen ? "running" : "paused",
                  }
            }
          >
            {Array.from({ length: COPIES }, (_, copy) => (
              // The trailing padding equals the gap, so every repeat is exactly one step long.
              <div key={copy} className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4">
                {row.map((tile, c) => (
                  // Tiles rise in as a sweep from the left, back row first.
                  <GlassTile
                    key={tile.label}
                    tile={tile}
                    shown={shown}
                    delay={r * 90 + Math.min(copy * row.length + c, 14) * 45}
                    className="w-20 sm:w-24 lg:w-28"
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
