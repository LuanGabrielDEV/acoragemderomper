import { Heart, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { Ornamentos } from '@/components/Ornamentos';

export function Organizers() {
  return (
    <section className="relative isolate overflow-hidden bg-cream py-20 sm:py-32 bg-grain">
      <Ornamentos tom="oliva" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:gap-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
        <Reveal>
          <div className="relative mx-auto max-w-sm sm:max-w-md">
            <div className="absolute -inset-2 rounded-[1.5rem] border border-terracota/20 sm:-inset-5 sm:rounded-[2rem]" />
            <div className="relative overflow-hidden rounded-[1.25rem] bg-sand shadow-soft-lg sm:rounded-[1.75rem]">
              <img
                src="/images/02.jpeg"
                alt="Wirlla Dantas e Soraia Ferreira, que conduzem o encontro"
                className="aspect-[4/5] w-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 right-3 flex items-center gap-2 rounded-xl bg-terracota px-4 py-2.5 text-cream shadow-soft sm:-right-8 sm:rounded-2xl sm:px-5 sm:py-3">
              <Heart size={16} fill="currentColor" className="flex-shrink-0 sm:!h-[17px] sm:!w-[17px]" />
              <span className="text-xs font-semibold sm:text-sm">Wirlla e Soraia</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <SectionHeading eyebrow="Quem conduz esta experiência" title="Quem recebe você no encontro" align="left">
            <p>
              Wirlla e Soraia criaram este encontro para dar às mulheres uma pausa: um tempo para
              escutar, refletir e decidir o que vem depois.
            </p>
          </SectionHeading>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
            <div className="rounded-2xl bg-sand p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-nude/60 text-terracota">
                <Sparkles size={21} strokeWidth={1.6} />
              </div>
              <h3 className="mt-4 font-serif text-xl text-coffee sm:mt-5 sm:text-2xl">Wirlla Dantas</h3>
              <p className="mt-2 text-sm text-coffee-soft leading-relaxed sm:text-base">Mentora de Recomeços e Desenvolvimento Pessoal</p>
            </div>
            <div className="rounded-2xl bg-sand p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-nude/60 text-terracota">
                <Sparkles size={21} strokeWidth={1.6} />
              </div>
              <h3 className="mt-4 font-serif text-xl text-coffee sm:mt-5 sm:text-2xl">Soraia Ferreira</h3>
              <p className="mt-2 text-sm text-coffee-soft leading-relaxed sm:text-base">Terapeuta Cristã do Emocional Feminino</p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Palestrante convidada */}
      <div className="mx-auto mt-14 max-w-6xl px-5 sm:mt-20 sm:px-8">
        <Reveal>
          <article className="grid overflow-hidden rounded-3xl bg-sand shadow-soft-lg md:grid-cols-[0.8fr_1.2fr]">
            <div className="relative">
              <img
                src="/images/lu-santos.jpg"
                alt="Lu Santos, palestrante convidada do encontro"
                className="aspect-[4/5] h-full w-full object-cover object-top md:aspect-auto"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-terracota">
                Palestrante convidada
              </p>
              <h3 className="mt-3 font-serif text-2xl text-coffee sm:text-3xl">Lu Santos</h3>
              <p className="mt-1 text-sm font-medium text-olive-dark sm:text-base">Palestrante</p>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-coffee-soft sm:text-base">
                <p>
                  Especialista em Harmonização Facial e palestrante, com atuação voltada à estética,
                  ao posicionamento profissional e à construção de autoridade.
                </p>
                <p>
                  Através de sua experiência na prática clínica e no ambiente digital, compartilha
                  conhecimentos sobre como transformar competência em valor percebido, construir
                  credibilidade e desenvolver uma presença profissional autêntica e estratégica.
                </p>
                <p>
                  Suas palestras conectam imagem, comunicação e posicionamento, mostrando como a forma
                  como nos apresentamos influencia a confiança que despertamos e as oportunidades que
                  construímos.
                </p>
                <p>
                  Seu propósito é inspirar profissionais a reconhecerem o valor do que fazem e
                  aprenderem a comunicá-lo com clareza, autenticidade e intenção.
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
