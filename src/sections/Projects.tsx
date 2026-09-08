import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GhostButton, SectionTag } from '../components/ui';
import { FadeIn } from '../components/motion';
import { GradientHeading } from '../components/GradientHeading';
import { Tilt3D } from '../components/Tilt3D';
import { projects } from '../data/profile';

export function ProjectsSection() {
  return (
    <section id="projects" data-story="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-ink px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <SectionTag index="04" label="FIELD WORK" />
          <GradientHeading style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            Projects
          </GradientHeading>
        </FadeIn>

        <div className="mt-16">
          {projects.map((p, i) => (
            <Card key={p.name} index={i} total={projects.length} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  project: p,
  index,
  total,
}: {
  project: (typeof projects)[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const targetScale = 1 - (total - 1 - index) * 0.03;
  // shrink applies as the next card scrolls up to cover this one
  const { scrollYProgress: exitProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const shrink = useTransform(exitProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={ref} className="h-[92vh]" style={{ paddingTop: `${index * 28}px` }}>
      <motion.article style={{ scale: shrink }} className="sticky top-24 origin-top md:top-28">
        <Tilt3D>
          <div className="rounded-[36px] border-2 border-paper/25 bg-ink p-6 sm:rounded-[44px] sm:p-8 md:rounded-[52px] md:p-10">
        {/* top row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-baseline gap-5">
            <span
              className="hero-heading font-display font-black leading-none"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 96px)' }}
            >
              {p.number}
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-electric-glow sm:text-xs">
                {p.category}
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold uppercase text-paper sm:text-3xl md:text-4xl">
                {p.name}
              </h3>
            </div>
          </div>
          <GhostButton href={p.link} label="View Work" />
        </div>

        {/* body: metric + narrative */}
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-12">
          <div className="flex flex-col justify-center rounded-3xl border border-electric/25 bg-electric/5 p-6 text-center">
            <span className="font-mono text-4xl font-semibold text-electric-glow sm:text-5xl">
              {p.metric}
            </span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 sm:text-xs">
              {p.metricLabel}
            </span>
          </div>
          <div className="space-y-4 font-light leading-relaxed text-paper/75">
            <p>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40">Problem — </span>
              {p.problem}
            </p>
            <p>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40">Designed — </span>
              {p.solution}
            </p>
            <p>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-electric-glow/70">Outcome — </span>
              {p.outcome}
            </p>
          </div>
        </div>

        {/* tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-paper/20 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-paper/60 sm:text-xs"
            >
              {t}
            </span>
          ))}
        </div>
          </div>
        </Tilt3D>
      </motion.article>
    </div>
  );
}
