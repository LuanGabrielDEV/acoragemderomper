import { eventConfig } from '@/data/eventConfig';
import { doisDigitos, useContagem } from '@/lib/contagem';

/** Faixa fina no topo: quanto falta para o encontro, ao vivo (os segundos só aparecem em telas largas). */
export function FaixaContagem() {
  const c = useContagem(eventConfig.inicio);
  if (c.terminou) return null;

  return (
    <div className="bg-terracota text-cream">
      <p className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-2 px-5 py-2 text-center text-sm sm:px-8">
        <span className="hidden sm:inline">O encontro começa em</span>
        <span className="sm:hidden">Começa em</span>
        <span className="font-bold tabular-nums">
          {c.dias} {c.dias === 1 ? 'dia' : 'dias'} · {doisDigitos(c.horas)}h {doisDigitos(c.minutos)}min
          <span className="hidden sm:inline">
            {' '}
            <span className="inline-block w-[2.4ch] text-left">{doisDigitos(c.segundos)}s</span>
          </span>
        </span>
        <span aria-hidden="true" className="text-cream/60">·</span>
        <span>30 vagas</span>
      </p>
    </div>
  );
}
