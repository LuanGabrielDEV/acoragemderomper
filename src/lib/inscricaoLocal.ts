/**
 * Guarda nome e e-mail da inscrição NESTA aba do navegador (sessionStorage),
 * para a página /obrigado montar a mensagem do WhatsApp com o nome da pessoa
 * quando ela volta do Mercado Pago. Nada vai para servidor; some ao fechar a aba.
 */

const CHAVE = 'romper:inscricao';

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
