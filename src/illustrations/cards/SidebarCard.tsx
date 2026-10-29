import { BookOpen, Compass, FolderOpen, Home, Newspaper, Palette, Plus } from "lucide-react";
import { CardShell, Keys, Mono, MONO_COLORS as C, useStep } from "./parts";

const TODAY = [
  { name: "Recipes", c: C.peach, l: "R" },
  { name: "Docs", c: C.blue, l: "D" },
  { name: "Typography – Wiki", c: C.violet, l: "T" },
];
const FAVS = [BookOpen, Palette, Newspaper, Compass];
const ROW = 28;

export function SidebarCard() {
  const { ref, step } = useStep(3, 2200, 1);
  return (
    <CardShell
      rootRef={ref}
      wash={[
        "radial-gradient(120% 80% at 0% 0%, #fcd3c8 0%, transparent 60%)",
        "radial-gradient(90% 90% at 100% 30%, #d9bcf9 0%, transparent 65%)",
        "radial-gradient(80% 70% at 30% 100%, #f1b9df 0%, transparent 70%)",
        "linear-gradient(160deg, #fde6e0, #ece0fb)",
      ].join(",")}
      streak={-24}
      chip={
        <>
          <Keys>⌘S</Keys>
          <span>Toggle sidebar</span>
        </>
      }
      top={60}
      width={248}
    >
      <div className="rounded-t-2xl bg-[#dfe6fb]/80 p-2.5 text-[12px] text-ink shadow-[0_10px_30px_-8px_rgba(40,30,80,0.2)] ring-1 ring-black/5 backdrop-blur-md">
        <div className="grid grid-cols-4 gap-1.5">
          {FAVS.map((Icon, i) => (
            <div key={i} className="grid h-8 place-items-center rounded-xl bg-white/85 shadow-sm ring-1 ring-black/5">
              <Icon size={16} strokeWidth={1.8} className="text-ink/70" />
            </div>
          ))}
        </div>
        <div className="mt-2 flex h-5 items-center gap-1.5 px-1 text-[11px] font-semibold text-muted-foreground">
          <Home size={12} strokeWidth={2} /> Personal
        </div>
        <div className="flex h-[26px] items-center gap-2 px-1.5 font-medium">
          <FolderOpen size={14} strokeWidth={1.8} className="text-ink/60" /> Reading
        </div>
        <div className="ml-4 border-l border-black/10 pl-1.5">
          <div className="flex h-[26px] items-center gap-2 px-1.5">
            <Mono c={C.pink}>D</Mono>Design Weekly
          </div>
          <div className="flex h-[26px] items-center gap-2 px-1.5">
            <Mono c={C.mint}>F</Mono>Field notes
          </div>
        </div>
        <div className="my-1 h-px bg-black/10" />
        <div className="flex h-[26px] items-center gap-2 px-1.5 text-muted-foreground">
          <Plus size={14} strokeWidth={1.8} /> New Tab
        </div>
        <div className="relative mt-0.5">
          <div
            className="absolute inset-x-0 top-0 h-[26px] rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-700 ease-out-soft"
            style={{ transform: `translateY(${step * ROW}px)` }}
          />
          {TODAY.map((t, i) => (
            <div
              key={t.name}
              className="relative flex items-center gap-2 px-1.5 whitespace-nowrap"
              style={{ height: 26, marginBottom: 2 }}
            >
              <Mono c={t.c}>{t.l}</Mono>
              <span className={`transition-colors duration-500 ${i === step ? "font-medium text-ink" : "text-ink/70"}`}>
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}
