import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn, ScrambleText } from '../components/motion';
import { ContactButton } from '../components/ui';
import { magnetic } from '../lib/stringtune';
import { identity } from '../data/profile';

const SYMBOLS = ['0x', 'Σ', '∆', '%', '§', '#', '£'];

// Small circled glyph that shuffles as you scroll (throttled) — the
// ledger's odometer.
function ScrollSymbol() {
  const [sym, setSym] = useState('0x');
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const now = performance.now();
      if (now - last.current < 80) return;
      last.current = now;
      setSym(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper/60 font-mono text-[10px] text-paper">
      {sym}
    </span>
  );
}

export function HeroSection() {
  // The hero is pinned (sticky) while the rest of the page slides over it —
  // fade and shrink it slightly as it gets covered so the takeover reads.
  const { scrollY } = useScroll();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const opacity = useTransform(scrollY, [vh * 0.1, vh * 0.95], [1, 0]);
  const scale = useTransform(scrollY, [0, vh], [1, 0.94]);

  return (
    <section className="sticky top-0 z-0 h-screen" style={{ overflowX: 'clip' }}>
      <motion.div style={{ opacity, scale }} className="ledger-grid relative flex h-full flex-col">
        {/* Massive name — resolves out of hex noise */}
        <FadeIn delay={0.15} y={40} className="relative z-10 w-full overflow-hidden pt-24 md:pt-28">
          <h1
            className="hero-heading -mt-1 w-full whitespace-nowrap text-center font-display text-[15vw] font-black uppercase leading-none tracking-tight sm:text-[16vw] md:mt-2 md:text-[17vw]"
            aria-label={identity.name}
          >
            <ScrambleText text={identity.name} />
          </h1>
        </FadeIn>

        {/* Role line under the name */}
        <FadeIn delay={0.3} y={20} className="relative z-10 w-full">
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-electric-glow sm:text-xs md:mt-6 md:text-sm">
            {identity.title} <span className="text-paper/30">//</span> {identity.subtitle}
          </p>
        </FadeIn>

        {/* Bottom bar */}
        <div className="relative z-10 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
          <FadeIn delay={0.35} y={20}>
            <ScrollSymbol />
            <p
              className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-paper sm:max-w-[220px] md:max-w-[280px]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              {identity.heroLine}
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <div className="st-magnetic" {...magnetic(280, 0.2)}>
              <ContactButton />
            </div>
          </FadeIn>
        </div>
      </motion.div>
    </section>
  );
}
