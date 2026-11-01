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
