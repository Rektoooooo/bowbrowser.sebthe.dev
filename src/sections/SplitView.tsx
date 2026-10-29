import { Rail, Section } from "../components/layout";
import { Reveal } from "../components/Reveal";
import { Eyebrow, H2, H3, Kbd } from "../components/typography";
import { CardRow, FeatureCard, FitArt } from "../components/cards";
import { Scramble } from "../components/Scramble";
import { REPO } from "../lib/release";
import { SplitCard } from "../illustrations/cards/SplitCard";
import { PeekCard } from "../illustrations/cards/PeekCard";
import { LittleWindowCard } from "../illustrations/cards/LittleWindowCard";
import { BoostPanel } from "../illustrations/BoostPanel";

export function SplitView() {
  return (
    <Section id="split-view">
      <Rail>
        <Reveal>
          <Eyebrow href={`${REPO}#what-works`} className="mb-6">
            Split View and Peek
          </Eyebrow>
          <H2 className="mb-4">
            Open more, <Scramble text="juggle" /> less.
          </H2>
          <p className="max-w-3xl text-base text-muted-foreground xl:text-lg">
            Drop a tab onto another to read them side by side, in two, three or four panes.
            <br className="max-lg:hidden" /> Peek at a link without leaving the page, and let links from other apps open
            in a Little Window.
          </p>
        </Reveal>
      </Rail>

      <div className="border-x border-black/6 pb-16 md:pb-24">
        <CardRow>
          <FeatureCard title="Split View" art={<SplitCard />} index={0}>
            Two to four tabs side by side, kept together as one row in the sidebar.
          </FeatureCard>
          <FeatureCard title="Peek" art={<PeekCard />} index={1}>
            Preview a link in a floating card. Keep it as a tab with <Kbd className="h-5 min-w-5 text-[11px]">⌘</Kbd>{" "}
            <Kbd className="h-5 min-w-5 text-[11px]">O</Kbd>, or let it go.
          </FeatureCard>
          <FeatureCard title="Little Windows" art={<LittleWindowCard />} index={2}>
            Links from other apps open in a small window, not in the middle of your work.
          </FeatureCard>
        </CardRow>
      </div>

      <Rail pad="none" className="flex flex-col md:flex-row">
        <div className="flex grow flex-col border-t border-dashed border-black/8 px-6 py-8 sm:px-8 sm:py-10 md:basis-1/2 xl:px-16 xl:py-12">
          <Reveal>
            <H3 className="leading-8! sm:leading-9!">
              Boosts
              <span className="block text-muted-foreground">
                Make any site look
                <br className="max-sm:hidden" /> the way you like.
              </span>
            </H3>
          </Reveal>
          <div className="min-h-32 py-4 md:grow">
            <a
              href={`${REPO}#what-works`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center rounded-xl bg-muted px-3 text-base font-medium transition-colors hover:bg-black/8"
            >
              Learn more
            </a>
          </div>
          <ul className="space-y-4">
            <li>
              <p className="text-base font-medium">Colours and fonts</p>
              <p className="text-base text-muted-foreground">
                Recolour a site or change its font, and Bow remembers it for next time.
              </p>
            </li>
            <li>
              <p className="text-base font-medium">Your own CSS and JavaScript</p>
              <p className="max-w-md text-base text-muted-foreground">
                Add a few lines to any site. Turn on Developer Mode per site when you need more.
              </p>
            </li>
          </ul>
        </div>
        {/* The editor is laid out for 400×468 and scaled down on phones (same shape, so nothing overlaps). */}
        <div className="relative flex aspect-[400/468] w-full items-center justify-center overflow-hidden bg-mist-800 md:aspect-auto md:min-h-[468px] md:basis-1/2 lg:shrink-0 lg:basis-[45%]">
          <FitArt width={400} minScale={0.76}>
            <BoostPanel />
          </FitArt>
        </div>
      </Rail>
    </Section>
  );
}
