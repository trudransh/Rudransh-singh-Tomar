import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { FadeIn, Parallax } from '../components/motion';
import { GradientHeading } from '../components/GradientHeading';
import { SectionTag } from '../components/ui';
import { identity, socials } from '../data/profile';

// Giant pill CTA that scales in as you reach the end of the ledger.
// Clicking copies the email (mailto: is a silent no-op on machines with
// no mail client — WSL included) and confirms it in place; it still
// opens the mail app where one exists.
function GiantCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scale = useTransform(scrollYProgress, [0.1, 0.85], [0, 1]);

  const copyEmail = () => {
    navigator.clipboard?.writeText(identity.email).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div ref={ref} className="mt-20 md:mt-28">
      <motion.a
        href={`mailto:${identity.email}`}
        onClick={copyEmail}
        style={{ scale, transformOrigin: 'center bottom' }}
        className="group flex w-full items-center justify-center rounded-full bg-white py-8 transition-colors duration-300 hover:bg-electric md:py-12"
      >
        {copied ? (
          <>
            <Check
              className="mr-4 h-[clamp(1.6rem,5vw,56px)] w-[clamp(1.6rem,5vw,56px)] text-ink transition-colors duration-300 group-hover:text-white"
              strokeWidth={3}
            />
            <span
              className="font-display font-black uppercase leading-none tracking-tight text-ink transition-colors duration-300 group-hover:text-white"
              style={{ fontSize: 'clamp(1.4rem, 4.5vw, 56px)' }}
            >
              email copied
            </span>
          </>
        ) : (
          <>
            <span
              className="font-display font-black uppercase leading-none tracking-tight text-ink transition-colors duration-300 group-hover:text-white"
              style={{ fontSize: 'clamp(2.4rem, 9vw, 110px)' }}
            >
              say hi
            </span>
            <ArrowUpRight
              className="ml-4 h-[clamp(2rem,7vw,80px)] w-[clamp(2rem,7vw,80px)] text-ink transition-all duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:text-white"
              strokeWidth={2.5}
            />
          </>
        )}
      </motion.a>
      <p className="mt-4 text-center font-mono text-xs tracking-[0.2em] text-paper/40">
        {identity.email}
      </p>
    </div>
  );
}

export function ContactSection() {
  return (
    <section id="contact" data-story="contact" className="border-t border-paper/10 px-5 pb-12 pt-24 sm:px-8 md:px-10 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <Parallax speed={-0.12}>
          <FadeIn>
            <SectionTag index="07" label="OPEN A CHANNEL" />
            <GradientHeading style={{ fontSize: 'clamp(2.6rem, 10vw, 140px)' }}>
              Let's build
            </GradientHeading>
            <p className="mt-4 max-w-xl font-light leading-relaxed text-paper/70">
              Auditing a launch, designing a protocol, or pressure-testing an idea before capital
              touches it — reach out.
            </p>
          </FadeIn>
        </Parallax>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 sm:grid-cols-2">
          {socials.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.06} className="h-full">
              <a
                href={s.url}
                target={s.url.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                className="hover-bg group flex h-full items-center justify-between gap-4 bg-ink p-7"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40 sm:text-xs">
                    {s.label}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-paper group-hover:text-electric-glow sm:text-xl">
                    {s.handle}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-paper/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-electric-glow" />
              </a>
            </FadeIn>
          ))}
        </div>

        <GiantCTA />

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-paper/10 pt-6 sm:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/30 sm:text-xs">
            © {new Date().getFullYear()} {identity.fullName}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/30 sm:text-xs">
            calculated risks · global impact
          </p>
        </div>
      </div>
    </section>
  );
}
