import { Lock } from "lucide-react";
import { CardStage, Popover, Toggle } from "./privacy-parts";

/** Address bar with a lock above a two-toggle settings list, stacked like layers. */
export function HttpsCard() {
  return (
    <CardStage>
      <div className="relative w-[236px]">
        <Popover className="flex h-8 items-center gap-1.5 rounded-full px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <Lock className="size-3 shrink-0" strokeWidth={2.25} />
          <span className="font-mono text-[11.5px]">
            <span className="text-ink">https://</span>
            <span className="text-muted-foreground">example.com</span>
          </span>
        </Popover>
        <div className="relative mt-3">
          <div className="absolute inset-x-3 -bottom-2 h-full rounded-xl border border-black/6 bg-white/70" />
          <Popover className="relative p-1.5">
            <div className="px-2 pt-1 pb-1.5 text-[11px] text-muted-foreground">Privacy</div>
            <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-2">
              <span>HTTPS-Only Mode</span>
              <Toggle on />
            </div>
            <div className="mx-1 h-px bg-black/6" />
            <div className="flex items-center justify-between gap-3 px-2 py-2">
              <span className="min-w-0">
                Forget site data on quit
                <span className="block text-[11px] text-muted-foreground">Profile: Personal</span>
              </span>
              <Toggle on />
            </div>
          </Popover>
        </div>
      </div>
    </CardStage>
  );
}
