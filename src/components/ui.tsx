import { ArrowUpRight } from 'lucide-react';

// Primary pill — clean electric outline with glow, Explorer's Ledger style
export function ContactButton({ href = '#contact', label = 'Contact Me' }: { href?: string; label?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 rounded-full border-2 border-electric px-8 py-3 text-xs font-medium uppercase tracking-widest text-paper transition-all duration-300 hover:bg-electric hover:text-white hover:shadow-[0_0_28px_rgba(46,107,255,0.45)] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
    >
      {label}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

// Ghost pill — secondary actions (project links)
export function GhostButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border-2 border-paper/70 px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-paper transition-colors duration-200 hover:border-electric hover:bg-electric/10 hover:text-electric-glow sm:px-8 sm:py-3 sm:text-sm"
    >
      {label}
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

// Monospace section label, e.g. "// 03 — PROJECTS"
export function SectionTag({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-6 font-mono text-xs tracking-[0.3em] text-electric-glow/80 sm:text-sm">
      {'// '}
      {index} — {label}
    </div>
  );
}
