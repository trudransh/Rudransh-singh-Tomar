import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn, useScramble } from '../components/motion';
import { ContactButton } from '../components/ui';
import { magnetic } from '../lib/stringtune';
import { identity } from '../data/profile';

export function HeroSection() {
  // One resolving string, painted into both layers of the name.
  const { display, ref: nameRef } = useScramble<HTMLHeadingElement>(identity.name);

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
          {/* Silver fill by default; the flowing vibrant gradient crossfades in
              on hover — same treatment as the section headings. */}
          <h1
            ref={nameRef}
            className="group relative -mt-1 w-full whitespace-nowrap text-center font-display text-[15vw] font-black uppercase leading-none tracking-tight sm:text-[16vw] md:mt-2 md:text-[17vw]"
            aria-label={identity.name}
          >
            <span className="hero-heading">{display}</span>
            <span
              aria-hidden
              className="vibrant-gradient absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
              {display}
            </span>
          </h1>
        </FadeIn>

        {/* Role line under the name */}
        <FadeIn delay={0.3} y={20} className="relative z-10 w-full">
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-electric-glow sm:text-xs md:mt-6 md:text-sm">
            {identity.title} <span className="text-paper/30">//</span> {identity.subtitle}
          </p>
        </FadeIn>

        {/* Bottom bar — CTA only since the odometer + tagline came out */}
        <div className="relative z-10 mt-auto flex items-end justify-end px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
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
