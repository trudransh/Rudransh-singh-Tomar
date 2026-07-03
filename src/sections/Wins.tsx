import { Trophy } from 'lucide-react';
import { FadeIn } from '../components/motion';
import { SectionTag } from '../components/ui';
import { achievements } from '../data/profile';

export function WinsSection() {
  return (
    <section
      id="wins"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-ink px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28"
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionTag index="06" label="TROPHIES" />
          <h2
            className="hero-heading font-display font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 10vw, 130px)' }}
          >
            Wins
          </h2>
        </FadeIn>

        <div className="mt-14 space-y-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10">
          {achievements.map((a, i) => (
            <FadeIn key={a.event} delay={i * 0.08}>
              <div className="group flex flex-col gap-2 bg-ink px-6 py-6 transition-colors duration-300 hover:bg-[#101318] sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-8">
                <div className="flex items-center gap-4">
                  <Trophy className="h-5 w-5 shrink-0 text-electric-glow" />
                  <div>
                    <p className="font-display text-base font-semibold uppercase text-paper sm:text-lg">
                      {a.event}
                    </p>
                    <p className="font-mono text-xs text-paper/50">{a.project}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-electric/40 bg-electric/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-electric-glow sm:text-xs">
                  {a.result}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
