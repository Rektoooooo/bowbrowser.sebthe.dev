import { ExternalLink, Lock, X } from "lucide-react";
import { Bar, CardShell, MONO_COLORS as C, Mono, SURFACE, useStep } from "./parts";

export function PeekCard() {
  const { ref, step } = useStep(4, 1700, 1);
  const open = step >= 1;
  return (
    <CardShell
      rootRef={ref}
      wash={[
        "radial-gradient(110% 80% at 100% 0%, #fbc6b6 0%, transparent 60%)",
        "radial-gradient(90% 90% at 0% 70%, #f1b6dc 0%, transparent 65%)",
        "radial-gradient(70% 60% at 80% 100%, #e3c4fa 0%, transparent 70%)",
        "linear-gradient(140deg, #fde8df, #f9e0f1)",
      ].join(",")}
      streak={22}
      chip={<span>Peek</span>}
      top={66}
      width={304}
    >
      <div className={`relative h-[300px] rounded-t-2xl p-3.5 text-ink ${SURFACE}`}>
        <div className="flex items-center gap-2">
          <Mono c={C.violet} size={18}>
            N
          </Mono>
          <span className="text-[13px] font-semibold">Newsletter</span>
        </div>
        <div className="mt-3 text-[12px] leading-5 whitespace-nowrap text-ink/80">
          Read{" "}
          <span
            className={`rounded px-0.5 font-medium text-brand-content underline decoration-brand/50 underline-offset-2 transition-colors duration-500 ${open ? "bg-brand/25" : "bg-brand/10"}`}
          >
            the typography case study
          </span>{" "}
          →
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          <Bar w="88%" /> <Bar w="64%" />
        </div>
        <div
          className={`absolute inset-0 rounded-t-2xl bg-black/10 transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}
        />

        <div
          className="absolute top-[84px] left-3 z-10 w-[278px] overflow-hidden rounded-xl bg-white shadow-[0_24px_60px_-10px_rgba(40,30,80,0.45),0_4px_12px_rgba(40,30,80,0.12)] ring-1 ring-black/5 transition-all duration-700 ease-out-soft"
          style={{
            transformOrigin: "32% -30px",
            transform: open ? "scale(1) translateY(0)" : "scale(0.35) translateY(-10px)",
            opacity: open ? 1 : 0,
          }}
        >
          <div className="flex h-9 items-center gap-1.5 border-b border-black/5 bg-neutral-50 px-2 text-[12px] text-muted-foreground">
            <X size={12} strokeWidth={2} />
            <div className="flex min-w-0 flex-1 items-center gap-1 rounded-md bg-black/5 px-1.5 py-0.5">
              <Lock size={10} className="shrink-0" />
              <span className="truncate">fieldnotes.example/typography</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 font-medium whitespace-nowrap text-ink shadow-sm ring-1 ring-black/5">
              <ExternalLink size={11} /> Open as tab <span className="font-mono text-muted-foreground">⌘O</span>
            </span>
          </div>
          <div className="flex flex-col gap-2 p-3">
            <div className="h-16 rounded-lg bg-gradient-to-br from-[#cfe9dd] via-[#d9d3f8] to-[#f6cfe2]" />
            <div className="text-[13px] font-semibold">A case study in typography</div>
            <Bar w="95%" /> <Bar w="82%" /> <Bar w="65%" />
          </div>
        </div>
      </div>
    </CardShell>
  );
}
