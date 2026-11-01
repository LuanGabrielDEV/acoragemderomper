import type { ReactNode } from 'react';
import { CTAArrow } from '@/components/CTAButton';
import { ctaClasses, type CTAVariant } from '@/lib/cta';
import { useCheckout } from '@/lib/checkoutContext';
import { eventConfig } from '@/data/eventConfig';

/** Botão "Garantir minha vaga": abre a janela de inscrição (ou mostra "esgotado"). */
export function CheckoutButton({
  children,
  variant = 'primary',
  className = '',
  compacto = false,
}: {
  children: ReactNode;
  variant?: CTAVariant;
  className?: string;
  compacto?: boolean;
}) {
  const { abrir } = useCheckout();

  if (!eventConfig.vendasAbertas) {
    return (
      <a
        href={eventConfig.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={ctaClasses('olive', className, compacto)}
      >
        <span>{compacto ? 'Lista de espera' : 'Vagas esgotadas: entrar na lista de espera'}</span>
        <CTAArrow />
      </a>
    );
  }

  return (
    <button type="button" onClick={abrir} className={ctaClasses(variant, className, compacto)}>
      <span>{children}</span>
      <CTAArrow />
    </button>
  );
}
