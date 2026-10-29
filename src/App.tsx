import { Hero } from "./sections/Hero";
import { StickyNav } from "./components/Nav";
import { Intro } from "./sections/Intro";
import { Arc } from "./sections/Arc";
import { SplitView } from "./sections/SplitView";
import { Privacy } from "./sections/Privacy";
import { Cta, Footer } from "./sections/Closing";

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <StickyNav />
        <Intro />
        <Arc />
        <SplitView />
        <Privacy />
      </main>
      <Cta />
      <Footer />
    </>
  );
}
