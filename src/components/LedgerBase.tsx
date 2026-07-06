import { useEffect, useRef } from 'react';
import { hiddenDocs } from '../data/profile';

// Same 14×6 title field as the old Hero SpotlightLayer — real research doc
// titles and audit finding IDs, offset per row so they never line up.
const ROWS = Array.from({ length: 14 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) => hiddenDocs[(r * 5 + c * 3) % hiddenDocs.length]),
);

function TitleField({ opacity }: { opacity: number }) {
  return (
    <div className="flex h-full flex-col justify-between py-6" style={{ opacity }}>
      {ROWS.map((row, r) => (
        <div
          key={r}
          className="flex w-max gap-10 whitespace-nowrap font-mono text-xs tracking-[0.15em]"
          style={{ transform: `translateX(${-((r * 137) % 400)}px)` }}
        >
          {row.map((doc, c) => (
            <span
              key={c}
              className={
                doc.startsWith('[')
                  ? 'text-neon'
                  : c % 3 === 0
                    ? 'text-electric-glow'
                    : 'text-paper/60'
              }
            >
              {doc}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// The Ledger Base — a global fixed backdrop the whole site stacks over.
// Grid + a dim always-on title field, plus a brighter copy revealed only
// inside a cursor-trailing spotlight (fine pointers). The dim→bright jump
// under the cursor is the effect.
export function LedgerBase() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;
    let tx = -999;
    let ty = -999;
    let x = -999;
    let y = -999;
    let raf = 0;
    // fixed layer aligns with the viewport, so client coords map straight in
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.setProperty('--sx', `${x}px`);
      el.style.setProperty('--sy', `${y}px`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="ledger-grid absolute inset-0" />
      <div className="absolute inset-0">
        <TitleField opacity={0.2} />
      </div>
      <div ref={ref} className="spotlight-layer absolute inset-0">
        <TitleField opacity={0.7} />
      </div>
    </div>
  );
}
