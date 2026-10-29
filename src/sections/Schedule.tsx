import { useRef } from 'react';
import { Check, Calendar, Clock } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { Ornamentos } from '@/components/Ornamentos';
import { useEmVista, useProgressoDeRolagem } from '@/lib/motion';

const includedItems = [
  'Material de escrita e reflexão',
  'Coffee break',
  'Experiência relaxante com massagem e escalda-pés',
  'Espaço acolhedor',
  'Encontro guiado e presencial',
];

type Momento = (typeof eventConfig.schedule)[number];

/** Um momento do cronograma: o número "pula" e o card entra de lado quando aparece na tela. */
function MomentoItem({ moment, i }: { moment: Momento; i: number }) {
  const [ref, visivel] = useEmVista<HTMLDivElement>();
  const esquerda = i % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-4 sm:gap-0 ${esquerda ? 'sm:flex-row tl-esq' : 'sm:flex-row-reverse tl-dir'} ${
        visivel ? 'is-visible' : ''
      }`}
    >
      {/* Número */}
      <div className="relative z-10 flex-shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
        <div className="tl-dot-inner flex h-12 w-12 items-center justify-center rounded-full bg-terracota text-cream font-serif text-base shadow-soft sm:h-14 sm:w-14 sm:text-lg">
          {i + 1}
        </div>
      </div>

      {/* Card */}
      <div className={`flex-1 sm:w-1/2 sm:flex-none ${esquerda ? 'sm:pr-16 sm:text-right' : 'sm:pl-16'}`}>
        <div className="tl-card">
          <div className="rounded-2xl bg-sand p-5 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-soft-lg sm:p-6">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-terracota">
              {moment.time}
            </p>
            <h3 className="mt-2 font-serif text-xl text-coffee">{moment.title}</h3>
            <p className="mt-2 text-coffee-soft leading-relaxed">{moment.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Schedule() {
  const linhaRef = useRef<HTMLDivElement>(null);
  const preenchimentoRef = useRef<HTMLDivElement>(null);
  useProgressoDeRolagem(linhaRef, preenchimentoRef);

  return (
    <section className="relative isolate overflow-hidden bg-cream py-20 sm:py-32 bg-grain">
      <Ornamentos tom="oliva" />
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Como será o encontro">
            O que acontece no encontro, em ordem
          </SectionHeading>
        </Reveal>

        {/* Timeline */}
        <div ref={linhaRef} className="mt-12 sm:mt-16 relative">
          {/* Linha vertical: a base fica clara e o preenchimento cresce conforme a rolagem */}
          <div className="absolute left-[23px] sm:left-1/2 top-0 bottom-0 w-px bg-terracota/20 sm:-translate-x-1/2" />
          <div
            ref={preenchimentoRef}
            className="tl-fill absolute left-[23px] sm:left-1/2 top-0 bottom-0 w-px bg-terracota sm:-translate-x-1/2"
          />

          <div className="space-y-8 sm:space-y-10">
            {eventConfig.schedule.map((moment, i) => (
              <MomentoItem key={moment.title} moment={moment} i={i} />
            ))}
          </div>
        </div>

        {/* Included */}
        <Reveal delay={200}>
          <div className="mt-16 rounded-3xl bg-olive/8 p-6 sm:mt-20 sm:p-10 border border-olive/15">
            <h3 className="font-serif text-xl sm:text-2xl text-coffee text-center">O que está incluso</h3>
            <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              {includedItems.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-olive text-cream">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-coffee">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-coffee-soft">
              <span className="inline-flex items-center gap-2">
                <Calendar size={16} className="text-olive-dark" /> {eventConfig.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={16} className="text-olive-dark" /> {eventConfig.time}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
