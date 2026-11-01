import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';

/** Botão flutuante do WhatsApp. Aparece depois da abertura e some no rodapé, que já tem o contato. */
export function WhatsAppFloat() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const atualizar = () => {
      const passouAbertura = window.scrollY > window.innerHeight * 0.85;
      // No rodapé (que já tem o WhatsApp) o botão some para não ficar sobre o mesmo verde.
      const rodape = document.querySelector('footer');
      const noRodape = !!rodape && rodape.getBoundingClientRect().top < window.innerHeight - 80;
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

  return (
    <a
      href={eventConfig.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
      className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-olive-dark text-cream shadow-soft-lg transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-coffee sm:bottom-7 sm:right-7 ${
        visivel ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <MessageCircle size={26} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}
