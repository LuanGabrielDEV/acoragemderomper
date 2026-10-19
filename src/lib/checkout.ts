/**
 * Fala com a função /api/criar-checkout (que roda na Vercel).
 * O navegador envia só nome, e-mail e WhatsApp. O preço é definido no servidor.
 */

export type DadosInscricao = {
  nome: string;
  email: string;
  whatsapp: string;
};

export type ErroCheckout = 'esgotado' | 'reservas_cheias' | 'dados_invalidos' | 'indisponivel';

export class CheckoutError extends Error {
  codigo: ErroCheckout;
  constructor(codigo: ErroCheckout) {
    super(codigo);
    this.codigo = codigo;
  }
}

const ERROS_CONHECIDOS: ErroCheckout[] = ['esgotado', 'reservas_cheias', 'dados_invalidos', 'indisponivel'];

export async function iniciarCheckout(dados: DadosInscricao): Promise<string> {
  let resposta: Response;
  try {
    resposta = await fetch('/api/criar-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
  } catch {
    throw new CheckoutError('indisponivel');
  }

  const corpo: { url?: unknown; erro?: unknown } = await resposta.json().catch(() => ({}));

  if (resposta.ok && typeof corpo.url === 'string' && corpo.url.startsWith('https://')) {
    return corpo.url;
  }

  const codigo = ERROS_CONHECIDOS.find((e) => e === corpo.erro) ?? 'indisponivel';
  throw new CheckoutError(codigo);
}

/** Máscara simples para WhatsApp: (81) 99999-9999 */
export function formatarWhatsapp(valor: string) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Devolve o WhatsApp com DDI 55, só dígitos (ex.: 5581999999999). O campo aceita só DDD + número. */
export function normalizarWhatsapp(valor: string) {
  return `55${valor.replace(/\D/g, '').slice(0, 11)}`;
}
