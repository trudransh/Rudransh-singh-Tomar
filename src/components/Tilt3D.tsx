import { ReactNode, useEffect, useRef } from 'react';

// The bank-card-carousel motion system, extracted: interactive 3D parallax
// tilt with inertia damping (the transform lags the cursor and eases into
// place), plus volumetric thickness from stacked layers behind the face.
// RAF loop, no animation library.
export function Tilt3D({
  children,
  maxTiltX = 7,
  maxTiltY = 10,
  radiusClass = 'rounded-[36px] sm:rounded-[44px] md:rounded-[52px]',
  className = '',
}: {
  children: ReactNode;
  maxTiltX?: number;
  maxTiltY?: number;
  radiusClass?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    // Inertia damping: current eases toward target at 8%/frame,
    // so the card trails the cursor instead of snapping to it.
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      inner.style.transform = `rotateX(${(-cy * maxTiltX).toFixed(2)}deg) rotateY(${(cx * maxTiltY).toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };

    wrap.addEventListener('mousemove', onMove, { passive: true });
    wrap.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [maxTiltX, maxTiltY]);

  return (
    <div ref={wrapRef} className={className} style={{ perspective: '1350px' }}>
      <div
        ref={innerRef}
        className="relative"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* volumetric thickness: two structural slices behind the face */}
        <div
          className={`pointer-events-none absolute inset-0 ${radiusClass} border border-paper/20 bg-[#2a2a38]`}
          style={{ transform: 'translateZ(-2.5px)' }}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-0 ${radiusClass} border border-paper/10 bg-[#1c1c28]`}
          style={{ transform: 'translateZ(-1.25px)' }}
          aria-hidden
        />
        <div style={{ transform: 'translateZ(0px)' }}>{children}</div>
      </div>
    </div>
  );
}
