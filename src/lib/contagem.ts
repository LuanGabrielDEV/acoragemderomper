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
 * Dias de calendário até o encontro, contados no horário de Brasília
 * (1 = amanhã, 0 = hoje). Atualiza a cada minuto. null depois do início.
 */
export function useDiasAteEvento(iso: string): number | null {
  const alvo = new Date(iso).getTime();
  const calcularDias = () => (Date.now() >= alvo ? null : Math.round((diaBrasilia(alvo) - diaBrasilia(Date.now())) / 86400000));
  const [dias, setDias] = useState(calcularDias);

  useEffect(() => {
    const id = window.setInterval(() => setDias(calcularDias()), 60000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alvo]);

  return dias;
}

export function textoDias(dias: number | null): string {
  if (dias === null) return '';
  if (dias === 0) return 'É hoje';
  if (dias === 1) return 'É amanhã';
  return `Faltam ${dias} dias`;
}
