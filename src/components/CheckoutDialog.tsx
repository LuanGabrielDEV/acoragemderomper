import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { CheckoutContext } from '@/lib/checkoutContext';
import type { FormEvent, ReactNode } from 'react';
import { Loader2, Lock, MessageCircle, X } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CTAArrow } from '@/components/CTAButton';
import { ctaClasses } from '@/lib/cta';
import { guardarInscricao, marcarTentativa, MINUTOS_ENTRE_TENTATIVAS, tentativaRecente } from '@/lib/inscricaoLocal';
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
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl bg-cream p-0 text-coffee shadow-soft-lg backdrop:bg-coffee/60 backdrop:backdrop-blur-sm"
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

function FormularioInscricao({ onFechar }: { onFechar: () => void }) {
  const id = useId();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirmacao, setEmailConfirmacao] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroCampo, setErroCampo] = useState('');
  const [erroServidor, setErroServidor] = useState<ErroCheckout | null>(null);
  const primeiroCampo = useRef<HTMLInputElement>(null);
  // Lido uma vez ao abrir a janela
  const [recente] = useState(tentativaRecente);

  useEffect(() => {
    primeiroCampo.current?.focus();
  }, []);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setErroServidor(null);

    const nomeLimpo = nome.replace(/\s+/g, ' ').trim();
    const emailLimpo = email.trim().toLowerCase();
    const digitos = whatsapp.replace(/\D/g, '');

    if (nomeLimpo.length < 3) return setErroCampo('Informe o seu nome completo.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailLimpo)) return setErroCampo('Informe um e-mail válido.');
    if (emailLimpo !== emailConfirmacao.trim().toLowerCase()) {
      return setErroCampo('Os dois e-mails estão diferentes. É nele que você recebe a confirmação.');
    }
    if (digitos.length < 10) return setErroCampo('Informe o WhatsApp com DDD.');
    if (!cpfValido(cpf)) return setErroCampo('Confira o CPF. Ele precisa ser o da pessoa que vai pagar.');
    setErroCampo('');

    setEnviando(true);
    try {
      const url = await iniciarCheckout({
        nome: nomeLimpo,
        email: emailLimpo,
        whatsapp: normalizarWhatsapp(digitos),
        cpf: cpf.replace(/\D/g, ''),
      });
      // Mesma aba: depois do pagamento o Mercado Pago traz a pessoa de volta para /obrigado
      guardarInscricao({ nome: nomeLimpo, email: emailLimpo });
      marcarTentativa();
      window.location.assign(url);
    } catch (erro) {
      setErroServidor(erro instanceof CheckoutError ? erro.codigo : 'indisponivel');
      setEnviando(false);
    }
  }

  const campo =
    'mt-1.5 w-full rounded-xl border border-coffee/15 bg-white px-4 py-3 text-base text-coffee placeholder:text-coffee-soft/50 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/25';
  const rotulo = 'block text-sm font-semibold text-coffee';

  return (
    <form onSubmit={enviar} noValidate className="relative px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9">
      <button
        type="button"
        onClick={onFechar}
        aria-label="Fechar"
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-coffee-soft transition-colors hover:bg-sand hover:text-coffee"
      >
        <X size={22} />
      </button>

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracota">Inscrição</p>
      <h2 id="checkout-titulo" className="mt-2 pr-10 font-serif text-2xl leading-tight sm:text-3xl">
        Garanta a sua vaga
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-coffee-soft sm:text-base">
        Preencha seus dados. A confirmação, o endereço e o link do grupo chegam no seu e-mail assim que o
        pagamento for aprovado.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor={`${id}-nome`} className={rotulo}>Nome completo</label>
          <input
            ref={primeiroCampo}
            id={`${id}-nome`}
            className={campo}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            maxLength={120}
            required
          />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={rotulo}>E-mail</label>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            className={campo}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={200}
            required
          />
        </div>
        <div>
          <label htmlFor={`${id}-email2`} className={rotulo}>Confirme o e-mail</label>
          <input
            id={`${id}-email2`}
            type="email"
            inputMode="email"
            className={campo}
            value={emailConfirmacao}
            onChange={(e) => setEmailConfirmacao(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            autoComplete="off"
            maxLength={200}
            required
          />
        </div>
        <div>
          <label htmlFor={`${id}-whats`} className={rotulo}>WhatsApp com DDD</label>
          <input
            id={`${id}-whats`}
            type="tel"
            inputMode="tel"
            placeholder="(81) 99999-9999"
            className={campo}
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatarWhatsapp(e.target.value))}
            autoComplete="tel-national"
            required
          />
        </div>
        <div>
          <label htmlFor={`${id}-cpf`} className={rotulo}>CPF de quem vai pagar</label>
          <input
            id={`${id}-cpf`}
            inputMode="numeric"
            placeholder="000.000.000-00"
            className={campo}
            value={cpf}
            onChange={(e) => setCpf(formatarCpf(e.target.value))}
            autoComplete="off"
            aria-describedby={`${id}-cpf-ajuda`}
            required
          />
          <p id={`${id}-cpf-ajuda`} className="mt-1.5 text-xs leading-relaxed text-coffee-soft">
            Enviado só ao Mercado Pago para a segurança do pagamento. Ajuda a aprovar o cartão.
          </p>
        </div>
      </div>

      <div aria-live="polite" className="mt-4 space-y-3">
        {erroCampo && <p className="rounded-xl bg-nude/50 px-4 py-3 text-sm text-coffee">{erroCampo}</p>}
        {erroServidor && (
          <div role="alert" className="rounded-xl bg-nude/50 px-4 py-3 text-sm leading-relaxed text-coffee">
            <p>{MENSAGENS[erroServidor]}</p>
            {erroServidor !== 'dados_invalidos' && erroServidor !== 'reservas_cheias' && (
              <a
                href={eventConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 font-semibold text-terracota underline-offset-2 hover:underline"
              >
                <MessageCircle size={16} /> Falar no WhatsApp
              </a>
            )}
          </div>
        )}
      </div>

      {recente && (
        <div role="note" className="mt-6 rounded-xl bg-nude/60 px-4 py-3 text-sm leading-relaxed text-coffee">
          <p className="font-semibold">Acabou de tentar pagar?</p>
          <p className="mt-1">
            Se o cartão foi recusado, prefira pagar com <strong className="font-semibold">Pix</strong>, que é aprovado
            na hora. Para usar cartão de novo, espere cerca de {MINUTOS_ENTRE_TENTATIVAS} minutos ou use outro cartão:
            tentativas seguidas com os mesmos dados costumam ser bloqueadas pela segurança do Mercado Pago.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-terracota/30 bg-sand px-4 py-3 text-sm leading-relaxed text-coffee">
        Na confirmação do pagamento, aparecerá o nome cadastrado{' '}
        <strong className="font-semibold">Luan Gabriel Dantas de Lima Cavalcanti</strong>, responsável pelo
        recebimento dos pagamentos.
      </div>

      <button
        type="submit"
        disabled={enviando}
        className={ctaClasses('primary', 'mt-4 w-full disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100')}
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

      <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-coffee-soft">
        <Lock size={14} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
        <span>
          Pagamento seguro pelo Mercado Pago (Pix ou cartão). Seus dados são usados só para a sua inscrição, a segurança do pagamento e a
          comunicação sobre o evento. Ao continuar, você declara estar ciente da{' '}
          <a
            href={eventConfig.politicaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-terracota underline underline-offset-2"
          >
            Política de compra, cancelamento e reembolso
          </a>
          .
        </span>
      </p>
    </form>
  );
}
