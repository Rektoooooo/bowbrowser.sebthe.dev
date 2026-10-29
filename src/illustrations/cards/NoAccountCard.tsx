import { Check, Folder, RefreshCw } from "lucide-react";
import { CardStage, Popover } from "./privacy-parts";

/** Sync settings popover: no account, just a folder you choose. */
export function NoAccountCard() {
  return (
    <CardStage>
      <Popover className="w-[232px] p-1.5">
        <div className="flex items-center justify-between px-2 pt-1 pb-1.5">
          <span className="text-[13px] font-medium">Sync</span>
          <RefreshCw className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-black/5 px-2 py-2">
          <Folder className="size-4 shrink-0" strokeWidth={1.75} />
          <span className="min-w-0 flex-1 truncate">
            iCloud Drive <span className="text-muted-foreground">›</span> Bow
          </span>
          <Check className="size-3.5 shrink-0" strokeWidth={2.25} />
        </div>
        <div className="mt-0.5 flex items-center gap-2 px-2 py-2 text-muted-foreground">
          <Folder className="size-4 shrink-0" strokeWidth={1.75} />
          <span className="flex-1">Dropbox</span>
        </div>
        <div className="mx-1 my-1 h-px bg-black/6" />
        <div className="px-2 pt-1 pb-1.5 text-[11px] text-muted-foreground">Last synced 2 min ago</div>
      </Popover>
    </CardStage>
  );
}
