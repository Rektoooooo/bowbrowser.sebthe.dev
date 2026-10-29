import { Briefcase, Home, Rocket, UserRound } from "lucide-react";
import type { ComponentType } from "react";
import { CardShell, Keys, Mono, MONO_COLORS as C, useStep } from "./parts";

type Space = {
  name: string;
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  bg: string;
  rows: [string, string, string][];
};
const SPACES: Space[] = [
  {
    name: "Personal",
    Icon: Home,
    bg: "#e4dafb",
    rows: [
      ["Notes", C.mint, "N"],
      ["Reading", C.pink, "R"],
      ["Recipes", C.peach, "C"],
    ],
  },
  {
    name: "Work",
    Icon: Briefcase,
    bg: "#d3e0fc",
    rows: [
      ["Docs", C.blue, "D"],
      ["Tasks", C.violet, "T"],
      ["Inbox", C.amber, "I"],
    ],
  },
  {
    name: "Projects",
    Icon: Rocket,
    bg: "#d1f1e5",
    rows: [
      ["Ideas", C.mint, "I"],
      ["Mockups", C.pink, "M"],
    ],
  },
];

export function SpacesCard() {
  const { ref, step } = useStep(3, 2200, 0);
  return (
    <CardShell
      rootRef={ref}
      wash={[
        "radial-gradient(100% 80% at 100% 0%, #bfeee6 0%, transparent 60%)",
        "radial-gradient(90% 90% at 0% 40%, #b9c9fb 0%, transparent 65%)",
        "radial-gradient(70% 60% at 70% 100%, #d9c8fa 0%, transparent 70%)",
        "linear-gradient(200deg, #e2f6f3, #dfe6fc)",
      ].join(",")}
      streak={18}
      chip={<Keys>⌃1 · ⌃2 · ⌃3</Keys>}
      top={74}
      width={300}
    >
      <div className="flex items-start gap-1.5">
        {SPACES.map((s, i) => {
          const on = i === step;
          return (
            <div
              key={s.name}
              className={`h-[260px] min-w-0 flex-1 overflow-visible rounded-xl p-2 text-[12px] text-ink transition-all duration-700 ease-out-soft ${
                on
                  ? "-translate-y-2 shadow-[0_14px_30px_-8px_rgba(40,30,80,0.3)] ring-2 ring-white"
                  : "shadow-sm ring-1 ring-black/5"
              }`}
              style={{ background: s.bg }}
            >
              <div className="flex items-center gap-1.5 px-0.5 font-semibold">
                <s.Icon size={13} strokeWidth={2} />
                <span className="truncate">{s.name}</span>
              </div>
              <div className="mt-1.5 mb-2 inline-flex items-center gap-1 rounded-full bg-white/60 px-1.5 py-0.5 text-[12px] font-medium text-muted-foreground">
                <UserRound size={9} strokeWidth={2.2} /> Default
              </div>
              {s.rows.map(([name, c, l]) => (
                <div key={name} className="flex h-7 items-center gap-1.5 rounded-lg px-1 whitespace-nowrap">
                  <Mono c={c} size={15}>
                    {l}
                  </Mono>
                  <span className="truncate">{name}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}
