/**
 * POST /api/criar-checkout
 * ------------------------
 * Roda na Vercel (servidor), nunca no navegador.
 *
 * 1. Valida nome, e-mail e WhatsApp enviados pela janela de inscrição.
 * 2. Pede à planilha (Apps Script) uma reserva de vaga de 30 minutos.
 *    Se não houver vaga, responde "esgotado" ou "reservas_cheias".
 * 3. Cria o checkout no Mercado Pago com o PREÇO DEFINIDO AQUI (o navegador
 *    não manda preço) e devolve o link de pagamento.
 *
 * Variáveis de ambiente (cadastradas na Vercel, nunca no código):
 *   MP_ACCESS_TOKEN   Access Token do Mercado Pago (secreto)
 *   SITE_URL          https://seu-site.vercel.app (sem barra no final)
 *   PLANILHA_URL      URL do Apps Script publicado (termina em /exec)
 *   PLANILHA_SEGREDO  o mesmo SEGREDO das Propriedades do script
 *   PRECO_REAIS       ex.: 59.00
 *   VENDAS_ABERTAS    "true" ou "false"
 */

const TITULO = 'Coragem para Romper e Recomeçar';
const MINUTOS_PARA_PAGAR = 30;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'metodo_nao_permitido' });
  }

  const config = lerConfig();
  if (!config) {
    console.error('criar-checkout: variáveis de ambiente incompletas');
    return res.status(500).json({ erro: 'indisponivel' });
  }
  if (config.vendasAbertas === false) {
    return res.status(409).json({ erro: 'esgotado' });
  }

  const dados = validar(req.body);
  if (!dados) return res.status(400).json({ erro: 'dados_invalidos' });

  // 1. Reserva na planilha
  let reserva;
  try {
    reserva = await chamarPlanilha(config, { acao: 'reservar', ...dados });
  } catch (erro) {
    console.error('criar-checkout: planilha indisponível -', erro.message);
    return res.status(502).json({ erro: 'indisponivel' });
  }
  if (!reserva.ok) {
    if (reserva.erro === 'esgotado' || reserva.erro === 'reservas_cheias') {
      return res.status(409).json({ erro: reserva.erro });
    }
    if (reserva.erro === 'dados_invalidos') return res.status(400).json({ erro: 'dados_invalidos' });
    console.error('criar-checkout: planilha recusou -', reserva.erro, reserva.detalhe || '');
    return res.status(502).json({ erro: 'indisponivel' });
  }

  // 2. Checkout no Mercado Pago
  const agora = new Date();
  const expira = new Date(agora.getTime() + MINUTOS_PARA_PAGAR * 60000);
  // Cada tentativa ganha um código próprio. Quando a mesma pessoa tenta de novo
  // (mesma reserva), o antifraude do Mercado Pago não recebe dois pedidos
  // idênticos seguidos, que ele costuma recusar como high_risk.
  const tentativa = agora.getTime().toString(36);
  const preferencia = {
    items: [
      {
        id: `romper-2026-${tentativa}`,
        title: TITULO,
        description: 'Inscrição individual · Encontro presencial em 22/11/2026, início às 14h',
        // Arte do evento no resumo da página de pagamento
        picture_url: `${config.siteUrl}/images/01.jpeg`,
        category_id: 'tickets',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: config.preco,
      },
    ],
    // Quanto mais dados da compradora, menor a chance de o antifraude do
    // Mercado Pago recusar o cartão (cc_rejected_high_risk).
    payer: montarPagador(dados),
    external_reference: reserva.referencia,
    notification_url: `${config.siteUrl}/api/webhook-mercadopago`,
    back_urls: {
      success: `${config.siteUrl}/obrigado`,
      pending: `${config.siteUrl}/obrigado?situacao=pendente`,
      failure: `${config.siteUrl}/obrigado?situacao=falhou`,
    },
    auto_return: 'approved',
    statement_descriptor: 'ROMPER',
    // O link de pagamento vale só enquanto a vaga está reservada
    expires: true,
    expiration_date_from: formatarDataMP(agora),
    expiration_date_to: formatarDataMP(expira),
    date_of_expiration: formatarDataMP(expira),
    // Sem boleto: ele demora dias para compensar e a reserva dura 30 minutos
    payment_methods: {
      excluded_payment_types: [{ id: 'ticket' }],
      // Cartão em no máximo 5 parcelas (à vista continua sem juros)
      installments: 5,
    },
    metadata: { evento: 'romper-2026', tentativa },
  };

  try {
    const resposta = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.mpToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${reserva.referencia}-${agora.getTime()}`,
      },
      body: JSON.stringify(preferencia),
      signal: AbortSignal.timeout(15000),
    });
    const corpo = await resposta.json().catch(() => ({}));
    if (!resposta.ok || typeof corpo.init_point !== 'string') {
      console.error('criar-checkout: Mercado Pago respondeu', resposta.status, corpo && corpo.message);
      return res.status(502).json({ erro: 'indisponivel' });
    }
    // Credenciais antigas de teste (começam com TEST-) usam o link de sandbox
    const url = config.mpToken.startsWith('TEST-') && corpo.sandbox_init_point ? corpo.sandbox_init_point : corpo.init_point;
    return res.status(200).json({ url });
  } catch (erro) {
    console.error('criar-checkout: falha ao falar com o Mercado Pago -', erro.message);
    return res.status(502).json({ erro: 'indisponivel' });
  }
}

// ---------- auxiliares ----------

function lerConfig() {
  const mpToken = process.env.MP_ACCESS_TOKEN;
  const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '');
  const planilhaUrl = process.env.PLANILHA_URL;
  const planilhaSegredo = process.env.PLANILHA_SEGREDO;
  const preco = Number(process.env.PRECO_REAIS || '59');
  if (!mpToken || !siteUrl.startsWith('https://') || !planilhaUrl || !planilhaSegredo) return null;
  if (!Number.isFinite(preco) || preco <= 0) return null;
  return {
    mpToken,
    siteUrl,
    planilhaUrl,
    planilhaSegredo,
    preco: Math.round(preco * 100) / 100,
    vendasAbertas: process.env.VENDAS_ABERTAS !== 'false',
  };
}

function validar(corpo) {
  if (!corpo || typeof corpo !== 'object') return null;
  const nome = String(corpo.nome || '').replace(/\s+/g, ' ').trim();
  const email = String(corpo.email || '').trim().toLowerCase();
  const whatsapp = String(corpo.whatsapp || '').replace(/\D/g, '');
  if (nome.length < 3 || nome.length > 120) return null;
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  if (whatsapp.length < 10 || whatsapp.length > 13) return null;
  return { nome, email, whatsapp };
}

/** Nome, sobrenome, e-mail e telefone no formato que o Mercado Pago espera. */
function montarPagador({ nome, email, whatsapp }) {
  const partes = nome.split(' ');
  const primeiro = partes.shift() || nome;
  const sobrenome = partes.join(' ');
  // whatsapp chega só com dígitos, com ou sem o 55 do Brasil
  const local = whatsapp.length > 11 && whatsapp.startsWith('55') ? whatsapp.slice(2) : whatsapp;
  const pagador = {
    name: primeiro,
    email,
    phone: { area_code: local.slice(0, 2), number: local.slice(2) },
  };
  if (sobrenome) pagador.surname = sobrenome;
  return pagador;
}

/** Chama o Apps Script. Ele responde com um redirecionamento, que o fetch segue sozinho. */
async function chamarPlanilha(config, dados) {
  const resposta = await fetch(config.planilhaUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...dados, segredo: config.planilhaSegredo }),
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  });
  const texto = await resposta.text();
  try {
    return JSON.parse(texto);
  } catch {
    throw new Error(`resposta inesperada da planilha (HTTP ${resposta.status})`);
  }
}

/** Formato aceito pelo Mercado Pago, no horário de Brasília: 2026-10-25T14:00:00.000-03:00 */
function formatarDataMP(data) {
  const brasilia = new Date(data.getTime() - 3 * 60 * 60000);
  return brasilia.toISOString().replace('Z', '-03:00');
}
