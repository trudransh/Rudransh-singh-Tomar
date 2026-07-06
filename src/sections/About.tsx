import { Counter, FadeIn, HighlightText, Parallax } from '../components/motion';
import { ContactButton, SectionTag } from '../components/ui';
import { GradientHeading } from '../components/GradientHeading';
import { aboutSegments, stats } from '../data/profile';

export function AboutSection() {
  return (
    <section id="about" data-story="about" className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8 md:px-10">
      <div className="flex w-full max-w-5xl flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <Parallax speed={-0.15} className="w-full">
          <FadeIn className="w-full text-center">
            <SectionTag index="01" label="THE ENGINEER" />
            <GradientHeading
              className="text-center"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              About me
            </GradientHeading>
          </FadeIn>
        </Parallax>

        <HighlightText
          segments={aboutSegments}
          className="max-w-[680px] text-center font-light leading-relaxed text-paper"
          // key phrases glow in the accent color as the reveal sweeps through
        />

        {/* The ledger strip — hard numbers, monospace, alive:
            counters re-run on every visit, values pulse in a stagger */}
        <Parallax speed={0.08} className="w-full">
          <FadeIn delay={0.1} className="w-full">
          <div className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="hover-bg flex flex-col items-center gap-1 bg-ink px-4 py-7"
                style={{ ['--d' as string]: `${i * 0.8}s` }}
              >
                <Counter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  once={false}
                  className="stat-pulse font-mono text-2xl font-semibold text-electric-glow sm:text-3xl md:text-4xl"
                />
                <span className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 sm:text-xs">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          </FadeIn>
        </Parallax>

        <FadeIn delay={0.2}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
