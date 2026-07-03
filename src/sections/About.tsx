import { AnimatedText, Counter, FadeIn } from '../components/motion';
import { ContactButton, SectionTag } from '../components/ui';
import { aboutText, stats } from '../data/profile';

export function AboutSection() {
  return (
    <section id="about" className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8 md:px-10">
      <div className="flex w-full max-w-5xl flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn className="w-full text-center">
          <SectionTag index="01" label="THE ENGINEER" />
          <h2
            className="hero-heading text-center font-display font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <AnimatedText
          text={aboutText}
          className="max-w-[640px] text-center font-medium leading-relaxed text-paper"
        />

        {/* The ledger strip — hard numbers, monospace */}
        <FadeIn delay={0.1} className="w-full">
          <div className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 bg-ink px-4 py-7">
                <Counter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="font-mono text-2xl font-semibold text-electric-glow sm:text-3xl md:text-4xl"
                />
                <span className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 sm:text-xs">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
