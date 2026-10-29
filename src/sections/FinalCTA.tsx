import { MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Reveal } from '@/components/Reveal';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-coffee py-20 sm:py-32">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/01.jpeg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee via-coffee/80 to-coffee/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-5 sm:px-8 text-center">
        <Reveal>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-nude mb-4 sm:mb-5 sm:text-sm">
            22/11, às 14h
          </p>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="font-serif text-2xl leading-tight sm:text-5xl text-cream text-balance">
            Qual decisão você vem adiando por medo?
          </h2>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-5 text-base sm:mt-6 sm:text-lg text-cream/80 leading-relaxed">
            Vagas limitadas a {eventConfig.spots}. Garanta a sua e receba a confirmação por e-mail.
          </p>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-8 flex flex-col items-center gap-5 sm:mt-10">
            <CheckoutButton className="w-full justify-center text-base sm:w-auto sm:text-lg sm:px-10 sm:py-5">
              Garantir minha vaga por {eventConfig.price}
            </CheckoutButton>

            <a
              href={eventConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cream/75 hover:text-cream transition-colors duration-300 text-base"
            >
              <MessageCircle size={18} />
              Tirar dúvidas no WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
