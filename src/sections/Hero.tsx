import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn, ScrambleText } from '../components/motion';
import { ContactButton } from '../components/ui';
import { magnetic } from '../lib/stringtune';
import { hiddenDocs, identity } from '../data/profile';

const SYMBOLS = ['0x', 'Σ', '∆', '%', '§', '#', '£'];

// Lando-style reveal: a hidden layer of real research titles and audit
// finding IDs, uncovered by a soft spotlight that trails the cursor.
// The mask lives in CSS (.spotlight-layer); we just feed it eased coords.
function SpotlightLayer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;
    let tx = -999;
    let ty = -999;
    let x = -999;
    let y = -999;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const loop = () => {
      x += (tx - x) * 0.12; // spotlight trails the cursor, prmpt-style
      y += (ty - y) * 0.12;
      el.style.setProperty('--sx', `${x}px`);
      el.style.setProperty('--sy', `${y}px`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const rows = Array.from({ length: 14 }, (_, r) =>
    Array.from({ length: 6 }, (_, c) => hiddenDocs[(r * 5 + c * 3) % hiddenDocs.length]),
  );

  return (
    <div ref={ref} className="spotlight-layer pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden>
      <div className="flex h-full flex-col justify-between py-6 opacity-90">
        {rows.map((row, r) => (
          <div
            key={r}
            className="flex w-max gap-10 whitespace-nowrap font-mono text-xs tracking-[0.15em]"
            style={{ transform: `translateX(${-((r * 137) % 400)}px)` }}
          >
            {row.map((doc, c) => (
              <span
                key={c}
                className={
                  doc.startsWith('[')
                    ? 'text-neon'
                    : c % 3 === 0
                      ? 'text-electric-glow'
                      : 'text-paper/60'
                }
              >
                {doc}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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
        <SpotlightLayer />

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
