import { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CheckoutButton } from '@/components/CheckoutButton';
import { prefereMenosMovimento } from '@/lib/motion';

/**
 * "A Decisão": a pergunta final, a frase "meu próximo passo" que se escreve
 * sozinha quando aparece na tela, e o botão de inscrição logo abaixo.
 */
export function FinalCTA() {
  const escritaRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = escritaRef.current;
    if (!el || prefereMenosMovimento() || !('IntersectionObserver' in window)) return;
    // Só esconde a linha se ela ainda não está na tela (nunca some diante da pessoa).
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;

    el.classList.add('aguardando');
    // Observa o bloco em volta (o próprio texto está recortado e não "aparece" para o observer).
    const alvo = el.parentElement ?? el;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add('escrevendo');
        el.classList.remove('aguardando');
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(alvo);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="a-decisao" aria-labelledby="a-decisao-titulo" className="relative scroll-mt-6 overflow-hidden bg-coffee py-16 sm:py-28">
      {/* Logo clara e translúcida ao fundo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end">
        <img
          src="/images/logo-romper.webp"
          alt=""
          width={1952}
          height={1449}
          className="silhueta-clara w-[90%] max-w-3xl translate-x-[20%] object-contain opacity-[0.06]"
          loading="lazy"
        />
      </div>
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <h2 id="a-decisao-titulo" className="max-w-4xl text-[2.25rem] leading-[1.08] text-cream sm:text-6xl">
          Se o medo não fosse o narrador, qual seria a sua próxima decisão?
        </h2>

        <div className="mt-10 max-w-2xl">
          <p className="text-sm font-medium text-cream/75">Meu próximo passo</p>
          <p ref={escritaRef} className="escrita mt-1 font-serif text-2xl italic leading-snug text-nude sm:text-3xl">
            garantir minha vaga e estar lá no dia {eventConfig.date.slice(0, 5)}.
          </p>
          <div aria-hidden="true" className="mt-3 h-px bg-cream/30" />
        </div>

        <div className="mt-10 max-w-2xl">
          <CheckoutButton variant="papel" className="w-full sm:w-auto">Garantir minha vaga · {eventConfig.price}</CheckoutButton>
          <p className="mt-4 text-cream/85">
            Vagas limitadas a {eventConfig.spots}. {eventConfig.garantia}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream/85 sm:text-base">
            No Pix ou no cartão aparece o nome de {eventConfig.recebedor}, desenvolvedor deste site e responsável
            pelos pagamentos.{' '}
            <a href="#duvidas" className="font-bold text-cream underline decoration-cream/50 hover:decoration-cream">
              Entenda
            </a>
          </p>
          <a
            href={eventConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[2.75rem] items-center gap-2 font-bold text-cream underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Tirar dúvidas no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
