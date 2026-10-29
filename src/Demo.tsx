import type { ComponentType } from "react";
import { Sky } from "./components/Sky";
import { BowWindow, WINDOW_HEIGHT, WINDOW_WIDTH } from "./illustrations/hero/BowWindow";
import { CommandBarDemo } from "./illustrations/CommandBarDemo";
import { BoostPanel } from "./illustrations/BoostPanel";
import { SidebarCard } from "./illustrations/cards/SidebarCard";
import { SpacesCard } from "./illustrations/cards/SpacesCard";
import { ArchiveCard } from "./illustrations/cards/ArchiveCard";
import { SplitCard } from "./illustrations/cards/SplitCard";
import { PeekCard } from "./illustrations/cards/PeekCard";
import { LittleWindowCard } from "./illustrations/cards/LittleWindowCard";
import { NoAccountCard } from "./illustrations/cards/NoAccountCard";
import { BlockingCard } from "./illustrations/cards/BlockingCard";
import { HttpsCard } from "./illustrations/cards/HttpsCard";
import { ExtensionsCard } from "./illustrations/cards/ExtensionsCard";

/** Feature card box at its desktop size (1440px layout): 378×320, rounded-lg, neutral-100. */
function CardBox({ Art, white }: { Art: ComponentType; white?: boolean }) {
  return (
    <div
      id="demo"
      className={`relative h-80 w-[378px] overflow-hidden rounded-lg ${white ? "bg-white" : "bg-neutral-100"}`}
    >
      <Art />
    </div>
  );
}

const DEMOS: Record<string, () => React.ReactElement> = {
  hero: () => (
    <div
      id="demo"
      className="relative overflow-hidden rounded-3xl"
      style={{ width: WINDOW_WIDTH + 120, height: WINDOW_HEIGHT + 60 }}
    >
      <Sky />
      <div className="absolute top-[30px] left-[60px]" style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}>
        <BowWindow paused={false} />
      </div>
    </div>
  ),
  "hero-paused": () => (
    <div
      id="demo"
      className="relative overflow-hidden rounded-3xl"
      style={{ width: WINDOW_WIDTH + 120, height: WINDOW_HEIGHT + 60 }}
    >
      <Sky />
      <div className="absolute top-[30px] left-[60px]" style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}>
        <BowWindow paused />
      </div>
    </div>
  ),
  commandbar: () => (
    <div id="demo" className="h-96 w-[896px] bg-[linear-gradient(to_bottom,#fff_0%,#fafafa_100%)]">
      <CommandBarDemo />
    </div>
  ),
  boost: () => (
    <div
      id="demo"
      className="relative flex h-[468px] w-[560px] items-center justify-center overflow-hidden bg-mist-800"
    >
      <BoostPanel />
    </div>
  ),
  sidebar: () => <CardBox Art={SidebarCard} />,
  spaces: () => <CardBox Art={SpacesCard} />,
  archive: () => <CardBox Art={ArchiveCard} />,
  split: () => <CardBox Art={SplitCard} />,
  peek: () => <CardBox Art={PeekCard} />,
  little: () => <CardBox Art={LittleWindowCard} />,
  noaccount: () => <CardBox Art={NoAccountCard} white />,
  blocking: () => <CardBox Art={BlockingCard} white />,
  https: () => <CardBox Art={HttpsCard} white />,
  extensions: () => <CardBox Art={ExtensionsCard} white />,
};

/** Dev aid: `/?demo=<name>` renders one illustration alone, at its real size, on a white page. */
export function Demo({ name }: { name: string }) {
  const Render = DEMOS[name];
  return (
    <div className="flex min-h-screen items-start justify-start bg-white p-10">
      {Render ? <Render /> : <p>Unknown demo. Try: {Object.keys(DEMOS).join(", ")}</p>}
    </div>
  );
}
