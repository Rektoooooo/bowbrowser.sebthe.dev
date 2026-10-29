import { Rail, Section } from "../components/layout";
import { Reveal } from "../components/Reveal";
import { Eyebrow } from "../components/typography";
import { REPO } from "../lib/release";

export function Intro() {
  return (
    <Section as="div">
      <Rail className="gap-16 pt-24! md:pt-36! lg:flex">
        <Reveal className="mb-8 w-64 shrink-0">
          <Eyebrow href={`${REPO}#why-bow`}>Introducing Bow</Eyebrow>
        </Reveal>
        <div className="space-y-8 font-display text-base text-muted-foreground sm:text-lg xl:text-xl">
          <Reveal delay={80}>
            <p>
              <span className="text-ink">Arc is being shut down.</span> It changed how a lot of us use the web: the
              sidebar is the whole browser, every Space has its own colours and tabs, and tabs you stop using tidy
              themselves away.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p>
              <span className="text-ink">Bow keeps that way of browsing.</span> It is a new browser, rebuilt from how
              Arc behaves and running on Chromium, so your Chrome extensions come along. It is open source under the MIT
              license, so nobody can switch it off.
            </p>
          </Reveal>
        </div>
      </Rail>
    </Section>
  );
}
