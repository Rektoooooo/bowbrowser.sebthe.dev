import { useEffect, useState } from "react";
import { ArrowUpRight, Menu as MenuIcon, X } from "lucide-react";
import { Logo } from "./Logo";
import { DownloadButton } from "./DownloadButton";
import { MenuItem, MenuPanel, useMenu } from "./Menu";
import { Container, cx } from "./layout";
import { REPO, RELEASES } from "../lib/release";

type Link = { label: string; href: string };
type NavEntry = { label: string; href?: string; items?: Link[] };

export const NAV: NavEntry[] = [
  {
    label: "Features",
    items: [
      { label: "Sidebar and Spaces", href: "#sidebar" },
      { label: "Command Bar", href: "#command-bar" },
      { label: "Split View and Peek", href: "#split-view" },
      { label: "Privacy", href: "#privacy" },
    ],
  },
  { label: "Coming from Arc", href: "#arc" },
  {
    label: "Resources",
    items: [
      { label: "Release notes", href: RELEASES },
      { label: "Keyboard shortcuts", href: "#shortcuts" },
      { label: "Build from source", href: `${REPO}#build-it-yourself` },
      { label: "Contributing", href: `${REPO}/blob/main/CONTRIBUTING.md` },
    ],
  },
  { label: "GitHub", href: REPO },
];

function NavDropdown({ entry }: { entry: NavEntry }) {
  const menu = useMenu<HTMLLIElement>({ hover: true });
  return (
    <li {...menu.rootProps} className="relative">
      <button
        type="button"
        {...menu.triggerProps}
        className="flex h-9 items-center px-0.5 text-sm font-medium text-ink transition-colors hover:text-ink/60"
      >
        {entry.label}
      </button>
      <MenuPanel id={menu.panelId} open={menu.open} align="start" className="-ml-2.5 min-w-44">
        {entry.items!.map((item) => (
          <MenuItem key={item.label} href={item.href} onSelect={() => menu.setOpen(false)}>
            {item.label}
          </MenuItem>
        ))}
      </MenuPanel>
    </li>
  );
}

function NavLinks() {
  return (
    <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 whitespace-nowrap lg:flex xl:gap-10">
      {NAV.map((entry) =>
        entry.items ? (
          <NavDropdown key={entry.label} entry={entry} />
        ) : (
          <li key={entry.label}>
            <a
              href={entry.href}
              {...(entry.href!.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              className="flex h-9 items-center px-0.5 text-sm font-medium text-ink transition-colors hover:text-ink/60"
            >
              {entry.label}
            </a>
          </li>
        ),
      )}
    </ul>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex animate-fade-up flex-col bg-white [animation-duration:0.25s] lg:hidden"
    >
      <div className="flex h-14 items-center justify-between px-6">
        <Logo />
        <button type="button" onClick={onClose} aria-label="Close menu" className="-mr-2 p-2">
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-6 pt-4 pb-10">
        {NAV.map((entry) => (
          <div key={entry.label} className="border-b border-black/6 py-4">
            {entry.items ? (
              <>
                <p className="mb-2 text-sm font-medium text-muted-foreground">{entry.label}</p>
                <ul className="space-y-1">
                  {entry.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} onClick={onClose} className="block py-1.5 font-display text-xl font-medium">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <a
                href={entry.href}
                onClick={onClose}
                {...(entry.href!.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="flex items-center gap-1 font-display text-xl font-medium"
              >
                {entry.label}
                {entry.href!.startsWith("http") && <ArrowUpRight className="size-4 text-ink/50" />}
              </a>
            )}
          </div>
        ))}
        <DownloadButton size="lg" align="start" className="mt-8" />
      </nav>
    </div>
  );
}

function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <Logo />
      <NavLinks />
      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <DownloadButton size="sm" />
        </div>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="-mr-2 p-2 lg:hidden"
        >
          <MenuIcon className="size-5.5" strokeWidth={1.75} />
        </button>
      </div>
      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </>
  );
}

/** The nav that lives inside the hero card, on top of the sky. */
export function HeroNav() {
  return (
    <nav aria-label="Main" className="relative z-30 flex h-14 items-center justify-between px-4 font-display sm:px-5">
      <NavBar />
    </nav>
  );
}

/**
 * The white nav that takes over once the hero card has scrolled away. It overlaps the last 56px
 * of the hero (so it adds no gap) and stays invisible until it is actually stuck to the top.
 */
export function StickyNav({ heroId = "top" }: { heroId?: string }) {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      rootMargin: "-56px 0px 0px 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  return (
    <nav
      aria-label="Main"
      aria-hidden={!stuck}
      inert={!stuck}
      className={cx(
        "sticky top-0 z-50 -mt-14 w-full border-b border-black/6 bg-white/90 font-display backdrop-blur-xl transition-[opacity,transform] duration-200",
        stuck ? "opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      <Container className="relative flex h-14 items-center justify-between gap-4">
        <NavBar />
      </Container>
    </nav>
  );
}
