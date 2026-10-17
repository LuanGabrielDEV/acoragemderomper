import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  children,
  className = '',
  align = 'center',
}: {
  eyebrow?: string;
  title?: string;
  children?: ReactNode;
  className?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div className={`${align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left max-w-xl'} ${className}`}>
      {eyebrow && (
        <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-terracota mb-3 sm:text-sm">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-coffee text-balance leading-tight">
        {title ?? children}
      </h2>
      {title && children && <div className="mt-5 text-coffee-soft text-lg leading-relaxed">{children}</div>}
    </div>
  );
}
