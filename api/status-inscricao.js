/**
 * GET /api/status-inscricao?ref=romper-...
 * ----------------------------------------
 * Roda na Vercel (servidor). A página /obrigado chama esta função para saber se
 * o pagamento da inscrição já foi CONFIRMADO pelo servidor (o webhook do Mercado
 * Pago confere na API do Mercado Pago e grava "pago" na planilha).
 *
 * Responde só { situacao: "pago" | "aguardando" | "expirado" | "desconhecida" }.
 * Nenhum dado pessoal sai daqui. A referência é um código aleatório (UUID) que só
 * quem fez a inscrição recebe.
 *
 * Usa as mesmas variáveis de ambiente de /api/criar-checkout (PLANILHA_URL e PLANILHA_SEGREDO).
 */

const REFERENCIA_VALIDA = /^romper-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SITUACOES = ['pago', 'aguardando', 'expirado', 'desconhecida'];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ erro: 'metodo_nao_permitido' });
  }

  const planilhaUrl = process.env.PLANILHA_URL;
  const segredo = process.env.PLANILHA_SEGREDO;
  if (!planilhaUrl || !segredo) {
    console.error('status-inscricao: variáveis de ambiente incompletas');
    return res.status(500).json({ erro: 'indisponivel' });
  }

  const ref = lerReferencia(req);
  if (!REFERENCIA_VALIDA.test(ref)) return res.status(400).json({ erro: 'referencia_invalida' });

  try {
    const resposta = await fetch(planilhaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ acao: 'status', referencia: ref, segredo }),
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    const corpo = JSON.parse(await resposta.text());
    if (!corpo.ok || !SITUACOES.includes(corpo.situacao)) {
      console.error('status-inscricao: planilha respondeu', corpo && corpo.erro);
      return res.status(502).json({ erro: 'indisponivel' });
    }
    return res.status(200).json({ situacao: corpo.situacao });
  } catch (erro) {
    console.error('status-inscricao: falha ao falar com a planilha -', erro.message);
    return res.status(502).json({ erro: 'indisponivel' });
  }
}

function lerReferencia(req) {
  if (req.query && typeof req.query.ref === 'string') return req.query.ref.trim();
  try {
    return (new URL(req.url || '', 'https://x.invalid').searchParams.get('ref') || '').trim();
  } catch {
    return '';
  }
}
