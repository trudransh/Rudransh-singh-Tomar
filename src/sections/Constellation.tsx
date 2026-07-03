import { useEffect, useRef, useState } from 'react';
import { chains } from '../data/profile';
import { FadeIn } from '../components/motion';
import { SectionTag } from '../components/ui';

type Star = {
  x: number; // 0..1 layout space
  y: number;
  phase: number; // for drift
  speed: number;
  r: number;
};

// Deterministic pseudo-random so the map is the same on every visit —
// it's a ledger, not a lava lamp.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStars(): Star[] {
  const rand = mulberry32(1337);
  const stars: Star[] = [];
  for (let i = 0; i < chains.length; i++) {
    // Poisson-ish spread: retry until far enough from existing stars
    let x = 0.5;
    let y = 0.5;
    for (let tries = 0; tries < 40; tries++) {
      x = 0.08 + rand() * 0.84;
      y = 0.12 + rand() * 0.76;
      if (stars.every((s) => (s.x - x) ** 2 + (s.y - y) ** 2 > 0.018)) break;
    }
    stars.push({ x, y, phase: rand() * Math.PI * 2, speed: 0.3 + rand() * 0.5, r: 3 + rand() * 2 });
  }
  return stars;
}

const STARS = buildStars();
const LINK_DIST = 0.24; // normalized distance under which stars connect

export function ConstellationSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const mouse = useRef({ x: -1, y: -1 });
  hoveredRef.current = hovered;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const pos = (s: Star, t: number) => ({
      // gentle orbital drift around the anchor point
      px: s.x * w + Math.sin(t * 0.0004 * s.speed + s.phase) * 9,
      py: s.y * h + Math.cos(t * 0.0005 * s.speed + s.phase) * 9,
    });

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const pts = STARS.map((s) => pos(s, t));
      const hi = hoveredRef.current;

      // connective lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = (pts[i].px - pts[j].px) / w;
          const dy = (pts[i].py - pts[j].py) / h;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const active = hi === i || hi === j;
            ctx.strokeStyle = active
              ? 'rgba(111, 160, 255, 0.55)'
              : `rgba(215, 226, 234, ${0.10 * (1 - d / LINK_DIST)})`;
            ctx.lineWidth = active ? 1.2 : 0.7;
            ctx.beginPath();
            ctx.moveTo(pts[i].px, pts[i].py);
            ctx.lineTo(pts[j].px, pts[j].py);
            ctx.stroke();
          }
        }
      }

      // stars
      for (let i = 0; i < pts.length; i++) {
        const { px, py } = pts[i];
        const active = hi === i;
        const r = active ? STARS[i].r + 3 : STARS[i].r;
        if (active) {
          const glow = ctx.createRadialGradient(px, py, 0, px, py, 34);
          glow.addColorStop(0, 'rgba(46, 107, 255, 0.5)');
          glow.addColorStop(1, 'rgba(46, 107, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, 34, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = active ? '#6FA0FF' : '#D7E2EA';
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();

        // labels — always on, faint; bright when active
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.fillStyle = active ? '#FFFFFF' : 'rgba(215, 226, 234, 0.5)';
        ctx.fillText(chains[i].name.toUpperCase(), px + r + 7, py + 4);
      }

      // hit detection
      if (mouse.current.x >= 0) {
        let found: number | null = null;
        for (let i = 0; i < pts.length; i++) {
          const dx = pts[i].px - mouse.current.x;
          const dy = pts[i].py - mouse.current.y;
          if (dx * dx + dy * dy < 26 * 26) {
            found = i;
            break;
          }
        }
        if (found !== hoveredRef.current) setHovered(found);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section id="journey" className="relative px-5 py-24 sm:px-8 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionTag index="02" label="THE JOURNEY" />
          <h2
            className="hero-heading font-display font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 10vw, 130px)' }}
          >
            18 chains
          </h2>
          <p className="mt-4 max-w-xl font-light leading-relaxed text-paper/70">
            Every star is a chain I have shipped on or designed for. Hover the map — each one is a
            logged expedition, not a logo on a slide.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div
            ref={wrapRef}
            className="relative mt-10 h-[520px] w-full overflow-hidden rounded-3xl border border-paper/10 bg-ink md:h-[620px]"
            onMouseMove={(e) => {
              const rect = wrapRef.current!.getBoundingClientRect();
              mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            }}
            onMouseLeave={() => {
              mouse.current = { x: -1, y: -1 };
              setHovered(null);
            }}
          >
            <div className="ledger-grid absolute inset-0" />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-crosshair" />
            {/* expedition note */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 border-t border-paper/10 bg-ink/85 px-5 py-4 backdrop-blur-sm">
              {hovered !== null ? (
                <p className="font-mono text-xs text-paper sm:text-sm">
                  <span className="text-electric-glow">{chains[hovered].name.toUpperCase()}</span>
                  <span className="mx-3 text-paper/30">·</span>
                  {chains[hovered].note}
                </p>
              ) : (
                <p className="font-mono text-xs text-paper/40 sm:text-sm">
                  HOVER A STAR TO READ THE EXPEDITION LOG
                </p>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
