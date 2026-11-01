import { useEffect, useRef, useState } from 'react';
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

  // Momento em destaque: o último que já passou da metade da tela.
  const [ativo, setAtivo] = useState(-1);
  useEffect(() => {
    const lista = linhaRef.current;
    if (!lista) return;
    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const itens = Array.from(lista.querySelectorAll('li'));
      const meio = window.innerHeight * 0.55;
      let i = -1;
      itens.forEach((li, idx) => {
        if (li.getBoundingClientRect().top < meio) i = idx;
      });
      setAtivo(i);
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
              className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border font-serif text-lg transition-[background-color,color,box-shadow,transform] duration-500 ease-out sm:h-[3.25rem] sm:w-[3.25rem] sm:text-xl ${
                i <= ativo
                  ? 'border-terracota bg-terracota text-cream'
                  : 'border-terracota/40 bg-cream text-terracota'
              } ${i === ativo ? 'scale-110 shadow-[0_0_0_6px_rgba(156,74,44,0.14)]' : ''}`}
            >
              {i + 1}
            </span>
            <Reveal>
              <h3 className={`text-2xl transition-colors duration-500 sm:text-3xl ${i === ativo ? 'text-terracota' : 'text-coffee'}`}>{m.title}</h3>
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
