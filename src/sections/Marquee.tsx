import { useEffect, useRef } from 'react';
import { marqueeItems } from '../data/profile';

// Two rows tied to scroll position — row 1 drifts right, row 2 drifts left
// as the page scrolls (the Jack-portfolio trick, with your record instead
// of stock GIFs). RAF-throttled, passive listener.
export function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1 = useRef<HTMLDivElement>(null);
  const row2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.3;
      if (row1.current) row1.current.style.transform = `translateX(${offset - 700}px)`;
      if (row2.current) row2.current.style.transform = `translateX(${-offset - 100}px)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const rowA = [...marqueeItems.slice(0, 5), ...marqueeItems.slice(0, 5), ...marqueeItems.slice(0, 5)];
  const rowB = [...marqueeItems.slice(5), ...marqueeItems.slice(5), ...marqueeItems.slice(5)];

  return (
    <section ref={sectionRef} className="overflow-hidden pb-10 pt-20 sm:pt-24 md:pt-28" aria-hidden>
      <div className="flex flex-col gap-3">
        <div ref={row1} className="marquee-row flex w-max items-center gap-8 whitespace-nowrap">
          {rowA.map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="font-display text-4xl font-black uppercase tracking-tight text-paper/90 md:text-6xl">
                {item}
              </span>
              <span className="font-mono text-2xl text-electric md:text-3xl">{'//'}</span>
            </span>
          ))}
        </div>
        <div ref={row2} className="marquee-row flex w-max items-center gap-8 whitespace-nowrap">
          {rowB.map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="marquee-outline font-display text-4xl font-black uppercase tracking-tight md:text-6xl">
                {item}
              </span>
              <span className="font-mono text-2xl text-electric-glow/60 md:text-3xl">{'//'}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
