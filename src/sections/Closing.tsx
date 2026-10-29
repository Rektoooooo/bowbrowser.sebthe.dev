import { ArrowUpRight } from "lucide-react";
import { Container } from "../components/layout";
import { H2 } from "../components/typography";
import { Reveal } from "../components/Reveal";
import { DownloadButton } from "../components/DownloadButton";
import { NAV } from "../components/Nav";
import { REPO, RELEASES } from "../lib/release";

const DOT_MASK = "radial-gradient(50% 85% at 50% 100%, #000 15%, transparent 72%)";

export function Cta() {
  return (
    <div className="mx-auto w-full py-14 pb-0 sm:py-16 xl:py-24 xl:pb-0">
      <Container>
        <div className="relative isolate rounded-2xl px-4 py-16 text-center sm:px-8 sm:py-24 xl:py-32">
          {/* Background lives in its own clipped layer so the download menu can open past the banner. */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden rounded-2xl bg-[#f3f1ff]">
            <div
              className="absolute inset-0"
              style={{
                background: [
                  "radial-gradient(60% 75% at 50% 112%, #8b9dfc 0%, rgba(139,157,252,0.55) 38%, rgba(139,157,252,0) 72%)",
                  "radial-gradient(42% 60% at 18% 100%, rgba(249,182,168,0.9) 0%, rgba(249,182,168,0) 70%)",
                  "radial-gradient(42% 60% at 84% 100%, rgba(192,140,248,0.85) 0%, rgba(192,140,248,0) 70%)",
                  "linear-gradient(180deg, #f6f3ff 0%, #efe9ff 60%, #e9e3ff 100%)",
                ].join(","),
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-3/4 dot-grid"
              style={{ WebkitMaskImage: DOT_MASK, maskImage: DOT_MASK }}
            />
          </div>
          <Reveal className="mb-8 pt-4 sm:mb-10 sm:pt-8">
            <H2>
              Browse the way Arc taught you.
              <br />
              Start with Bow today.
            </H2>
          </Reveal>
          <DownloadButton size="lg" align="center" className="mx-auto" />
          <p className="mt-5 text-sm text-ink/55">Free · Apple silicon · macOS 13 or later</p>
        </div>
      </Container>
    </div>
  );
}

const external = { target: "_blank", rel: "noreferrer" } as const;

const FOOTER: { title: string; links: { label: string; href: string }[] }[] = [
  { title: "Features", links: NAV[0].items! },
  {
    title: "Coming from Arc",
    links: [
      { label: "Import your Spaces", href: "#arc" },
      { label: "Keyboard shortcuts", href: "#shortcuts" },
      { label: "How we studied Arc", href: `${REPO}/tree/main/docs/research` },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Release notes", href: RELEASES },
      { label: "Build from source", href: `${REPO}#build-it-yourself` },
      { label: "Sync between Macs", href: `${REPO}/blob/main/docs/sync.md` },
      { label: "Backups", href: `${REPO}/blob/main/docs/backup-format.md` },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: REPO },
      { label: "Contributing", href: `${REPO}/blob/main/CONTRIBUTING.md` },
      { label: "Report an issue", href: `${REPO}/issues` },
      { label: "Security", href: `${REPO}/blob/main/SECURITY.md` },
    ],
  },
];

function FooterLink({ href, children }: { href: string; children: string }) {
  const isExternal = href.startsWith("http");
  // Keep the arrow on the same line as the last word when the label wraps.
  const words = children.split(" ");
  const last = words.pop();
  return (
    <a
      href={href}
      {...(isExternal ? external : {})}
      className="decoration-muted-foreground decoration-dotted underline-offset-2 hover:text-muted-foreground hover:underline"
    >
      {words.length > 0 && `${words.join(" ")} `}
      <span className="whitespace-nowrap">
        {last}
        {isExternal && <ArrowUpRight className="ml-0.5 inline size-3.5 align-[-2px]" aria-hidden="true" />}
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="py-14 sm:py-16 xl:py-24">
      <Container className="pb-12 sm:pb-16 xl:pb-20">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:flex xl:flex-wrap xl:gap-x-3 xl:gap-y-6">
          {FOOTER.map((col) => (
            <li
              key={col.title}
              className="min-w-0 space-y-3 text-sm font-medium xl:max-w-60 xl:min-w-40 xl:shrink-0 xl:grow"
            >
              <p className="text-muted-foreground/80">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className="min-w-0 space-y-3 text-sm font-medium xl:max-w-60 xl:min-w-40 xl:shrink-0">
            <ul className="space-y-3">
              <li>
                <FooterLink href={`${REPO}/blob/main/LICENSE`}>MIT License</FooterLink>
              </li>
              <li>
                <FooterLink href={`${REPO}/blob/main/CODE_OF_CONDUCT.md`}>Code of Conduct</FooterLink>
              </li>
            </ul>
          </li>
        </ul>
      </Container>
      <Container>
        <div className="flex flex-col gap-4 border-t border-black/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground/80">
            © 2026 Bow contributors. Not affiliated with The Browser Company; Arc is their trademark.
          </p>
          <a href={REPO} {...external} aria-label="Bow on GitHub" className="text-ink/70 hover:text-ink">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </a>
        </div>
      </Container>
    </footer>
  );
}
