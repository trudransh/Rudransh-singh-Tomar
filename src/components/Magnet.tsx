import { ReactNode, useEffect, useRef } from 'react';

// Mouse-following magnetic hover. Activates when the cursor comes within
// `padding` px of the element; the element leans toward the cursor by
// distance / strength. Desktop (fine pointer) only.
export function Magnet({
  children,
  padding = 120,
  strength = 4,
  className = '',
}: {
  children: ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const within =
        e.clientX > r.left - padding &&
        e.clientX < r.right + padding &&
        e.clientY > r.top - padding &&
        e.clientY < r.bottom + padding;

      if (within) {
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transition = 'transform 0.3s ease-out';
        el.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`;
      } else {
        el.style.transition = 'transform 0.6s ease-in-out';
        el.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [padding, strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
