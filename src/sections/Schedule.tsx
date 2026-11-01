import { useRef } from 'react';
import { eventConfig } from '@/data/eventConfig';
import { Folha, Visto } from '@/components/Folha';
import { Reveal } from '@/components/Reveal';
import { useProgressoDeRolagem } from '@/lib/motion';

const incluso = [
  'Material de escrita e reflexão',
  'Coffee break',
  'Experiência relaxante com massagem e escalda-pés',
  'Espaço acolhedor',
  'Encontro guiado e presencial',
];

export function Schedule() {
  const linhaRef = useRef<HTMLOListElement>(null);
  const preenchimentoRef = useRef<HTMLDivElement>(null);
  useProgressoDeRolagem(linhaRef, preenchimentoRef);

  return (
    <Folha id="a-tarde" titulo="O que acontece no encontro, em ordem">
      <ol ref={linhaRef} className="relative mt-12 max-w-3xl space-y-10 sm:space-y-12">
        {/* Linha do tempo: a base é clara e o preenchimento cresce conforme a rolagem */}
        <div aria-hidden="true" className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-terracota/20 sm:left-[1.625rem]" />
        <div
          ref={preenchimentoRef}
          aria-hidden="true"
          className="tl-fill absolute bottom-6 left-[1.375rem] top-6 w-px bg-terracota sm:left-[1.625rem]"
        />
        {eventConfig.schedule.map((m, i) => (
          <li key={m.title} className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-x-6">
            <span
              aria-hidden="true"
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-terracota font-serif text-lg text-cream sm:h-[3.25rem] sm:w-[3.25rem] sm:text-xl"
            >
              {i + 1}
            </span>
            <Reveal>
              <h3 className="text-2xl text-coffee sm:text-3xl">{m.title}</h3>
              <p className="mt-2 max-w-[60ch] text-coffee-soft">{m.desc}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal>
        <div className="mt-14 max-w-3xl rounded-[1.25rem] bg-sand p-6 sm:p-8">
          <h3 className="text-2xl text-coffee">O que está incluso</h3>
          <ul className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {incluso.map((item) => (
              <li key={item} className="flex items-start gap-3 text-coffee">
                <Visto className="mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Folha>
  );
}
