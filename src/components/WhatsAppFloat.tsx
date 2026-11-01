import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';

/** Botão flutuante do WhatsApp (desktop). No celular o WhatsApp fica na barra de inscrição. */
export function WhatsAppFloat() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    // No rodapé (que já tem o WhatsApp) o botão some para não ficar sobre o mesmo verde.
    const rodape = document.querySelector('footer');
    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const passouAbertura = window.scrollY > window.innerHeight * 0.85;
      const noRodape = !!rodape && rodape.getBoundingClientRect().top < window.innerHeight - 80;
      setVisivel(passouAbertura && !noRodape);
    };
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      if (quadro) cancelAnimationFrame(quadro);
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
      className={`fixed bottom-5 right-5 z-50 hidden h-14 w-14 sm:flex items-center justify-center rounded-full bg-olive-dark text-cream shadow-soft-lg transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-coffee sm:bottom-7 sm:right-7 ${
        visivel ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <MessageCircle size={26} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}
