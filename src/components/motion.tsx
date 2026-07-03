import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

// --- FadeIn: viewport-triggered entrance --------------------------------
export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// --- ScrambleText: name resolves out of hex noise ------------------------
const HEX = '0123456789abcdefx';

export function ScrambleText({ text, className = '' }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 34; // frames until fully resolved
    const id = setInterval(() => {
      frame++;
      const resolved = Math.floor((frame / total) * text.length);
      setDisplay(
        text
          .split('')
          .map((ch, i) =>
            i < resolved || ch === ' ' ? ch : HEX[Math.floor(Math.random() * HEX.length)],
          )
          .join(''),
      );
      if (frame >= total) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

// --- AnimatedText: character-by-character scroll reveal -------------------
export function AnimatedText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });
  const chars = text.split('');

  return (
    <p ref={ref} className={className}>
      {chars.map((ch, i) => (
        <Char key={i} progress={scrollYProgress} index={i} total={chars.length} char={ch} />
      ))}
    </p>
  );
}

function Char({
  progress,
  index,
  total,
  char,
}: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  index: number;
  total: number;
  char: string;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

// --- Counter: animated stat number ---------------------------------------
export function Counter({
  value,
  prefix = '',
  suffix = '',
  className = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const formatted =
    value >= 1000
      ? Math.round(n).toLocaleString('en-US')
      : Number.isInteger(value)
        ? String(Math.round(n))
        : n.toFixed(1);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
