import { useEffect, useState } from 'react';
import { lerReferencia } from '@/lib/inscricaoLocal';
import { consultarStatus, type StatusServidor } from '@/lib/statusInscricao';

/**
 * Faixa no topo da página inicial para quem pagou (ou está pagando) e voltou ao site
 * sem passar pelo redirecionamento do Mercado Pago, por exemplo ao pagar o Pix no
 * app do banco. Só aparece se este navegador abriu um pagamento nas últimas horas.
 */
export function AvisoPagamento() {
  const [status, setStatus] = useState<StatusServidor | null>(null);

  useEffect(() => {
    const referencia = lerReferencia();
    if (!referencia) return;
    const controle = new AbortController();
    consultarStatus(referencia, controle.signal).then((resultado) => {
      if (!controle.signal.aborted) setStatus(resultado);
    });
    return () => controle.abort();
  }, []);

  if (status !== 'pago' && status !== 'aguardando') return null;

  const texto =
    status === 'pago'
      ? 'Seu pagamento foi confirmado. Sua vaga está garantida.'
      : 'Você tem um pagamento em andamento.';

  return (
    <div role="status" className="bg-terracota px-5 py-2.5 text-center text-sm text-cream">
      {texto}{' '}
      <a href="/obrigado" className="font-semibold underline underline-offset-2 hover:text-nude">
        Ver status da inscrição
      </a>
    </div>
  );
}
