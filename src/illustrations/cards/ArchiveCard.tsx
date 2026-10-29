import { Archive } from "lucide-react";
import { CardShell, MONO_COLORS as C, Mono, SURFACE, useStep } from "./parts";

const ROWS = [
  { name: "Docs", t: "2m", c: C.blue, l: "D" },
  { name: "Design Weekly", t: "3h", c: C.pink, l: "D" },
  { name: "Field notes", t: "12h", c: C.mint, l: "F" },
];

export function ArchiveCard() {
  // 0 idle, 1 sinking into the tray, 2 archived
  const { ref, step } = useStep(3, 1900, 0);
  const gone = step >= 1;
  return (
    <CardShell
      rootRef={ref}
      wash={[
        "radial-gradient(100% 80% at 0% 0%, #c9f0dc 0%, transparent 62%)",
        "radial-gradient(90% 80% at 100% 20%, #fde0cf 0%, transparent 65%)",
        "radial-gradient(80% 70% at 60% 100%, #f6c9dd 0%, transparent 70%)",
        "linear-gradient(150deg, #e4f7ee, #fdeee6)",
      ].join(",")}
      streak={-30}
      chip={<span>Unused for 12 hours</span>}
      top={68}
      width={272}
    >
      <div className={`rounded-t-2xl p-2.5 text-[12px] text-ink ${SURFACE}`}>
        <div className="px-1.5 pb-1.5 text-[11px] font-semibold text-muted-foreground">Today</div>
        <div className="relative">
          {ROWS.map((r, i) => {
            const last = i === ROWS.length - 1;
            return (
              <div
                key={r.name}
                className="flex h-8 items-center gap-2 rounded-lg px-1.5 whitespace-nowrap"
                style={
                  last
                    ? {
                        transform:
                          step === 1
                            ? "translateY(24px) scale(0.92)"
                            : step === 2
                              ? "translateY(24px) scale(0.92)"
                              : "none",
                        opacity: step === 0 ? 1 : 0,
                        transition:
                          step === 0
                            ? "opacity 700ms ease"
                            : "transform 900ms cubic-bezier(.22,1,.36,1), opacity 380ms ease",
                        background: "rgba(0,0,0,0.04)",
                      }
                    : undefined
                }
              >
                <Mono c={r.c}>{r.l}</Mono>
                <span className="flex-1">{r.name}</span>
                <span
                  className={`font-mono text-[11px] ${last ? "font-medium text-amber-600" : "text-muted-foreground"}`}
                >
                  {r.t}
                </span>
              </div>
            );
          })}
        </div>
        <div className="my-2 h-px bg-black/10" />
        <div
          className="flex h-9 items-center gap-2 rounded-lg px-2 font-medium transition-all duration-700"
          style={{ background: gone ? "rgba(139,123,247,0.14)" : "rgba(0,0,0,0.04)" }}
        >
          <Archive size={14} strokeWidth={1.9} className={gone ? "text-brand-content" : "text-ink/60"} />
          <span>Archive</span>
          <span className="ml-auto text-[11px] font-normal whitespace-nowrap text-muted-foreground">
            Archived · {gone ? 249 : 248} tabs
          </span>
        </div>
      </div>
    </CardShell>
  );
}
