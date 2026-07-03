import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { magnetic } from '../lib/stringtune';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Wins', href: '#wins' },
  { label: 'Contact', href: '#contact' },
];

// Floating glass nav: blurred pill, slides in from the top, and a soft
// background highlight glides between links as you hover (the shared
// layoutId makes framer-motion morph it from link to link).
export function Navbar() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full border transition-all duration-500 ${
        scrolled
          ? 'border-paper/15 bg-ink/70 shadow-[0_8px_40px_rgba(0,0,0,0.55)]'
          : 'border-paper/10 bg-ink/40'
      }`}
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center gap-1 px-2 py-2 sm:gap-2 sm:px-3" onMouseLeave={() => setHovered(null)}>
        <a
          href="#top"
          className="mr-1 rounded-full px-3 py-1.5 font-mono text-xs font-semibold tracking-tight text-electric-glow sm:text-sm"
          {...magnetic(160, 0.3)}
        >
          0xR
        </a>
        {LINKS.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onMouseEnter={() => setHovered(i)}
            className="st-magnetic relative rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-paper/80 transition-colors duration-200 hover:text-paper sm:px-4 sm:text-sm"
            {...magnetic(120, 0.35)}
          >
            <AnimatePresence>
              {hovered === i && (
                <motion.span
                  layoutId="nav-hover-pill"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.35, 0.35, 0, 1] }}
                  className="absolute inset-0 rounded-full bg-paper/10"
                />
              )}
            </AnimatePresence>
            <span className="relative">{link.label}</span>
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
