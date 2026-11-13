import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  center?: boolean;
  id?: string;
};

export function SectionHeading({ title, subtitle, center = true, id }: Props) {
  return (
    <div id={id} className={`mb-12 ${center ? 'text-center' : ''}`}>
      <div className={`inline-flex items-center gap-2 mb-4 ${center ? '' : ''}`}>
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent-400" />
        <span className="text-accent-400 text-sm font-medium tracking-widest uppercase">
          {title}
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent-400" />
      </div>
      {subtitle && (
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-white text-balance max-w-2xl mx-auto">
          {subtitle}
        </h2>
      )}
    </div>
  );
}

export function GlowDot({ className = '' }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 ${className}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-400" />
    </span>
  );
}

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-gray-300 ${className}`}
    >
      {children}
    </span>
  );
}
