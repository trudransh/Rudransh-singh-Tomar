import { Cursor } from './components/Cursor';
import { HeroSection } from './sections/Hero';
import { MarqueeSection } from './sections/Marquee';
import { AboutSection } from './sections/About';
import { ConstellationSection } from './sections/Constellation';
import { ExperienceSection } from './sections/Experience';
import { ProjectsSection } from './sections/Projects';
import { ResearchSection } from './sections/Research';
import { WinsSection } from './sections/Wins';
import { ContactSection } from './sections/Contact';

export default function App() {
  return (
    <main className="bg-ink text-paper" style={{ overflowX: 'clip' }}>
      <Cursor />

      {/* Pinned hero — the rest of the page slides up over it */}
      <HeroSection />

      {/* The overlay panel: rounded corners + shadow sell the takeover */}
      <div className="relative z-10 rounded-t-[40px] bg-ink shadow-[0_-24px_80px_rgba(0,0,0,0.7)] sm:rounded-t-[50px] md:rounded-t-[60px]">
        <MarqueeSection />
        <AboutSection />
        <ConstellationSection />
        <ExperienceSection />
        <ProjectsSection />
        <ResearchSection />
        <WinsSection />
        <ContactSection />
      </div>
    </main>
  );
}
