import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/Hero';
import { AboutSection } from './sections/About';
import { ConstellationSection } from './sections/Constellation';
import { ExperienceSection } from './sections/Experience';
import { ProjectsSection } from './sections/Projects';
import { ResearchSection } from './sections/Research';
import { WinsSection } from './sections/Wins';
import { ContactSection } from './sections/Contact';
import { Storyteller } from './components/Storyteller';
import { LedgerBase } from './components/LedgerBase';
import { initStringTune, cursorFollower } from './lib/stringtune';

export default function App() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    try {
      if (initStringTune()) {
        document.documentElement.classList.add('st-ready', 'cursor-hidden');
      }
    } catch {
      // StringTune failed to boot — native cursor stays, site works fine.
    }
  }, []);

  return (
    <main id="top" className="bg-ink text-paper" style={{ overflowX: 'clip' }}>
      {/* The Ledger Base — fixed global texture the whole site stacks over */}
      <LedgerBase />

      <Navbar />

      {/* StringTune cursor: ring + trailing echoes (tutorial-06) */}
      <div className="st-cursor" {...cursorFollower(0.75)}>
        <span className="st-ring" />
      </div>
      <div className="st-cursor-echo" {...cursorFollower(0.6)} />
      <div className="st-cursor-echo" {...cursorFollower(0.85)} />
      <div className="st-cursor-echo" {...cursorFollower(0.95)} />

      {/* Pinned hero — the rest of the page slides up over it */}
      <HeroSection />

      {/* The overlay panel: rounded corners + shadow sell the takeover */}
      <div className="relative z-10 rounded-t-[40px] bg-ink/[0.92] shadow-[0_-24px_80px_rgba(0,0,0,0.7)] sm:rounded-t-[50px] md:rounded-t-[60px]">
        <AboutSection />
        <ConstellationSection />
        <ExperienceSection />
        <ProjectsSection />
        <ResearchSection />
        <WinsSection />
        <ContactSection />
      </div>

      {/* SPECTER — pixel storyteller, docked across the whole page */}
      <Storyteller />
    </main>
  );
}
