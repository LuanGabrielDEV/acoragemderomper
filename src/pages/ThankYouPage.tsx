import { useEffect, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Loader2, Mail, MessageCircle, RotateCcw } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CTAButton } from '@/components/CTAButton';
import { lerInscricao, lerReferencia, marcarTentativa, REFERENCIA_VALIDA } from '@/lib/inscricaoLocal';
import { useStatusInscricao } from '@/lib/statusInscricao';

/**
 * Página para onde o Mercado Pago devolve a pessoa depois do checkout.
 *
 * Importante: qualquer pessoa pode abrir /obrigado, então esta página NUNCA
 * afirma que o pagamento foi aprovado só pelo que vem na URL, e nunca mostra o
 * endereço. Ela pergunta ao servidor (/api/status-inscricao), que só diz "pago"
 * depois que o webhook conferiu o pagamento na API do Mercado Pago. Isso vale
 * para qualquer forma de pagamento: se o Pix cair depois, a página atualiza sozinha.
 * A confirmação completa (endereço, código) continua sendo o e-mail.
 */

type Situacao = 'confirmado' | 'verificando' | 'concluido' | 'pendente' | 'falhou';

const PARAMETROS_DO_MP = ['status', 'collection_status', 'payment_id', 'collection_id', 'situacao', 'external_reference'];

/** O Mercado Pago devolve a referência da inscrição na URL (external_reference). */
function lerReferenciaDaUrl(): string | null {
  const ref = new URLSearchParams(window.location.search).get('external_reference');
  return ref && REFERENCIA_VALIDA.test(ref) ? ref : null;
}

/** true se a pessoa chegou aqui pelo retorno do Mercado Pago (e não abrindo /obrigado direto). */
function veioDoMercadoPago(): boolean {
  const params = new URLSearchParams(window.location.search);
  return PARAMETROS_DO_MP.some((nome) => params.has(nome));
}

function lerSituacao(): Situacao {
  const params = new URLSearchParams(window.location.search);
  const situacao = params.get('situacao');
  if (situacao === 'falhou') return 'falhou';
  if (situacao === 'pendente' || params.get('status') === 'pending' || params.get('status') === 'in_process') {
    return 'pendente';
  }
  return 'concluido';
}

const TEXTOS: Record<Situacao, { titulo: string; texto: string }> = {
  confirmado: {
    titulo: 'Pagamento confirmado! Sua vaga está garantida.',
    texto:
      'Enviamos a confirmação para o seu e-mail, com o endereço completo, o seu código de inscrição e o link do grupo do evento no WhatsApp. Costuma chegar em poucos minutos.',
  },
  verificando: {
    titulo: 'Conferindo o seu pagamento…',
    texto: 'Só um instante. Estamos verificando a sua inscrição.',
  },
  concluido: {
    titulo: 'Obrigada! Recebemos a sua inscrição.',
    texto:
      'Assim que o Mercado Pago confirmar o pagamento, você recebe um e-mail com a confirmação, o endereço completo, o seu código de inscrição e o link do grupo do evento no WhatsApp. Costuma levar poucos minutos.',
  },
  pendente: {
    titulo: 'Seu pagamento está em análise.',
    texto:
      'Assim que o Mercado Pago aprovar, enviamos a confirmação para o seu e-mail com o endereço, o seu código de inscrição e o link do grupo. Se pagou com Pix, conclua o pagamento no app do seu banco.',
  },
  falhou: {
    titulo: 'O pagamento não foi concluído.',
    texto:
      'Nenhum valor foi cobrado por esta tentativa. Para garantir sua vaga, pague com Pix, que é aprovado na hora. Se preferir cartão, espere cerca de 10 minutos ou use outro cartão: tentativas seguidas com os mesmos dados costumam ser bloqueadas pela segurança do Mercado Pago. Se precisar, fale com a gente no WhatsApp.',
  },
};

export function ThankYouPage() {
  const situacaoUrl = lerSituacao();
  const doMercadoPago = useMemo(() => veioDoMercadoPago(), []);
  const referencia = useMemo(() => lerReferenciaDaUrl() ?? lerReferencia(), []);
  const { status, conferindo } = useStatusInscricao(referencia);

  // A palavra final é do servidor. O que vem na URL só vale enquanto ele não responde.
  let situacao: Situacao = situacaoUrl;
  if (status === 'pago') situacao = 'confirmado';
  else if (!doMercadoPago) {
    // Abriu /obrigado direto (ex.: pagou o Pix no app do banco e voltou ao site)
    if (status === 'aguardando') situacao = 'pendente';
    else if (status === 'expirado') situacao = 'falhou';
    else if (status === null && conferindo) situacao = 'verificando';
  }
  const aguardandoConfirmacao = conferindo && (situacao === 'concluido' || situacao === 'pendente');
  const { titulo, texto } = TEXTOS[situacao];
  const inscricao = lerInscricao();
  // Com os dados da inscrição (guardados nesta aba), a mensagem já vai com nome e e-mail
  const linkWhatsapp = inscricao
    ? eventConfig.whatsappMensagem(
        `Olá! Acabei de me inscrever no evento ${eventConfig.eventName}. Meu nome é ${inscricao.nome} e o e-mail da inscrição é ${inscricao.email}.`,
      )
    : eventConfig.whatsappThankYou;
  const Icone =
    situacao === 'confirmado' || situacao === 'concluido'
      ? CheckCircle2
      : situacao === 'falhou'
        ? RotateCcw
        : situacao === 'verificando'
          ? Loader2
          : Clock;

  useEffect(() => {
    // Recusa: a janela de inscrição avisa antes de uma nova tentativa imediata
    if (situacaoUrl === 'falhou') marcarTentativa();
  }, [situacaoUrl]);

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = 'Inscrição | Coragem para Romper e Recomeçar';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.title = tituloAnterior;
      meta.remove();
    };
  }, []);

  return (
    <main className="min-h-[100svh] flex items-center justify-center bg-cream bg-grain px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-olive/15 text-olive-dark animate-float-slow">
          <Icone
            size={44}
            strokeWidth={1.5}
            aria-hidden="true"
            className={situacao === 'verificando' ? 'animate-spin' : ''}
          />
        </div>

        <h1 className="mt-8 font-serif text-3xl sm:text-5xl text-coffee text-balance">{titulo}</h1>

        <p className="mt-5 text-base sm:text-lg text-coffee-soft leading-relaxed">{texto}</p>

        {aguardandoConfirmacao && (
          <p role="status" className="mt-5 inline-flex items-center gap-2 text-sm text-coffee-soft">
            <Loader2 size={16} className="animate-spin text-terracota" aria-hidden="true" />
            Conferindo o pagamento automaticamente. Pode deixar esta página aberta.
          </p>
        )}

        {situacao !== 'falhou' && situacao !== 'verificando' && (
          <div className="mt-6 inline-flex items-start gap-2 rounded-2xl bg-sand px-4 py-3 text-left text-sm text-coffee-soft">
            <Mail size={18} className="mt-0.5 flex-shrink-0 text-terracota" aria-hidden="true" />
            <span>
              Não encontrou o e-mail? Confira o spam e a aba Promoções. Se ainda assim não chegar em até 30 minutos,
              chame a gente no WhatsApp com o comprovante.
            </span>
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-4">
          {situacao === 'verificando' ? null : situacao === 'falhou' ? (
            <CTAButton href="/" className="text-lg px-9 py-5">
              Tentar novamente
            </CTAButton>
          ) : (
            <a
              href={linkWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-olive-dark hover:text-terracota transition-colors"
            >
              <MessageCircle size={18} aria-hidden="true" /> Dúvidas? Fale com a gente no WhatsApp
            </a>
          )}
        </div>

        <a
          href="/"
          className="mt-12 inline-flex items-center gap-2 text-sm text-coffee-soft hover:text-terracota transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Voltar para a página do evento
        </a>
      </div>
    </main>
  );
}
