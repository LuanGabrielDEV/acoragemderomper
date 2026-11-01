import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CheckoutButton } from '@/components/CheckoutButton';
import { useContagem } from '@/lib/contagem';

/**
 * Barra de inscrição que acompanha a rolagem depois da abertura:
 * embaixo no celular (ao alcance do polegar), em cima no desktop.
 * Some no rodapé, que já tem o próprio botão.
 */
export function BarraInscricao() {
  const [visivel, setVisivel] = useState(false);
  const c = useContagem(eventConfig.inicio);

  useEffect(() => {
    const atualizar = () => {
      const passouAbertura = window.scrollY > window.innerHeight * 0.9;
      const rodape = document.querySelector('footer');
      const noRodape = !!rodape && rodape.getBoundingClientRect().top < window.innerHeight - 40;
      setVisivel(passouAbertura && !noRodape);
    };
    atualizar();
    window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    return () => {
      window.removeEventListener('scroll', atualizar);
      window.removeEventListener('resize', atualizar);
    };
  }, []);

  const falta = c.terminou ? '' : c.dias > 0 ? `Faltam ${c.dias} ${c.dias === 1 ? 'dia' : 'dias'}` : 'É hoje';

  return (
    <div
      aria-hidden={!visivel}
      {...(visivel ? {} : { inert: "" })}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-cream shadow-[0_-8px_24px_-12px_rgba(43,33,28,0.25)] transition-transform duration-300 ease-out sm:bottom-auto sm:top-0 sm:border-b sm:border-t-0 sm:shadow-[0_8px_24px_-12px_rgba(43,33,28,0.25)] ${
        visivel ? 'translate-y-0' : 'translate-y-full sm:-translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 sm:px-8">
        <div className="min-w-0 flex-1">
          <p className="hidden truncate font-serif text-lg text-coffee sm:block">{eventConfig.eventName}</p>
          <p className="text-sm leading-tight text-coffee-soft">
            <span className="block font-bold text-terracota sm:inline">{falta}</span>
            <span className="hidden sm:inline">{falta && ' · '}</span>
            <span className="block truncate sm:inline">
              {eventConfig.date.slice(0, 5)} ·{' '}
              <span className="sm:hidden">{(eventConfig.cidade || 'presencial').split(' - ')[0]}</span>
              <span className="hidden sm:inline">{eventConfig.cidade || 'presencial'}</span>
            </span>
          </p>
        </div>
        <a
          href={eventConfig.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-coffee/20 text-olive-dark hover:bg-sand sm:hidden"
        >
          <MessageCircle size={20} aria-hidden="true" />
        </a>
        <CheckoutButton compacto className="flex-shrink-0">
          <span className="sm:hidden">Garantir vaga</span>
          <span className="hidden sm:inline">Garantir minha vaga · {eventConfig.price}</span>
        </CheckoutButton>
      </div>
    </div>
  );
}
