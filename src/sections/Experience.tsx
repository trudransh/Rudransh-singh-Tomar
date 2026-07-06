import { FadeIn, Parallax } from '../components/motion';
import { GradientHeading } from '../components/GradientHeading';
import { SectionTag } from '../components/ui';
import { experience } from '../data/profile';

// Expedition log. Plain FadeIn entrances — the same proven mechanism as
// every other section. (Two fancier reveal variants left this section
// invisible; content visibility wins over animation novelty.)
export function ExperienceSection() {
  return (
    <section data-story="experience" className="px-5 py-24 sm:px-8 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Parallax speed={-0.15}>
          <FadeIn>
            <SectionTag index="03" label="EXPEDITION LOG" />
            <GradientHeading style={{ fontSize: 'clamp(3rem, 10vw, 130px)' }}>
              Experience
            </GradientHeading>
          </FadeIn>
        </Parallax>

        <div className="mt-14 border-l border-paper/15">
          {experience.map((e, i) => (
            <FadeIn key={e.org} delay={i * 0.08}>
              <div className="group relative pb-14 pl-8 last:pb-0 md:pl-12">
                {/* node on the line */}
                <span className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-paper/40 transition-colors duration-300 group-hover:bg-electric" />
                <div className="hover-bg">
                  <p className="font-mono text-xs tracking-[0.25em] text-electric-glow/80">
                    {e.period}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold uppercase text-paper md:text-3xl">
                    {e.role}
                    <span className="ml-3 font-light text-paper/50">— {e.org}</span>
                  </h3>
                  <p className="mt-3 max-w-3xl font-light leading-relaxed text-paper/70">{e.log}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
