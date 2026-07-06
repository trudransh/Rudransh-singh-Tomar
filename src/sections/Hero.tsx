import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { FadeIn, Parallax, ScrambleText } from '../components/motion';
import { ContactButton } from '../components/ui';
import { SceneBoundary } from '../components/hero3d/ErrorBoundary';
import { magnetic } from '../lib/stringtune';
import { identity } from '../data/profile';

// three lands in its own chunk; the typography hero paints immediately.
const Scene = lazy(() => import('../components/hero3d/Scene'));

// full: desktop, mouse, motion ok · lite: touch/small, fewer shards, no tilt ·
// static: prefers-reduced-motion — no pin, no scrub, no 3D.
type HeroMode = 'full' | 'lite' | 'static';

function detectMode(): HeroMode {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
  const fine = window.matchMedia('(pointer: fine)').matches;
  return fine && window.innerWidth >= 768 ? 'full' : 'lite';
}

// Glassmorphic facts hovering in the void around the block. Real numbers only.
// Each pill sits at its own scroll speed + mouse depth for layered parallax.
const PILLS = [
  { text: 'open to audits', pos: 'left-[6%] top-[40%]', delay: 0.6, dur: 5.2, speed: 0.15, depth: 8 },
  { text: '18 chains shipped', pos: 'right-[6%] top-[34%]', delay: 0.75, dur: 6.1, speed: 0.25, depth: 14 },
  { text: '$27.5k+ hackathon wins', pos: 'right-[10%] bottom-[27%]', delay: 0.9, dur: 5.6, speed: 0.35, depth: 20 },
];

// Transform layers, outer→inner: FadeIn (entrance) · Parallax (scroll) ·
// mouse-parallax · float · magnetic. One writer per element, never doubled.
function Pill({ p }: { p: (typeof PILLS)[number] }) {
  const mx = useSpring(0, { stiffness: 120, damping: 20 });
  const my = useSpring(0, { stiffness: 120, damping: 20 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: MouseEvent) => {
      mx.set(((e.clientX / window.innerWidth) * 2 - 1) * p.depth);
      my.set(((e.clientY / window.innerHeight) * 2 - 1) * p.depth);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my, p.depth]);

  return (
    <FadeIn delay={p.delay} className={`absolute ${p.pos}`}>
      <Parallax speed={p.speed}>
        <motion.div style={{ x: mx, y: my }}>
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="st-magnetic pointer-events-auto flex items-center gap-2 rounded-full border border-white/15 bg-[#0A0A0F]/85 px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-paper shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-lg"
              {...magnetic(200, 0.3)}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
              {p.text}
            </div>
          </motion.div>
        </motion.div>
      </Parallax>
    </FadeIn>
  );
}

function StatusPills() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] hidden md:block">
      {PILLS.map((p) => (
        <Pill key={p.text} p={p} />
      ))}
    </div>
  );
}

// The Dissection: a wireframe contract block pinned for a 3-screen scroll
// track. Scroll scrubs the exploded view (storage slots, bytecode shards,
// one fractured red H-1) before it reassembles and the panel slides over.
export function HeroSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [mode] = useState<HeroMode>(detectMode);
  const isStatic = mode === 'static';

  // Normalized pointer for the block's parallax tilt (full mode only).
  useEffect(() => {
    if (mode !== 'full') return;
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mode]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  const stageScale = useTransform(scrollYProgress, [0.85, 1], [1, 0.96]);
  // Fade fully out — beneath the arriving panel there is only the Ledger Base.
  const stageOpacity = useTransform(scrollYProgress, [0.78, 0.98], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  // Front typography clears out so the mid-scroll stage is just the block.
  const nameOpacity = useTransform(scrollYProgress, [0.2, 0.34], [1, 0]);

  return (
    <div
      ref={trackRef}
      id="hero-track"
      className={isStatic ? 'relative z-0 h-screen' : 'relative z-0 h-[220vh] md:h-[300vh]'}
    >
      <section className="sticky top-0 h-screen" style={{ overflowX: 'clip' }}>
        <motion.div
          style={isStatic ? undefined : { scale: stageScale, opacity: stageOpacity }}
          className="relative h-full"
        >
          {/* the dissection — transparent canvas behind the front name */}
          {!isStatic && (
            <div className="absolute inset-0 z-[3]">
              <SceneBoundary fallback={null}>
                <Suspense fallback={null}>
                  <Scene
                    progress={scrollYProgress}
                    pointer={pointer}
                    shardCount={mode === 'full' ? 18 : 10}
                    tilt={mode === 'full'}
                    dpr={mode === 'full' ? [1, 2] : [1, 1.5]}
                  />
                </Suspense>
              </SceneBoundary>
            </div>
          )}

          {/* FRONT name — reads over the block, then clears as it dissects */}
          <motion.div
            style={isStatic ? undefined : { opacity: nameOpacity }}
            className="absolute inset-x-0 top-[13%] z-[4] text-center"
          >
            <FadeIn delay={0.15} y={40}>
              <h1
                className="hero-heading whitespace-nowrap font-display text-[15vw] font-black uppercase leading-none tracking-tight md:text-[14vw]"
                aria-label={identity.fullName}
              >
                <ScrambleText text={identity.name} />
              </h1>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-electric-glow sm:text-xs md:mt-4 md:text-sm">
                {identity.title} <span className="text-paper/30">//</span> {identity.subtitle}
              </p>
            </FadeIn>
          </motion.div>

          <StatusPills />

          {/* bottom bar — contact only, kept out of the dissection's way */}
          <div className="absolute inset-x-0 bottom-0 z-[6] flex items-end justify-end px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
            <FadeIn delay={0.5} y={20}>
              <div className="st-magnetic" {...magnetic(280, 0.2)}>
                <ContactButton />
              </div>
            </FadeIn>
          </div>

          {!isStatic && (
            <motion.p
              style={{ opacity: hintOpacity }}
              className="absolute bottom-8 left-1/2 z-[4] -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40 backdrop-blur-sm"
            >
              scroll to dissect ↓
            </motion.p>
          )}
        </motion.div>
      </section>
    </div>
  );
}
