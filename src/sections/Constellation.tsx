import { useEffect, useRef, useState } from 'react';
import { chains, chainLinks } from '../data/profile';
import { FadeIn } from '../components/motion';
import { GradientHeading } from '../components/GradientHeading';
import { SectionTag } from '../components/ui';

type Star = { x: number; y: number; phase: number; speed: number; r: number };

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
    let x = 0.5;
    let y = 0.5;
    // generous spacing so name labels can never collide
    for (let tries = 0; tries < 80; tries++) {
      x = 0.08 + rand() * 0.84;
      y = 0.12 + rand() * 0.76;
      if (stars.every((s) => (s.x - x) ** 2 + (s.y - y) ** 2 > 0.032)) break;
    }
    stars.push({ x, y, phase: rand() * Math.PI * 2, speed: 0.3 + rand() * 0.5, r: 3 + rand() * 2 });
  }
  return stars;
}

const STARS = buildStars();
const nameToIdx = new Map(chains.map((c, i) => [c.name, i]));
// Only draw lines that mean something: real cross-chain projects.
const LINKS = chainLinks
  .map(([a, b, via]) => ({ a: nameToIdx.get(a)!, b: nameToIdx.get(b)!, via }))
  .filter((l) => l.a !== undefined && l.b !== undefined);

export function ConstellationSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(0); // Ethereum by default
  const hoveredRef = useRef<number | null>(null);
  const selectedRef = useRef(0);
  const mouse = useRef({ x: -1, y: -1 });
  hoveredRef.current = hovered;
  selectedRef.current = selected;

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
      px: s.x * w + Math.sin(t * 0.0004 * s.speed + s.phase) * 8,
      py: s.y * h + Math.cos(t * 0.0005 * s.speed + s.phase) * 8,
    });

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const pts = STARS.map((s) => pos(s, t));
      const active = hoveredRef.current ?? selectedRef.current;

      // real project links only — no text on the lines; the panel's
      // "connected chains" chips carry the project names, so labels can
      // never overlap star names on the canvas
      for (const link of LINKS) {
        const involved = link.a === active || link.b === active;
        const p1 = pts[link.a];
        const p2 = pts[link.b];
        ctx.strokeStyle = involved ? 'rgba(183, 175, 255, 0.7)' : 'rgba(232, 236, 241, 0.10)';
        ctx.lineWidth = involved ? 1.4 : 0.8;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      for (let i = 0; i < pts.length; i++) {
        const { px, py } = pts[i];
        const isActive = i === active;
        const isSelected = i === selectedRef.current;
        const r = isActive ? STARS[i].r + 3 : STARS[i].r;
        if (isActive) {
          const glow = ctx.createRadialGradient(px, py, 0, px, py, 36);
          glow.addColorStop(0, 'rgba(139, 124, 246, 0.55)');
          glow.addColorStop(1, 'rgba(139, 124, 246, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, 36, 0, Math.PI * 2);
          ctx.fill();
        }
        if (isSelected) {
          ctx.strokeStyle = 'rgba(183, 175, 255, 0.8)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, r + 6, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = isActive ? '#B7AFFF' : '#E8ECF1';
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();

        // flip labels to the left near the right edge so they never clip
        // or run into a neighboring star's name
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.fillStyle = isActive ? '#FFFFFF' : 'rgba(232, 236, 241, 0.5)';
        const label = chains[i].name.toUpperCase();
        const tw = ctx.measureText(label).width;
        const lx = px + r + 7 + tw > w - 10 ? px - r - 7 - tw : px + r + 7;
        ctx.fillText(label, lx, py + 4);
      }

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

  const shown = hovered ?? selected;
  const chain = chains[shown];
  const related = LINKS.filter((l) => l.a === shown || l.b === shown).map((l) => ({
    name: chains[l.a === shown ? l.b : l.a].name,
    via: l.via,
  }));

  return (
    <section id="journey" data-story="constellation" className="relative px-5 py-24 sm:px-8 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionTag index="02" label="THE JOURNEY" />
          <GradientHeading style={{ fontSize: 'clamp(3rem, 10vw, 130px)' }}>
            18 chains
          </GradientHeading>
          <p className="mt-4 max-w-xl font-light leading-relaxed text-paper/70">
            Every star is a chain I have shipped on or designed for. Lines exist only where a real
            project spans both chains. Click a star to read the full expedition record.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-10 flex flex-col gap-4 lg:flex-row">
            {/* The map */}
            <div
              ref={wrapRef}
              className="relative h-[440px] flex-1 overflow-hidden rounded-3xl border border-paper/10 bg-ink md:h-[600px]"
              onMouseMove={(e) => {
                const rect = wrapRef.current!.getBoundingClientRect();
                mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
              }}
              onMouseLeave={() => {
                mouse.current = { x: -1, y: -1 };
                setHovered(null);
              }}
              onClick={() => {
                if (hoveredRef.current !== null) setSelected(hoveredRef.current);
              }}
            >
              <div className="ledger-grid absolute inset-0" />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            </div>

            {/* The expedition record — full detail, not a tooltip */}
            <aside className="glass flex w-full flex-col rounded-3xl p-7 lg:w-[380px]">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon/80">
                EXPEDITION RECORD
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold uppercase text-paper">
                {chain.name}
              </h3>
              <p className="mt-1 font-light text-sm leading-relaxed text-paper/60">{chain.role}</p>

              <div className="mt-6 space-y-4">
                {chain.projects.map((p) => (
                  <div key={p.name} className="border-l-2 border-electric/40 pl-4">
                    <p className="font-display text-sm font-semibold uppercase tracking-wide text-paper">
                      {p.name}
                    </p>
                    <p className="mt-0.5 font-light text-xs leading-relaxed text-paper/55">
                      {p.note}
                    </p>
                  </div>
                ))}
              </div>

              {related.length > 0 && (
                <div className="mt-auto pt-6">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">
                    CONNECTED CHAINS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {related.map((rel) => (
                      <button
                        key={rel.name + rel.via}
                        onClick={() => setSelected(nameToIdx.get(rel.name)!)}
                        className="rounded-full border border-electric/30 bg-electric/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-electric-glow transition-colors hover:bg-electric/25"
                        title={`via ${rel.via}`}
                      >
                        {rel.name} · {rel.via}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
