import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { CheckoutContext } from '@/lib/checkoutContext';
import type { FormEvent, ReactNode } from 'react';
import { Loader2, Lock, MessageCircle, X } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CTAArrow } from '@/components/CTAButton';
import { ctaClasses } from '@/lib/cta';
import { guardarInscricao, guardarReferencia, marcarTentativa, MINUTOS_ENTRE_TENTATIVAS, tentativaRecente } from '@/lib/inscricaoLocal';
import {
  CheckoutError,
  cpfValido,
  formatarCpf,
  formatarWhatsapp,
  iniciarCheckout,
  normalizarWhatsapp,
  type ErroCheckout,
} from '@/lib/checkout';

/**
 * Janela de inscrição: pede nome, e-mail e WhatsApp e leva ao pagamento
 * do Mercado Pago. Qualquer botão da página abre esta mesma janela via
 * useCheckout().abrir().
 */

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [aberto, setAberto] = useState(false);

  const abrir = useCallback(() => {
    setAberto(true);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const fechar = useCallback(() => {
    dialogRef.current?.close();
    setAberto(false);
  }, []);

  return (
    <CheckoutContext.Provider value={{ abrir }}>
      {children}
      <dialog
        ref={dialogRef}
        onClose={() => setAberto(false)}
        onClick={(e) => {
          // Clicar fora do cartão (no fundo escurecido) fecha a janela
          if (e.target === e.currentTarget) fechar();
        }}
        aria-labelledby="checkout-titulo"
        className="m-auto w-[calc(100%-1.5rem)] max-w-lg rounded-[1.25rem] bg-cream p-0 text-coffee shadow-dialogo backdrop:bg-coffee/65"
      >
        {aberto && <FormularioInscricao onFechar={fechar} />}
      </dialog>
    </CheckoutContext.Provider>
  );
}

const MENSAGENS: Record<ErroCheckout, string> = {
  esgotado: 'As vagas se esgotaram. Fale com a gente no WhatsApp para entrar na lista de espera.',
  reservas_cheias:
    'As últimas vagas estão reservadas por quem está pagando agora. Se alguma reserva não for concluída, ela é liberada em até 30 minutos. Tente de novo daqui a pouco.',
  dados_invalidos: 'Confira o nome, o e-mail, o WhatsApp e o CPF e tente de novo.',
  indisponivel: 'Não conseguimos abrir o pagamento agora. Tente de novo em instantes ou fale com a gente no WhatsApp.',
};

type Campo = 'nome' | 'email' | 'email2' | 'whatsapp' | 'cpf';
const ORDEM: Campo[] = ['nome', 'email', 'email2', 'whatsapp', 'cpf'];

function FormularioInscricao({ onFechar }: { onFechar: () => void }) {
  const id = useId();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirmacao, setEmailConfirmacao] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [erroServidor, setErroServidor] = useState<ErroCheckout | null>(null);
  const refs = useRef<Partial<Record<Campo, HTMLInputElement | null>>>({});
  // Lido uma vez ao abrir a janela
  const [recente] = useState(tentativaRecente);

  useEffect(() => {
    refs.current.nome?.focus();
  }, []);

  function validar(): Partial<Record<Campo, string>> {
    const nomeLimpo = nome.replace(/\s+/g, ' ').trim();
    const emailLimpo = email.trim().toLowerCase();
    const digitos = whatsapp.replace(/\D/g, '');
    const e: Partial<Record<Campo, string>> = {};
    if (nomeLimpo.length < 3) e.nome = 'Escreva o seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailLimpo)) e.email = 'Confira o e-mail: falta o @ ou o final (ex.: .com).';
    else if (emailLimpo !== emailConfirmacao.trim().toLowerCase())
      e.email2 = 'Os dois e-mails estão diferentes. É nele que chega a confirmação.';
    if (digitos.length < 10) e.whatsapp = 'Coloque o WhatsApp com DDD, por exemplo (81) 99999-9999.';
    if (!cpfValido(cpf)) e.cpf = 'Confira o CPF. Ele precisa ser o da pessoa que vai pagar.';
    return e;
  }

  async function enviar(ev: FormEvent) {
    ev.preventDefault();
    if (enviando) return;
    setErroServidor(null);

    const novos = validar();
    setErros(novos);
    const primeiro = ORDEM.find((c) => novos[c]);
    if (primeiro) {
      refs.current[primeiro]?.focus();
      return;
    }

    setEnviando(true);
    const nomeLimpo = nome.replace(/\s+/g, ' ').trim();
    const emailLimpo = email.trim().toLowerCase();
    try {
      const { url, referencia } = await iniciarCheckout({
        nome: nomeLimpo,
        email: emailLimpo,
        whatsapp: normalizarWhatsapp(whatsapp.replace(/\D/g, '')),
        cpf: cpf.replace(/\D/g, ''),
      });
      // Mesma aba: depois do pagamento o Mercado Pago traz a pessoa de volta para /obrigado
      guardarInscricao({ nome: nomeLimpo, email: emailLimpo });
      if (referencia) guardarReferencia(referencia);
      marcarTentativa();
      window.location.assign(url);
    } catch (erro) {
      setErroServidor(erro instanceof CheckoutError ? erro.codigo : 'indisponivel');
      setEnviando(false);
    }
  }

  /** Limpa o erro de um campo assim que a pessoa volta a digitar nele. */
  function aoMudar(campo: Campo, valor: string, set: (v: string) => void) {
    set(valor);
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  const campoBase =
    'mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-base text-coffee placeholder:text-coffee-soft/85 focus:outline-none focus:ring-2';
  const classeCampo = (c: Campo) =>
    `${campoBase} ${erros[c] ? 'border-terracota ring-1 ring-terracota focus:ring-terracota/40' : 'border-coffee/25 focus:border-terracota focus:ring-terracota/25'}`;
  const rotulo = 'block text-base font-bold text-coffee';
  const ajuda = (c: Campo, extra?: string) =>
    [erros[c] ? `${id}-${c}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined;
  const erro = (c: Campo) =>
    erros[c] ? (
      <p id={`${id}-${c}-erro`} className="mt-1.5 text-sm font-bold leading-snug text-terracota-dark">
        {erros[c]}
      </p>
    ) : null;

  return (
    <form onSubmit={enviar} noValidate className="relative px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
      <button
        type="button"
        onClick={onFechar}
        aria-label="Fechar"
        className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-coffee-soft transition-colors hover:bg-sand hover:text-coffee"
      >
        <X size={22} aria-hidden="true" />
      </button>

      <h2 id="checkout-titulo" className="pr-10 text-2xl leading-tight sm:text-3xl">
        Garanta a sua vaga
      </h2>
      <p className="mt-2 text-base leading-relaxed text-coffee-soft">
        Preencha seus dados. A confirmação, o endereço e o link do grupo chegam no seu e-mail assim que o pagamento
        for aprovado.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor={`${id}-nome`} className={rotulo}>Nome completo</label>
          <input
            ref={(el) => (refs.current.nome = el)}
            id={`${id}-nome`}
            className={classeCampo('nome')}
            value={nome}
            onChange={(e) => aoMudar('nome', e.target.value, setNome)}
            autoComplete="name"
            maxLength={120}
            aria-invalid={!!erros.nome}
            aria-describedby={ajuda('nome')}
            required
          />
          {erro('nome')}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={rotulo}>E-mail</label>
          <input
            ref={(el) => (refs.current.email = el)}
            id={`${id}-email`}
            type="email"
            inputMode="email"
            className={classeCampo('email')}
            value={email}
            onChange={(e) => aoMudar('email', e.target.value, setEmail)}
            autoComplete="email"
            maxLength={200}
            aria-invalid={!!erros.email}
            aria-describedby={ajuda('email')}
            required
          />
          {erro('email')}
        </div>
        <div>
          <label htmlFor={`${id}-email2`} className={rotulo}>Confirme o e-mail</label>
          <input
            ref={(el) => (refs.current.email2 = el)}
            id={`${id}-email2`}
            type="email"
            inputMode="email"
            className={classeCampo('email2')}
            value={emailConfirmacao}
            onChange={(e) => aoMudar('email2', e.target.value, setEmailConfirmacao)}
            autoComplete="email"
            maxLength={200}
            aria-invalid={!!erros.email2}
            aria-describedby={ajuda('email2')}
            required
          />
          {erro('email2')}
        </div>
        <div>
          <label htmlFor={`${id}-whatsapp`} className={rotulo}>WhatsApp com DDD</label>
          <input
            ref={(el) => (refs.current.whatsapp = el)}
            id={`${id}-whatsapp`}
            type="tel"
            inputMode="tel"
            placeholder="(81) 99999-9999"
            className={classeCampo('whatsapp')}
            value={whatsapp}
            onChange={(e) => aoMudar('whatsapp', formatarWhatsapp(e.target.value), setWhatsapp)}
            autoComplete="tel-national"
            aria-invalid={!!erros.whatsapp}
            aria-describedby={ajuda('whatsapp')}
            required
          />
          {erro('whatsapp')}
        </div>
        <div>
          <label htmlFor={`${id}-cpf`} className={rotulo}>CPF de quem vai pagar</label>
          <input
            ref={(el) => (refs.current.cpf = el)}
            id={`${id}-cpf`}
            inputMode="numeric"
            placeholder="000.000.000-00"
            className={classeCampo('cpf')}
            value={cpf}
            onChange={(e) => aoMudar('cpf', formatarCpf(e.target.value), setCpf)}
            autoComplete="off"
            aria-invalid={!!erros.cpf}
            aria-describedby={ajuda('cpf', `${id}-cpf-ajuda`)}
            required
          />
          {erro('cpf')}
          <p id={`${id}-cpf-ajuda`} className="mt-1.5 text-sm leading-relaxed text-coffee-soft">
            Enviado só ao Mercado Pago, para a segurança do pagamento. Ajuda a aprovar o cartão.
          </p>
        </div>
      </div>

      <div aria-live="polite" className="mt-4">
        {erroServidor && (
          <div role="alert" className="rounded-lg bg-nude/60 px-4 py-3 text-base leading-relaxed text-coffee">
            <p>{MENSAGENS[erroServidor]}</p>
            {erroServidor !== 'dados_invalidos' && erroServidor !== 'reservas_cheias' && (
              <a
                href={eventConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-[2.75rem] items-center gap-1.5 font-bold text-terracota underline decoration-terracota/40"
              >
                <MessageCircle size={16} aria-hidden="true" /> Falar no WhatsApp
              </a>
            )}
          </div>
        )}
      </div>

      {recente && (
        <div role="note" className="mt-4 rounded-lg bg-nude/60 px-4 py-3 text-base leading-relaxed text-coffee">
          <p className="font-bold">Acabou de tentar pagar?</p>
          <p className="mt-1">
            Se o cartão foi recusado, prefira pagar com <strong className="font-bold">Pix</strong>, que é aprovado na
            hora. Para usar cartão de novo, espere cerca de {MINUTOS_ENTRE_TENTATIVAS} minutos ou use outro cartão:
            tentativas seguidas com os mesmos dados costumam ser bloqueadas pela segurança do Mercado Pago.
          </p>
        </div>
      )}

      <div className="mt-6 border-y border-linha py-3 text-base leading-relaxed text-coffee">
        No Pix ou no cartão vai aparecer o nome <strong className="font-bold">{eventConfig.recebedor}</strong>. Ele é o
        desenvolvedor deste site e quem cuida dos pagamentos do evento.{' '}
        <a
          href={eventConfig.whatsappMensagem('Olá! Quero confirmar os dados do pagamento do evento antes de pagar.')}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-terracota underline decoration-terracota/40"
        >
          Confirmar no WhatsApp
        </a>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className={ctaClasses('primary', 'mt-5 w-full disabled:cursor-wait disabled:opacity-80')}
      >
        {enviando ? (
          <>
            <Loader2 size={20} className="animate-spin" aria-hidden="true" />
            <span>Abrindo o pagamento...</span>
          </>
        ) : (
          <>
            <span className="whitespace-nowrap">Pagar {eventConfig.price}</span>
            <CTAArrow />
          </>
        )}
      </button>

      <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-coffee-soft">
        <Lock size={15} className="mt-1 flex-shrink-0" aria-hidden="true" />
        <span>
          Pagamento seguro pelo Mercado Pago (Pix ou cartão). {eventConfig.garantia} Seus dados são usados só para a
          sua inscrição, a segurança do pagamento e a comunicação sobre o evento. Ao continuar, você declara estar
          ciente da{' '}
          <a
            href={eventConfig.politicaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-terracota underline decoration-terracota/40"
          >
            Política de compra, cancelamento e reembolso
          </a>
          .
        </span>
      </p>
    </form>
  );
}
