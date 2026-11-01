import { useEffect, useState } from 'react';

export type Contagem = { dias: number; horas: number; minutos: number; segundos: number; terminou: boolean };

function calcular(alvo: number): Contagem {
  const resto = Math.max(0, alvo - Date.now());
  const s = Math.floor(resto / 1000);
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
    terminou: resto === 0,
  };
}

/** Contagem regressiva até uma data (ISO). Atualiza a cada segundo e para quando a aba fica oculta. */
export function useContagem(iso: string): Contagem {
  const alvo = new Date(iso).getTime();
  const [c, setC] = useState(() => calcular(alvo));

  useEffect(() => {
    let id = 0;
    const iniciar = () => {
      setC(calcular(alvo));
      id = window.setInterval(() => setC(calcular(alvo)), 1000);
    };
    const aoMudarVisibilidade = () => {
      window.clearInterval(id);
      if (!document.hidden) iniciar();
    };
    iniciar();
    document.addEventListener('visibilitychange', aoMudarVisibilidade);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', aoMudarVisibilidade);
    };
  }, [alvo]);

  return c;
}

export const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** Data (ano, mês, dia) no horário de Brasília (UTC−3, sem horário de verão). */
function diaBrasilia(ms: number) {
  const d = new Date(ms - 3 * 3600 * 1000);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Dias até o encontro. `calendario`: 0 = hoje e 1 = amanhã no calendário de Brasília.
 * `inteiros`: blocos de 24h, a mesma conta da faixa de contagem. Atualiza a cada minuto.
 * null depois do início.
 */
export type DiasAteEvento = { calendario: number; inteiros: number } | null;

export function useDiasAteEvento(iso: string): DiasAteEvento {
  const alvo = new Date(iso).getTime();
  const calcular = (): DiasAteEvento => {
    const agora = Date.now();
    if (agora >= alvo) return null;
    return {
      calendario: Math.round((diaBrasilia(alvo) - diaBrasilia(agora)) / 86400000),
      inteiros: Math.floor((alvo - agora) / 86400000),
    };
  };
  const [dias, setDias] = useState(calcular);

  useEffect(() => {
    const id = window.setInterval(() => setDias(calcular()), 60000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alvo]);

  return dias;
}

/** "É hoje" / "É amanhã" pelo calendário; senão "Faltam N dias" na mesma conta da faixa. */
export function textoDias(dias: DiasAteEvento): string {
  if (!dias) return '';
  if (dias.calendario === 0) return 'É hoje';
  if (dias.calendario === 1) return 'É amanhã';
  return `Faltam ${dias.inteiros} ${dias.inteiros === 1 ? 'dia' : 'dias'}`;
}
