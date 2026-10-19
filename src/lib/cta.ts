export type CTAVariant = 'primary' | 'secondary' | 'olive';

const variantClasses: Record<CTAVariant, string> = {
  primary:
    'bg-terracota text-cream hover:bg-terracota-dark shadow-soft-lg',
  secondary:
    'bg-transparent border border-coffee/25 text-coffee hover:bg-coffee hover:text-cream',
  olive: 'bg-olive text-cream hover:bg-olive-dark shadow-soft-lg',
};

/** Classes do botão, reaproveitadas também pelo CheckoutButton (que é um <button>). */
export function ctaClasses(variant: CTAVariant = 'primary', className = '') {
  return `group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota sm:px-8 sm:py-4 ${variantClasses[variant]} ${className}`;
}
