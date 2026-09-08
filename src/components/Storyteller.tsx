import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// SPECTER — a pixel-art ghost that narrates the scroll like an RPG companion.
// No image assets: the sprite is a palette-index grid rasterized to <canvas>.

// 0 transparent · 1 body · 2 eyes · 3 scarf · 4 highlight
const PALETTE = ['transparent', '#E8ECF1', '#0A0A0F', '#8B7CF6', '#B7AFFF'];

// 12 wide × 14 tall. Rounded head, two dark eyes, a violet scarf band,
// a wavy skirt at the bottom.
const GHOST: number[][] = [
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1],
  [1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
];
const COLS = GHOST[0].length;
const ROWS = GHOST.length;
const EYE_TOP = 5; // blink closes the upper eye row

function drawGhost(canvas: HTMLCanvasElement, scale: number, blink: boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let v = GHOST[r][c];
      if (blink && v === 2 && r === EYE_TOP) v = 1; // eyelid down
      if (v === 0) continue;
      ctx.fillStyle = PALETTE[v];
      ctx.fillRect(c * scale, r * scale, scale, scale);
    }
  }
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const WELCOME_LINE =
  'Welcome. I am Specter, watcher of the ledger. Scroll — the expedition begins. ⚔';
// Shown between tagged sections, once the hero is behind us.
const FALLBACK_LINE = 'The ledger runs deep. Keep scrolling.';

const SECTION_LINES: Record<string, string> = {
  about: '18 chains. 784,660 lines. The numbers are real — watch them count.',
  constellation: 'Each star, a deployment. The lines are protocols spanning chains.',
  experience: 'The expedition log. Ground-zero research to audited mainnet.',
  projects: 'The builds. Perps DEXes, zk pipelines, trust primitives.',
  research: '$27.5k+ in wins. 105+ research documents. Receipts, not claims.',
  contact: 'End of the ledger. Open a channel — he responds.',
};
const STORY_ORDER = ['about', 'constellation', 'experience', 'projects', 'research', 'contact'];

export function Storyteller() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleStories = useRef<Set<string>>(new Set());

  const [reduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  );
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('specter-dismissed') === '1';
    } catch {
      return false;
    }
  });

  const [inHero, setInHero] = useState(true);
  const [activeStory, setActiveStory] = useState('');
  const [typed, setTyped] = useState('');

  const scale = mobile ? 3 : 4;

  const line = useMemo(() => {
    if (inHero) return WELCOME_LINE;
    return SECTION_LINES[activeStory] ?? FALLBACK_LINE;
  }, [inHero, activeStory]);

  // Track viewport size → sprite scale + box width.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // The hero is one sticky 100vh screen, so "in hero" is just the first
  // viewport. 0.9 hands over just before About's heading clears the fold.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setInHero(window.scrollY < window.innerHeight * 0.9);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Section lines: whichever tagged section owns the middle of the viewport.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-story]'));
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const key = e.target.getAttribute('data-story');
          if (!key) continue;
          if (e.isIntersecting) visibleStories.current.add(key);
          else visibleStories.current.delete(key);
        }
        for (let i = STORY_ORDER.length - 1; i >= 0; i--) {
          if (visibleStories.current.has(STORY_ORDER[i])) {
            setActiveStory(STORY_ORDER[i]);
            break;
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Typewriter: restart cleanly whenever the target line changes.
  useEffect(() => {
    if (reduced) {
      setTyped(line);
      return;
    }
    setTyped('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(line.slice(0, i));
      if (i >= line.length) window.clearInterval(id);
    }, 20);
    return () => window.clearInterval(id);
  }, [line, reduced]);

  // Rasterize the sprite; blink every ~4s (skipped under reduced motion).
  useEffect(() => {
    if (dismissed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawGhost(canvas, scale, false);
    if (reduced) return;
    const id = window.setInterval(() => {
      const c = canvasRef.current;
      if (!c) return;
      drawGhost(c, scale, true);
      window.setTimeout(() => {
        const c2 = canvasRef.current;
        if (c2) drawGhost(c2, scale, false);
      }, 150);
    }, 4000);
    return () => window.clearInterval(id);
  }, [scale, reduced, dismissed]);

  const dismiss = () => {
    try {
      sessionStorage.setItem('specter-dismissed', '1');
    } catch {
      // sessionStorage unavailable — dismiss for this render only.
    }
    setDismissed(true);
  };

  const typing = typed !== line;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[40]">
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            key="specter"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-start gap-2"
          >
            {/* dialogue box */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
              className={`relative pointer-events-auto rounded-2xl border border-white/10 bg-[#12121B]/95 p-4 font-mono text-xs leading-relaxed text-paper/90 backdrop-blur-md ${
                mobile ? 'max-w-[200px]' : 'max-w-[260px]'
              }`}
            >
              <button
                onClick={dismiss}
                aria-label="Dismiss Specter"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-[#0A0A0F] text-[10px] text-paper/60 transition-colors hover:text-paper"
              >
                ×
              </button>
              <p>
                {typed}
                {typing && <span className="ml-0.5 animate-pulse text-electric-glow">▊</span>}
              </p>
              {/* tail pointing down toward the sprite */}
              <span className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 border-b border-l border-white/10 bg-[#12121B]/95" />
            </motion.div>

            {/* the sprite + caption */}
            <div className="pointer-events-auto flex flex-col items-center gap-1 pl-2">
              <canvas
                ref={canvasRef}
                width={COLS * scale}
                height={ROWS * scale}
                className={`specter-canvas ${reduced ? '' : 'specter-bob'}`}
                aria-hidden
              />
              <span className="font-mono text-[9px] tracking-widest text-paper/50">SPECTER</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
