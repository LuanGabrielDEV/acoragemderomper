/**
 * POST /api/webhook-mercadopago
 * -----------------------------
 * O Mercado Pago chama este endereço sozinho sempre que um pagamento muda.
 *
 * Regra de ouro: NÃO confiamos no conteúdo do aviso. Usamos só o número do
 * pagamento e perguntamos ao Mercado Pago (com o Access Token) qual é a
 * situação real. Um aviso falso, portanto, não consegue confirmar inscrição.
 *
 * Se o pagamento estiver aprovado, a planilha (Apps Script) marca a inscrição
 * como paga e envia os e-mails. Se algo falhar, respondemos 500 e o Mercado
 * Pago tenta de novo mais tarde; a planilha evita e-mails repetidos.
 *
 * Variáveis de ambiente: MP_ACCESS_TOKEN, PLANILHA_URL, PLANILHA_SEGREDO
 */

export default async function handler(req, res) {
  // Abrir no navegador (GET) só confirma que a função está no ar
  if (req.method === 'GET') return res.status(200).json({ ok: true });
  if (req.method !== 'POST') return res.status(405).end();

  const mpToken = process.env.MP_ACCESS_TOKEN;
  const planilhaUrl = process.env.PLANILHA_URL;
  const planilhaSegredo = process.env.PLANILHA_SEGREDO;
  if (!mpToken || !planilhaUrl || !planilhaSegredo) {
    console.error('webhook: variáveis de ambiente incompletas');
    return res.status(500).json({ ok: false });
  }

  const { tipo, id } = lerAviso(req);
  // Avisos que não são de pagamento (ex.: merchant_order) são ignorados com 200
  if (tipo !== 'payment' || !/^\d{1,20}$/.test(id)) {
    return res.status(200).json({ ok: true, ignorado: true });
  }

  try {
    // 1. Pergunta ao Mercado Pago a situação real do pagamento
    const resposta = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${mpToken}` },
      signal: AbortSignal.timeout(10000),
    });
    if (resposta.status === 404) return res.status(200).json({ ok: true, ignorado: true });
    if (!resposta.ok) throw new Error(`Mercado Pago HTTP ${resposta.status}`);
    const pagamento = await resposta.json();

    const referencia = String(pagamento.external_reference || '');
    if (pagamento.status !== 'approved' || !referencia.startsWith('romper-')) {
      // Registra o motivo de recusas e pendências (ex.: cc_rejected_high_risk) para diagnóstico
      if (referencia.startsWith('romper-') && pagamento.status !== 'approved') {
        console.log('webhook: pagamento', id, pagamento.status, pagamento.status_detail || '', pagamento.payment_type_id || '');
      }
      return res.status(200).json({ ok: true, status: pagamento.status });
    }

    // 2. Planilha: marca como pago e envia os e-mails (sem duplicar)
    const pagador = pagamento.payer || {};
    const resultado = await chamarPlanilha(planilhaUrl, {
      acao: 'confirmar',
      segredo: planilhaSegredo,
      referencia,
      paymentId: String(pagamento.id),
      valor: pagamento.transaction_amount,
      forma: pagamento.payment_type_id,
      emailPagador: pagador.email || '',
      nomePagador: [pagador.first_name, pagador.last_name].filter(Boolean).join(' '),
    });

    if (!resultado.ok) {
      throw new Error(`planilha respondeu ${resultado.erro}${resultado.detalhe ? ` (${resultado.detalhe})` : ''}`);
    }
    return res.status(200).json({ ok: true });
  } catch (erro) {
    console.error('webhook: falha ao processar pagamento', id, '-', erro.message);
    return res.status(500).json({ ok: false });
  }
}

/** O Mercado Pago manda o tipo e o id no corpo (Webhooks) ou na URL (formato antigo). */
function lerAviso(req) {
  const corpo = req.body && typeof req.body === 'object' ? req.body : {};
  const url = new URL(req.url || '/', 'https://local');
  const q = url.searchParams;
  const tipo = String(corpo.type || corpo.topic || q.get('type') || q.get('topic') || '');
  const id = String((corpo.data && corpo.data.id) || q.get('data.id') || q.get('id') || '');
  return { tipo, id };
}

async function chamarPlanilha(url, dados) {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(dados),
    redirect: 'follow',
    signal: AbortSignal.timeout(18000),
  });
  const texto = await resposta.text();
  try {
    return JSON.parse(texto);
  } catch {
    throw new Error(`resposta inesperada da planilha (HTTP ${resposta.status})`);
  }
}
