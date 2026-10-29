import { useEffect, useState } from 'react';

/**
 * Pergunta ao servidor (/api/status-inscricao) se o pagamento da inscrição já foi
 * confirmado. Quem confirma é o webhook do Mercado Pago, que confere o pagamento
 * direto na API do Mercado Pago; a página só lê o resultado.
 */
export type StatusServidor = 'pago' | 'aguardando' | 'expirado' | 'desconhecida';

const VALORES: StatusServidor[] = ['pago', 'aguardando', 'expirado', 'desconhecida'];

export async function consultarStatus(referencia: string, sinal?: AbortSignal): Promise<StatusServidor | null> {
  try {
    const resposta = await fetch(`/api/status-inscricao?ref=${encodeURIComponent(referencia)}`, {
      cache: 'no-store',
      signal: sinal,
    });
    if (!resposta.ok) return null;
    const corpo: { situacao?: unknown } = await resposta.json().catch(() => ({}));
    return VALORES.find((v) => v === corpo.situacao) ?? null;
  } catch {
    return null;
  }
}

/** Confere com mais pressa no começo (a pessoa acabou de pagar) e com menos depois. */
function proximaEspera(tentativa: number): number {
  return tentativa < 30 ? 4000 : 15000;
}
const MAX_TENTATIVAS = 90;

/**
 * Consulta o status até o servidor confirmar "pago" (ou até desistir depois de ~20 min).
 * Devolve o último status conhecido e se ainda está conferindo.
 */
export function useStatusInscricao(referencia: string | null) {
  const [status, setStatus] = useState<StatusServidor | null>(null);
  const [conferindo, setConferindo] = useState(Boolean(referencia));

  useEffect(() => {
    if (!referencia) {
      setConferindo(false);
      return;
    }
    const controle = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let tentativa = 0;
    setConferindo(true);

    const rodar = async () => {
      const resultado = await consultarStatus(referencia, controle.signal);
      if (controle.signal.aborted) return;
      if (resultado) setStatus(resultado);
      tentativa += 1;
      if (resultado === 'pago' || tentativa >= MAX_TENTATIVAS) {
        setConferindo(false);
        return;
      }
      timer = setTimeout(rodar, proximaEspera(tentativa));
    };
    rodar();

    return () => {
      controle.abort();
      clearTimeout(timer);
    };
  }, [referencia]);

  return { status, conferindo };
}
