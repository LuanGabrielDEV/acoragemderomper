/**
 * Guarda nome e e-mail da inscrição NESTA aba do navegador (sessionStorage),
 * para a página /obrigado montar a mensagem do WhatsApp com o nome da pessoa
 * quando ela volta do Mercado Pago. Nada vai para servidor; some ao fechar a aba.
 */

const CHAVE = 'romper:inscricao';
const CHAVE_TENTATIVA = 'romper:ultimaTentativa';

const CHAVE_REFERENCIA = 'romper:referencia';
/** Por quanto tempo a referência da inscrição fica guardada no navegador. */
const HORAS_REFERENCIA = 3;

/** Mesmo formato que o servidor aceita em /api/status-inscricao. */
export const REFERENCIA_VALIDA = /^romper-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Tempo sugerido de espera entre duas tentativas com cartão. */
export const MINUTOS_ENTRE_TENTATIVAS = 10;

export type InscricaoLocal = { nome: string; email: string };

export function guardarInscricao(dados: InscricaoLocal) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // navegador bloqueou o armazenamento: a página /obrigado usa a mensagem padrão
  }
}

export function lerInscricao(): InscricaoLocal | null {
  try {
    const valor = sessionStorage.getItem(CHAVE);
    if (!valor) return null;
    const dados = JSON.parse(valor);
    if (typeof dados?.nome === 'string' && typeof dados?.email === 'string' && dados.nome.trim()) {
      return { nome: dados.nome.trim().slice(0, 120), email: dados.email.trim().slice(0, 200) };
    }
  } catch {
    // ignora dados inválidos
  }
  return null;
}

/**
 * Marca no navegador (localStorage, vale entre abas) que um pagamento acabou
 * de ser aberto ou recusado. Serve só para avisar a pessoa antes de uma nova
 * tentativa imediata, que o antifraude do Mercado Pago costuma bloquear.
 */
export function marcarTentativa() {
  try {
    localStorage.setItem(CHAVE_TENTATIVA, String(Date.now()));
  } catch {
    // sem armazenamento: apenas não mostra o aviso
  }
}

/** true se houve uma tentativa nos últimos MINUTOS_ENTRE_TENTATIVAS minutos. */
export function tentativaRecente(): boolean {
  try {
    const valor = Number(localStorage.getItem(CHAVE_TENTATIVA));
    return Number.isFinite(valor) && valor > 0 && Date.now() - valor < MINUTOS_ENTRE_TENTATIVAS * 60000;
  } catch {
    return false;
  }
}

/**
 * Guarda a referência da inscrição (código aleatório) neste navegador. É com ela que
 * a página /obrigado pergunta ao servidor se o pagamento já foi confirmado, mesmo
 * quando o Mercado Pago não devolve a pessoa ao site (ex.: Pix pago no app do banco).
 */
export function guardarReferencia(referencia: string) {
  if (!REFERENCIA_VALIDA.test(referencia)) return;
  try {
    localStorage.setItem(CHAVE_REFERENCIA, JSON.stringify({ referencia, em: Date.now() }));
  } catch {
    // sem armazenamento: a página usa só o que vier na URL
  }
}

/** Referência guardada nas últimas HORAS_REFERENCIA horas, ou null. */
export function lerReferencia(): string | null {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_REFERENCIA) || 'null');
    if (
      typeof dados?.referencia === 'string' &&
      REFERENCIA_VALIDA.test(dados.referencia) &&
      Number.isFinite(dados.em) &&
      Date.now() - dados.em < HORAS_REFERENCIA * 3600000
    ) {
      return dados.referencia;
    }
  } catch {
    // ignora dados inválidos
  }
  return null;
}
