import { useRef } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Reveal } from '@/components/Reveal';
import { Ornamentos } from '@/components/Ornamentos';
import { PalavrasAnimadas } from '@/components/PalavrasAnimadas';
import { useParallax } from '@/lib/motion';

export function Hero() {
  const imagemRef = useRef<HTMLDivElement>(null);
  useParallax(imagemRef);

  return (
    <header className="relative isolate overflow-hidden bg-sand">
      <Ornamentos />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:gap-12 sm:px-8 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-20 pb-28 sm:pb-32 lg:pb-32">
        <div className="relative z-10 order-2 max-w-2xl lg:order-1">
          <Reveal>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-terracota mb-4 sm:mb-5 sm:text-sm">
              {eventConfig.tagline}
            </p>
          </Reveal>

          <h1 className="font-serif text-3xl leading-[1.15] text-coffee text-balance sm:text-6xl md:text-7xl">
            <PalavrasAnimadas texto="Coragem para Romper e Recomeçar" atraso={150} />
          </h1>

          <Reveal delay={240}>
            <p className="mt-5 text-base leading-relaxed text-coffee-soft max-w-lg sm:mt-6 sm:text-xl">
              {eventConfig.subtitle}
            </p>
          </Reveal>

          {/* Meta info */}
          <Reveal delay={360}>
            <div className="mt-6 flex flex-col gap-3 text-coffee-soft sm:mt-8 sm:flex-wrap sm:flex-row sm:gap-x-6">
              <span className="inline-flex items-center gap-2 text-sm sm:text-base">
                <Calendar size={18} className="flex-shrink-0 text-terracota" />
                {eventConfig.date}
              </span>
              <span className="inline-flex items-center gap-2 text-sm sm:text-base">
                <Clock size={18} className="flex-shrink-0 text-terracota" />
                {eventConfig.time}
              </span>
              <span className="inline-flex items-center gap-2 text-sm sm:text-base">
                <MapPin size={18} className="flex-shrink-0 text-terracota" />
                Encontro presencial
              </span>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="mt-8 sm:mt-10">
              <CheckoutButton className="w-full justify-center px-6 py-4 text-base sm:w-auto sm:px-9 sm:py-5 sm:text-lg">
                Garantir minha vaga por {eventConfig.price}
              </CheckoutButton>
            </div>
          </Reveal>

          <Reveal delay={620}>
            <p className="mt-4 text-sm text-coffee-soft sm:mt-5">
              Vagas limitadas a {eventConfig.spots}. Pagamento seguro pelo Mercado Pago (Pix ou cartão).
              A confirmação chega no seu e-mail.
            </p>
          </Reveal>
        </div>

        <Reveal delay={180} className="relative order-1 lg:order-2 lg:justify-self-end">
          <div ref={imagemRef} className="relative mx-auto max-w-[420px] will-change-transform sm:max-w-[560px]">
            <div className="absolute -inset-2 rounded-[1.75rem] border border-terracota/20 sm:-inset-5 sm:rounded-[2rem]" />
            <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-[#FFF6EE] to-[#F6E1CE] shadow-soft-lg sm:rounded-[1.75rem]">
              <img
                src="/images/logo-romper.webp"
                alt="Logo do Romper: um R dentro de um círculo, com uma porta aberta e um ramo de folhas"
                width={1952}
                height={1449}
                className="hero-zoom aspect-[4/5] w-full object-contain p-6 sm:aspect-square sm:p-10"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-4 left-3 animate-float-slow rounded-xl bg-cream px-4 py-2.5 shadow-soft sm:left-4 sm:rounded-2xl sm:px-5 sm:py-3">
              <p className="font-serif text-base italic text-terracota sm:text-lg">
                Existe algo novo do outro lado.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
        <div className="flex flex-col items-center gap-2 text-coffee-soft/60">
          <span className="text-xs uppercase tracking-[0.2em]">Descobrir</span>
          <div className="h-12 w-px bg-terracota/40 animate-float-slow" />
        </div>
      </div>
    </header>
  );
}
