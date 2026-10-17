import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'olive';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-terracota text-cream hover:bg-terracota-dark shadow-soft-lg',
  secondary:
    'bg-transparent border border-coffee/25 text-coffee hover:bg-coffee hover:text-cream',
  olive: 'bg-olive text-cream hover:bg-olive-dark shadow-soft-lg',
};

export function CTAButton({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:px-8 sm:py-4 ${variantClasses[variant]} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight
        size={20}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </a>
  );
}
