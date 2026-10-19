import { useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Mail, MessageCircle, RotateCcw } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CTAButton } from '@/components/CTAButton';

/**
 * Página para onde o Mercado Pago devolve a pessoa depois do checkout.
 *
 * Importante: qualquer pessoa pode abrir /obrigado, então esta página NUNCA
 * afirma que o pagamento foi aprovado nem mostra o endereço. A confirmação
 * real é o e-mail enviado pela planilha, que só sai depois que o servidor
 * confere o pagamento no Mercado Pago.
 */

type Situacao = 'concluido' | 'pendente' | 'falhou';

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
      'Nenhum valor foi cobrado por esta tentativa. Você pode tentar de novo pela página do evento, com outro cartão ou com Pix. Se precisar, fale com a gente no WhatsApp.',
  },
};

export function ThankYouPage() {
  const situacao = lerSituacao();
  const { titulo, texto } = TEXTOS[situacao];
  const Icone = situacao === 'concluido' ? CheckCircle2 : situacao === 'pendente' ? Clock : RotateCcw;

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
          <Icone size={44} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <h1 className="mt-8 font-serif text-3xl sm:text-5xl text-coffee text-balance">{titulo}</h1>

        <p className="mt-5 text-base sm:text-lg text-coffee-soft leading-relaxed">{texto}</p>

        {situacao !== 'falhou' && (
          <div className="mt-6 inline-flex items-start gap-2 rounded-2xl bg-sand px-4 py-3 text-left text-sm text-coffee-soft">
            <Mail size={18} className="mt-0.5 flex-shrink-0 text-terracota" aria-hidden="true" />
            <span>
              Não encontrou o e-mail? Confira o spam e a aba Promoções. Se ainda assim não chegar em até 30 minutos,
              chame a gente no WhatsApp com o comprovante.
            </span>
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-4">
          {situacao === 'falhou' ? (
            <CTAButton href="/" className="text-lg px-9 py-5">
              Tentar novamente
            </CTAButton>
          ) : (
            <a
              href={eventConfig.whatsappThankYou}
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
