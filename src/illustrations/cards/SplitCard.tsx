import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Bar, CardShell, Keys, SURFACE, useStep } from "./parts";

const PANES = [
  { url: "fieldnotes.example", title: "Field notes", tint: "#cfe9dd" },
  { url: "designweekly.example", title: "Design Weekly", tint: "#f4cde3" },
  { url: "recipes.page", title: "Recipes", tint: "#fbd9c8" },
];

function Pane({ url, title, tint }: (typeof PANES)[number]) {
  return (
    <div className="flex h-[230px] w-full flex-col overflow-hidden rounded-lg bg-white ring-1 ring-black/5">
      <div className="flex h-6 shrink-0 items-center gap-1 border-b border-black/5 px-1.5 text-muted-foreground">
        <ChevronLeft size={10} /> <ChevronRight size={10} />
        <div className="ml-0.5 flex h-4 min-w-0 flex-1 items-center gap-1 rounded-md bg-black/5 px-1 text-[10.5px] text-ink/60">
          <Lock size={7} className="shrink-0" />
          <span className="truncate">{url}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <div className="truncate text-[12px] leading-4 font-semibold text-ink">{title}</div>
        <Bar w="90%" /> <Bar w="70%" />
        <div className="my-0.5 h-14 rounded-md" style={{ background: `linear-gradient(135deg, ${tint}, #fff)` }} />
        <Bar w="95%" /> <Bar w="80%" /> <Bar w="60%" />
      </div>
    </div>
  );
}

export function SplitCard() {
  const { ref, step } = useStep(2, 3000, 1);
  const three = step === 1;
  return (
    <CardShell
      rootRef={ref}
      wash={[
        "radial-gradient(100% 80% at 0% 100%, #bcc9fc 0%, transparent 60%)",
        "radial-gradient(90% 90% at 100% 0%, #dcbdf9 0%, transparent 62%)",
        "radial-gradient(60% 50% at 50% 40%, #f3cdea 0%, transparent 70%)",
        "linear-gradient(170deg, #e6e5fb, #efe1fa)",
      ].join(",")}
      streak={-14}
      chip={
        <>
          <Keys>⌃⇧=</Keys>
          <span>Split View</span>
        </>
      }
      top={64}
      width={316}
    >
      <div className={`rounded-t-2xl p-1.5 ${SURFACE} bg-white/60`}>
        <div className="flex h-5 items-center gap-1 px-1.5 pb-1">
          <span className="size-1.5 rounded-full bg-[#ff6b61]" />
          <span className="size-1.5 rounded-full bg-[#ffc04a]" />
          <span className="size-1.5 rounded-full bg-[#38d058]" />
        </div>
        <div className="flex gap-1.5">
          <div className="min-w-0 flex-1">
            <Pane {...PANES[0]} />
          </div>
          <div className="min-w-0 flex-1">
            <Pane {...PANES[1]} />
          </div>
          <div
            className="min-w-0 overflow-hidden transition-all duration-1000 ease-out-soft"
            style={{ flex: three ? "1 1 0%" : "0 0 0%", opacity: three ? 1 : 0, marginLeft: three ? 0 : -6 }}
          >
            <Pane {...PANES[2]} />
          </div>
        </div>
      </div>
    </CardShell>
  );
}
