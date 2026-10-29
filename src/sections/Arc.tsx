import { Rail, Section } from "../components/layout";
import { Reveal } from "../components/Reveal";
import { Eyebrow, H2, H3, InlineLink, Kbd, Lead } from "../components/typography";
import { CardRow, FeatureCard } from "../components/cards";
import { TileWall } from "../components/TileWall";
import { Shortcuts } from "./Shortcuts";
import { REPO } from "../lib/release";
import { SidebarCard } from "../illustrations/cards/SidebarCard";
import { SpacesCard } from "../illustrations/cards/SpacesCard";
import { ArchiveCard } from "../illustrations/cards/ArchiveCard";
import { CommandBarDemo } from "../illustrations/CommandBarDemo";

/** Import from Arc, the sidebar, keyboard shortcuts and the Command Bar: one long band, like a chapter. */
export function Arc() {
  return (
    <Section id="arc">
      <div className="bg-linear-to-b from-neutral-50 to-white">
        <Rail className="pb-6!">
          <Reveal className="text-center">
            <Eyebrow href={`${REPO}#install`} className="mb-6">
              Coming from Arc
            </Eyebrow>
            <H2>
              Everything you set up in Arc,
              <br className="max-sm:hidden" /> moves into Bow with you.
            </H2>
          </Reveal>
        </Rail>
        <Rail pad="none">
          <TileWall />
        </Rail>
      </div>

      <Rail className="px-6 py-16! sm:px-8 md:px-24 md:py-24! lg:px-48 xl:px-66">
        <Reveal>
          <p className="text-base text-ink xl:text-lg">
            <span className="font-medium">File › Import from Arc…</span> reads Arc&rsquo;s files on your Mac, read-only,
            and brings over your Spaces, Favorites, pinned folders and tabs, Today tabs, Space themes and your newest
            250 archived tabs. Coming from somewhere else? Bow imports from Chrome, Brave, Edge, Vivaldi, Firefox and
            Safari too.
          </p>
        </Reveal>
      </Rail>

      <div id="sidebar" className="border-x border-black/6 pb-16 md:pb-24">
        <CardRow>
          <FeatureCard title="Sidebar" art={<SidebarCard />} index={0}>
            Favorites up top, pinned folders below, and today&rsquo;s tabs under the line.
          </FeatureCard>
          <FeatureCard title="Spaces" art={<SpacesCard />} artWidth={300} artMinScale={0.78} index={1}>
            Each Space has its own icon, theme, pinned tabs and profile, with logins kept apart.
          </FeatureCard>
          <FeatureCard title="Auto-archive" art={<ArchiveCard />} index={2}>
            Tabs you haven&rsquo;t used in 12 hours move to the archive. Pinned tabs and Favorites never do.
          </FeatureCard>
        </CardRow>
      </div>

      <div id="shortcuts" className="border-t border-dashed border-black/8">
        <Rail pad="narrow" className="pb-10">
          <Reveal className="space-y-3">
            <H3>Made for the keyboard.</H3>
            <Lead>
              Every action in Bow has a shortcut, and <Kbd className="align-[2px]">⌘</Kbd>{" "}
              <Kbd className="align-[2px]">/</Kbd> shows all of them. These are the ones you&rsquo;ll use every day.{" "}
              <InlineLink href={`${REPO}#keyboard-shortcuts`}>See them all</InlineLink>
            </Lead>
          </Reveal>
        </Rail>
        {/* Same column as the heading above, so the list lines up with it. */}
        <Rail pad="narrow" className="pt-0! pb-16! md:pb-24!">
          <Reveal delay={100}>
            <Shortcuts />
          </Reveal>
        </Rail>
      </div>

      <div
        id="command-bar"
        className="border-t border-dashed border-black/8 bg-[linear-gradient(to_bottom,var(--color-white)_18%,var(--color-neutral-50)_100%)]"
      >
        <Rail pad="narrow">
          <Reveal className="space-y-3">
            <H3>A Command Bar that knows what you mean.</H3>
            <Lead>
              Press <Kbd className="align-[2px]">⌘</Kbd> <Kbd className="align-[2px]">T</Kbd> and start typing. One list
              holds your open tabs, history and about 40 browser actions. Ask for &ldquo;yesterday&rdquo;, convert 12 km
              to miles, or type a site&rsquo;s name and press Tab to search it.{" "}
              <InlineLink href={`${REPO}#what-works`}>Learn more</InlineLink>
            </Lead>
          </Reveal>
        </Rail>
        <Rail pad="none" className="overflow-hidden md:px-8 xl:px-16">
          <Reveal delay={120} y={28} className="mx-auto h-96 max-w-4xl">
            <CommandBarDemo />
          </Reveal>
        </Rail>
      </div>
    </Section>
  );
}
