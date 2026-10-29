import { Archive, Code2, Download, HardDrive, History } from "lucide-react";
import { cx } from "./layout";
import { MenuItem, MenuPanel, useMenu } from "./Menu";
import { REPO, RELEASES, useRelease } from "../lib/release";

const sizes = {
  sm: { group: "h-9 rounded-[14px] text-sm", main: "pr-3 pl-3", chevron: "w-9", label: "Download", icon: false },
  md: {
    group: "h-10 rounded-2xl text-base",
    main: "pr-3.5 pl-3",
    chevron: "w-10",
    label: "Download for macOS",
    icon: true,
  },
  lg: {
    group: "h-11 rounded-2xl text-base",
    main: "pr-4 pl-3.5",
    chevron: "w-11",
    label: "Download for macOS",
    icon: true,
  },
} as const;

/** Black split button: the main part downloads the DMG, the chevron opens the other options. */
export function DownloadButton({
  size = "md",
  align = "end",
  label,
  className,
}: {
  size?: keyof typeof sizes;
  align?: "start" | "end" | "center";
  label?: string;
  className?: string;
}) {
  const release = useRelease();
  const menu = useMenu();
  const s = sizes[size];

  return (
    <div {...menu.rootProps} className={cx("relative w-fit", className)}>
      <div
        role="group"
        aria-label="Download Bow"
        className={cx(
          "flex items-stretch overflow-hidden bg-ink font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-150 ease-out active:scale-[0.98]",
          s.group,
        )}
      >
        <a
          href={release.dmg}
          className={cx(
            "flex items-center gap-2 rounded-l-[inherit] whitespace-nowrap transition-colors hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white/70 focus-visible:outline-solid",
            s.main,
          )}
          aria-label={`Download ${release.version ? `Bow ${release.version}` : "the latest Bow"} for macOS (Apple silicon)`}
        >
          {s.icon && <Download className="size-4" strokeWidth={2.25} aria-hidden="true" />}
          {label ??
            (s.icon ? (
              // "for macOS" goes on the smallest phones, where the full label would not fit on one line.
              <span>
                Download<span className="max-[359px]:hidden"> for macOS</span>
              </span>
            ) : (
              s.label
            ))}
        </a>
        <span aria-hidden="true" className="my-2 w-px bg-white/20" />
        <button
          type="button"
          {...menu.triggerProps}
          aria-label="Choose download format"
          className={cx(
            "flex items-center justify-center rounded-r-[inherit] transition-colors hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white/70 focus-visible:outline-solid",
            s.chevron,
          )}
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className={cx("size-3.5 transition-transform duration-200", menu.open && "rotate-180")}
          >
            <path
              d="m4.5 6.5 3.5 3.5 3.5-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <MenuPanel id={menu.panelId} open={menu.open} align={align} className="w-72 text-left">
        <MenuItem href={release.dmg} icon={<HardDrive className="size-4" />} hint="Apple silicon">
          macOS disk image
        </MenuItem>
        <MenuItem href={release.zip} icon={<Archive className="size-4" />} hint=".zip">
          macOS archive
        </MenuItem>
        <div className="mx-2.5 my-1 h-px bg-black/6" />
        <MenuItem
          href={release.notes}
          icon={<History className="size-4" />}
          hint={release.version ? `v${release.version}` : undefined}
        >
          Release notes
        </MenuItem>
        <MenuItem href={RELEASES} icon={<Download className="size-4" />}>
          All releases
        </MenuItem>
        <MenuItem href={`${REPO}#build-it-yourself`} icon={<Code2 className="size-4" />}>
          Build from source
        </MenuItem>
        <p className="px-2.5 pt-1.5 pb-1 text-xs leading-4 text-muted-foreground">
          Macs with Apple silicon, macOS 13 or later.
        </p>
      </MenuPanel>
    </div>
  );
}
