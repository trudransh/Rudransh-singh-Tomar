import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, MotionValue } from 'framer-motion';

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

// --- HighlightText: scroll-scrubbed word reveal with accent keywords -----
export type TextSegment = { text: string; highlight?: boolean };

export function HighlightText({
  segments,
  className = '',
}: {
  segments: TextSegment[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  // completes while the paragraph is still mid-viewport, so it never sits
  // half-faded the way the old character effect did
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.92', 'start 0.4'],
  });

  const words = segments.flatMap((seg) =>
    seg.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, h: !!seg.highlight })),
  );

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} index={i} total={words.length} word={word} />
      ))}
    </p>
  );
}

function Word({
  progress,
  index,
  total,
  word,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  word: { w: string; h: boolean };
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={word.h ? 'font-medium text-electric-glow' : undefined}
    >
      {word.w}{' '}
    </motion.span>
  );
}

// --- Counter: animated stat number ---------------------------------------
// once=false makes it re-run every time it scrolls into view.
export function Counter({
  value,
  prefix = '',
  suffix = '',
  className = '',
  once = true,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: '-40px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) {
      if (!once) setN(0); // rewind so the next entrance re-counts
      return;
    }
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
  }, [inView, value, once]);

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
