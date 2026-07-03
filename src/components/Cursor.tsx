import { useEffect, useRef } from 'react';

// Custom cursor: ring + 0x glyph, mix-blend exclusion so it reads on both
// the dark ledger and the white vault section. Desktop (fine pointer) only.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;

    document.documentElement.classList.add('cursor-hidden');
    el.style.display = 'block';

    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement | null;
      el.classList.toggle('cursor-hot', !!t?.closest('a, button, canvas'));
    };

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('cursor-hidden');
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ display: 'none' }}
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-exclusion"
      aria-hidden
    >
      <div className="cursor-ring flex h-10 w-10 items-center justify-center rounded-full border-2 border-white transition-transform duration-300">
        <span className="font-mono text-[10px] font-medium text-white">0x</span>
      </div>
    </div>
  );
}
