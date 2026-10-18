import { Heart, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function Organizers() {
  return (
    <section className="overflow-hidden bg-cream py-20 sm:py-32 bg-grain">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:gap-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
        <Reveal>
          <div className="relative mx-auto max-w-sm sm:max-w-md">
            <div className="absolute -inset-2 rounded-[1.5rem] border border-terracota/20 sm:-inset-5 sm:rounded-[2rem]" />
            <div className="relative overflow-hidden rounded-[1.25rem] bg-sand shadow-soft-lg sm:rounded-[1.75rem]">
              <img
                src="/images/02.jpeg"
                alt="Wirlla Dantas e Soraia, organizadoras e palestrantes do encontro"
                className="aspect-[4/5] w-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 right-3 flex items-center gap-2 rounded-xl bg-terracota px-4 py-2.5 text-cream shadow-soft sm:-right-8 sm:rounded-2xl sm:px-5 sm:py-3">
              <Heart size={16} fill="currentColor" className="flex-shrink-0 sm:!h-[17px] sm:!w-[17px]" />
              <span className="text-xs font-semibold sm:text-sm">Duas mulheres, uma travessia</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <SectionHeading eyebrow="Quem conduz esta experiência" title="Duas vozes para acompanhar o seu recomeço" align="left">
            <p>
              Este encontro nasceu do desejo de criar uma pausa verdadeira: um espaço de escuta,
              reflexão e movimento, conduzido com acolhimento por quem também acredita na potência
              de uma decisão corajosa.
            </p>
          </SectionHeading>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
            <div className="rounded-2xl bg-sand p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-nude/60 text-terracota">
                <Sparkles size={21} strokeWidth={1.6} />
              </div>
              <h3 className="mt-4 font-serif text-xl text-coffee sm:mt-5 sm:text-2xl">Wirlla Dantas</h3>
              <p className="mt-2 text-sm text-coffee-soft leading-relaxed sm:text-base">Organizadora e palestrante</p>
            </div>
            <div className="rounded-2xl bg-sand p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-nude/60 text-terracota">
                <Sparkles size={21} strokeWidth={1.6} />
              </div>
              <h3 className="mt-4 font-serif text-xl text-coffee sm:mt-5 sm:text-2xl">Soraia Ferreira</h3>
              <p className="mt-2 text-sm text-coffee-soft leading-relaxed sm:text-base">Organizadora e palestrante</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
