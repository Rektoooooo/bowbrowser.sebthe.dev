import { ChevronRight, Hash, Lock, Mail, MessageCircle } from "lucide-react";
import { Bar, CardShell, MONO_COLORS as C, Mono, useStep } from "./parts";

export function LittleWindowCard() {
  const { ref, step } = useStep(6, 1800, 1);
  const up = step % 2 === 1;
  const pill = step >= 1;
  return (
    <CardShell
      rootRef={ref}
      wash={[
        "radial-gradient(100% 80% at 0% 0%, #b9d0fb 0%, transparent 60%)",
        "radial-gradient(90% 90% at 100% 60%, #cdb9f9 0%, transparent 65%)",
        "radial-gradient(70% 60% at 30% 100%, #bfeaf0 0%, transparent 70%)",
        "linear-gradient(160deg, #e0e9fc, #e9e0fb)",
      ].join(",")}
      streak={-18}
      chip={<span>Link from another app</span>}
      top={62}
      width={316}
    >
      <div className="relative h-[300px]">
        {/* The "other app": generic chat client, blurred. */}
        <div className="absolute inset-x-0 top-0 flex h-full overflow-hidden rounded-t-2xl bg-white/75 text-[12px] text-ink shadow-sm ring-1 ring-black/5 blur-[2.5px]">
          <div className="flex w-11 flex-col items-center gap-2 bg-[#6d5bd0]/85 py-2.5">
            <MessageCircle size={14} className="text-white" />
            <Mail size={14} className="text-white/60" />
            <Hash size={14} className="text-white/60" />
          </div>
          <div className="flex-1 space-y-2.5 p-3">
            <div className="flex items-center gap-2">
              <Mono c={C.pink} size={20}>
                A
              </Mono>
              <div className="space-y-1.5">
                <Bar w={70} />
                <Bar w={120} />
              </div>
            </div>
            <div className="ml-7 rounded-xl bg-neutral-100 px-2.5 py-1.5">
              Have you seen this?{" "}
              <span className="font-medium text-brand-content underline">designweekly.example/42</span>
            </div>
            <div className="flex items-center gap-2">
              <Mono c={C.mint} size={20}>
                M
              </Mono>
              <div className="space-y-1.5">
                <Bar w={90} />
                <Bar w={60} />
              </div>
            </div>
            <div className="ml-7 rounded-xl bg-neutral-100 px-2.5 py-1.5">
              <Bar w={110} />
            </div>
          </div>
        </div>

        {/* Little Window. Its "Open in Personal" button sits in its own toolbar, as in Bow. */}
        <div
          className="absolute top-[84px] left-[58px] w-[244px] transition-transform duration-[1800ms] ease-in-out"
          style={{ transform: `translateY(${up ? -4 : 5}px)` }}
        >
          <div className="overflow-hidden rounded-xl bg-white shadow-[0_24px_50px_-10px_rgba(40,30,80,0.5),0_4px_12px_rgba(40,30,80,0.15)] ring-1 ring-black/10">
            <div className="flex h-8 items-center gap-1.5 bg-[#dfe6fb] pr-1.5 pl-2.5">
              <span className="size-2 shrink-0 rounded-full bg-[#ff6b61]" />
              <span className="size-2 shrink-0 rounded-full bg-[#ffc04a]" />
              <span className="size-2 shrink-0 rounded-full bg-[#38d058]" />
              <div className="ml-1 flex h-5 min-w-0 flex-1 items-center gap-1 rounded-md bg-white/70 px-1.5 text-[10.5px] text-ink/70">
                <Lock size={9} className="shrink-0" /> <span className="truncate">designweekly.example/42</span>
              </div>
              <span
                className="inline-flex h-5 shrink-0 items-center gap-0.5 rounded-md bg-ink pr-1 pl-1.5 text-[10.5px] font-medium whitespace-nowrap text-white transition-[opacity,translate] duration-700 ease-out-soft"
                style={{ opacity: pill ? 1 : 0, translate: pill ? "0 0" : "4px 0" }}
              >
                Open in Personal <ChevronRight size={11} strokeWidth={2.4} />
              </span>
            </div>
            <div className="flex flex-col gap-2 p-3">
              <div className="text-[13px] leading-4 font-semibold">Design Weekly · Issue 42</div>
              <div className="h-14 rounded-lg bg-gradient-to-br from-[#f6cfe2] via-[#d9d3f8] to-[#c9dcfb]" />
              <Bar w="95%" /> <Bar w="80%" /> <Bar w="55%" />
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
