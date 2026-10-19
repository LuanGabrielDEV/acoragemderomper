import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { ctaClasses, type CTAVariant } from '@/lib/cta';

export function CTAArrow() {
  return (
    <ArrowRight
      size={20}
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  );
}

export function CTAButton({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: CTAVariant;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={ctaClasses(variant, className)}
    >
      <span>{children}</span>
      <CTAArrow />
    </a>
  );
}
