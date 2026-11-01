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
export function ctaClasses(variant: CTAVariant = 'primary', className = '', compacto = false) {
  const tamanho = compacto
    ? 'min-h-[2.75rem] px-5 py-2 text-base'
    : 'min-h-[3.5rem] px-7 py-3.5 text-base sm:px-8 sm:text-lg';
  return `group inline-flex items-center justify-center gap-2.5 rounded-full font-bold transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota ${tamanho} ${variantClasses[variant]} ${className}`;
}
