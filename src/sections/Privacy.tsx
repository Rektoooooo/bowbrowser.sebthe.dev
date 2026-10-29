import { Rail, Section } from "../components/layout";
import { Reveal } from "../components/Reveal";
import { Eyebrow, H2 } from "../components/typography";
import { CardRow, FeatureCard } from "../components/cards";
import { Scramble } from "../components/Scramble";
import { REPO } from "../lib/release";
import { NoAccountCard } from "../illustrations/cards/NoAccountCard";
import { BlockingCard } from "../illustrations/cards/BlockingCard";
import { HttpsCard } from "../illustrations/cards/HttpsCard";
import { ExtensionsCard } from "../illustrations/cards/ExtensionsCard";

export function Privacy() {
  return (
    <Section as="div" id="privacy">
      <div className="bg-neutral-50">
        <Rail className="text-center">
          <Reveal>
            <Eyebrow href={`${REPO}/blob/main/SECURITY.md`} className="mb-6">
              Privacy and control
            </Eyebrow>
            <H2 className="mb-4">
              <Scramble text="Private" /> without an account.
            </H2>
            <p className="mx-auto max-w-xl text-base text-muted-foreground xl:text-lg">
              Bow has no account and no servers of its own. Your tabs, history and settings stay on your Mac.
            </p>
          </Reveal>
        </Rail>

        <div className="border-x border-black/6 pb-6">
          <CardRow cols={4}>
            <FeatureCard
              title="No account"
              art={<NoAccountCard />}
              artWidth={270}
              index={0}
              artClassName="bg-white!"
              height="h-72 lg:h-80"
            >
              Sync between your Macs through a folder you choose, like iCloud Drive or Dropbox.
            </FeatureCard>
            <FeatureCard
              title="Blocking, one switch away"
              art={<BlockingCard />}
              artWidth={270}
              index={1}
              artClassName="bg-white!"
              height="h-72 lg:h-80"
            >
              Turn on ad and tracker blocking with EasyList and EasyPrivacy, then see what it caught.
            </FeatureCard>
            <FeatureCard
              title="HTTPS-Only, forget on quit"
              art={<HttpsCard />}
              artWidth={270}
              index={2}
              artClassName="bg-white!"
              height="h-72 lg:h-80"
            >
              Insist on secure connections, and let a profile forget site data when you quit.
            </FeatureCard>
            <FeatureCard
              title="Chrome extensions"
              art={<ExtensionsCard />}
              artWidth={270}
              index={3}
              artClassName="bg-white!"
              height="h-72 lg:h-80"
            >
              Install per profile from the Chrome Web Store. Password managers work too.
            </FeatureCard>
          </CardRow>
        </div>

        <Rail className="pt-4! pb-16! text-center xl:pb-24!">
          <p className="text-sm text-muted-foreground">
            The update check only downloads a file from GitHub and sends nothing about you.{" "}
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-ink underline decoration-black/25 decoration-dotted underline-offset-3 hover:decoration-black/60"
            >
              Read the source
            </a>
          </p>
        </Rail>
      </div>
    </Section>
  );
}
