import { CSSProperties, ReactNode } from 'react';

// Giant section heading with a hover surprise: the silver gradient fill
// crossfades into a flowing vibrant violet→cyan→pink→amber gradient.
// `base="ink"` for headings that sit on the white vault section.
export function GradientHeading({
  children,
  className = '',
  style,
  base = 'silver',
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  base?: 'silver' | 'ink';
}) {
  return (
    <h2
      className={`group relative font-display font-black uppercase leading-none tracking-tight ${className}`}
      style={style}
    >
      <span className={base === 'silver' ? 'hero-heading' : 'text-ink'}>{children}</span>
      <span
        aria-hidden
        className="vibrant-gradient absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        {children}
      </span>
    </h2>
  );
}
