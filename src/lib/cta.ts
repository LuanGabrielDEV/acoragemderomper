export type CTAVariant = 'primary' | 'secondary' | 'olive' | 'papel';

const variantClasses: Record<CTAVariant, string> = {
  // Barro sobre a folha: a ação principal
  primary: 'bg-terracota text-cream hover:bg-terracota-dark',
  secondary: 'bg-transparent border border-coffee/30 text-coffee hover:bg-coffee hover:text-cream',
  olive: 'bg-olive text-cream hover:bg-olive-dark',
  // Claro, para fundos escuros
  papel: 'bg-cream text-terracota-dark hover:bg-sand',
};

/** Classes do botão, reaproveitadas também pelo CheckoutButton (que é um <button>). */
export function ctaClasses(variant: CTAVariant = 'primary', className = '') {
  return `group inline-flex min-h-[3.5rem] items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-base font-bold transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota sm:px-8 sm:text-lg ${variantClasses[variant]} ${className}`;
}
