import { FadeIn } from '../components/motion';
import { SectionTag } from '../components/ui';
import { experience } from '../data/profile';

// Rendered as an expedition log: monospace timestamps, one entry per leg.
export function ExperienceSection() {
  return (
    <section className="px-5 py-24 sm:px-8 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionTag index="03" label="EXPEDITION LOG" />
          <h2
            className="hero-heading font-display font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 10vw, 130px)' }}
          >
            Experience
          </h2>
        </FadeIn>

        <div className="mt-14 border-l border-paper/15">
          {experience.map((e, i) => (
            <FadeIn key={e.org} delay={i * 0.08}>
              <div className="group relative pb-14 pl-8 last:pb-0 md:pl-12">
                {/* node on the line */}
                <span className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-paper/40 transition-colors duration-300 group-hover:bg-electric" />
                <p className="font-mono text-xs tracking-[0.25em] text-electric-glow/80">{e.period}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold uppercase text-paper md:text-3xl">
                  {e.role}
                  <span className="ml-3 font-light text-paper/50">— {e.org}</span>
                </h3>
                <p className="mt-3 max-w-3xl font-light leading-relaxed text-paper/70">{e.log}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
