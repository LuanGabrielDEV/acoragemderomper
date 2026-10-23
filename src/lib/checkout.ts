/**
 * Fala com a função /api/criar-checkout (que roda na Vercel).
 * O navegador envia nome, e-mail, WhatsApp e CPF. O preço é definido no servidor.
 * O CPF vai só para o Mercado Pago (análise do pagamento); não fica na planilha.
 */

export type DadosInscricao = {
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
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

/** Máscara de CPF: 000.000.000-00 */
export function formatarCpf(valor: string) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Confere os dígitos verificadores do CPF (só números). */
export function cpfValido(valor: string) {
  const d = valor.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (ate: number) => {
    let soma = 0;
    for (let i = 0; i < ate; i++) soma += Number(d[i]) * (ate + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

/** Devolve o WhatsApp com DDI 55, só dígitos (ex.: 5581999999999). O campo aceita só DDD + número. */
export function normalizarWhatsapp(valor: string) {
  return `55${valor.replace(/\D/g, '').slice(0, 11)}`;
}
