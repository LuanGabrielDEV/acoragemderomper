import { useEffect, useRef } from 'react';
import { eventConfig } from '@/data/eventConfig';

/** Faixa corrida com os momentos da tarde e os dados do encontro. */
export function FaixaMomentos() {
  const ref = useRef<HTMLDivElement>(null);

  // A animação só roda enquanto a faixa está na tela.
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(([e]) => el.classList.toggle('pausada', !e.isIntersecting));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const itens = [
    ...eventConfig.schedule.map((m) => m.title),
    `${eventConfig.date.slice(0, 5)}, a partir das 14h`,
    eventConfig.cidade || 'Encontro presencial',
    eventConfig.spots,
  ];
  const linha = (
    <ul className="flex flex-shrink-0 items-center">
      {itens.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-serif text-xl italic sm:px-10 sm:text-2xl">{t}</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-nude/80" />
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className="faixa overflow-hidden bg-terracota py-4 text-cream sm:py-5" aria-label="Momentos do encontro">
      <div className="faixa-trilho flex w-max">
        {linha}
        <div aria-hidden="true" className="flex">
          {linha}
        </div>
      </div>
    </div>
  );
}
