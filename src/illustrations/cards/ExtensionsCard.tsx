import { Highlighter, KeyRound, Languages, Palette, Puzzle, ShieldCheck, type LucideIcon } from "lucide-react";
import { BowMark } from "../../components/Logo";
import { usePrefersReducedMotion, useOnScreen } from "../../lib/motion";
import { CardStage } from "./privacy-parts";

const ICONS: LucideIcon[] = [Puzzle, KeyRound, ShieldCheck, Palette, Languages, Highlighter];
const SIZE = 244;
const RADIUS = 102;
const TILE = 38;

/** Six generic extension tiles on a dashed ring around Bow's mark; the ring turns slowly. */
export function ExtensionsCard() {
  const reduced = usePrefersReducedMotion();
  const [ref, onScreen] = useOnScreen<HTMLDivElement>();
  const spin = !reduced;
  const state = onScreen ? "running" : "paused";
  const anim = (reverse: boolean): React.CSSProperties =>
    spin
      ? {
          animation: "bow-ring-spin 90s linear infinite",
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: state,
        }
      : {};
  return (
    <div ref={ref} className="absolute inset-0">
      <CardStage>
        <style>{"@keyframes bow-ring-spin{to{transform:rotate(360deg)}}"}</style>
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <div className="absolute inset-0" style={anim(false)}>
            <div
              className="absolute rounded-full border border-dashed border-black/20"
              style={{ inset: SIZE / 2 - RADIUS }}
            />
            {ICONS.map((Icon, i) => {
              const a = (i / ICONS.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <span
                  key={i}
                  className="absolute flex items-center justify-center rounded-[11px] border border-black/8 bg-white text-ink/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.12)]"
                  style={{
                    width: TILE,
                    height: TILE,
                    left: SIZE / 2 + Math.cos(a) * RADIUS - TILE / 2,
                    top: SIZE / 2 + Math.sin(a) * RADIUS - TILE / 2,
                    ...anim(true),
                  }}
                >
                  <Icon className="size-[18px]" strokeWidth={1.6} />
                </span>
              );
            })}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[18px] shadow-[0_8px_24px_-8px_rgba(91,72,217,0.35)]">
            <BowMark className="size-16" />
          </div>
        </div>
      </CardStage>
    </div>
  );
}
