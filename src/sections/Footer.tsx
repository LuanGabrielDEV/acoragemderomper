import { Mail, MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';

/** Rodapé: contatos, política e créditos. */
export function Footer() {
  return (
    <footer className="border-t border-linha bg-sand pb-28 pt-14 text-coffee sm:pb-16 sm:pt-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="max-w-xl font-serif text-3xl leading-tight sm:text-4xl">{eventConfig.eventName}</p>
        <p className="mt-3 text-coffee-soft">Organizadoras: Wirlla Dantas e Soraia Ferreira</p>

        <div className="mt-8 flex flex-col gap-1 sm:flex-row sm:gap-8">
          <a
            href={`mailto:${eventConfig.organizerContact}`}
            className="inline-flex min-h-[2.75rem] items-center gap-2 underline decoration-coffee/30 underline-offset-4 hover:decoration-coffee"
          >
            <Mail size={18} aria-hidden="true" /> {eventConfig.organizerContact}
          </a>
          <a
            href={eventConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[2.75rem] items-center gap-2 underline decoration-coffee/30 underline-offset-4 hover:decoration-coffee"
          >
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp (81) 98552-6701
          </a>
        </div>

        <div className="mt-10 border-t border-linha pt-6 text-sm leading-relaxed text-coffee-soft">
          <p className="max-w-2xl">
            © {new Date().getFullYear()} {eventConfig.eventName}. Suas informações são tratadas com privacidade e usadas
            apenas para a comunicação sobre o evento.
          </p>
          <a
            href={eventConfig.politicaUrl}
            className="mt-2 inline-flex min-h-[2.75rem] items-center font-bold underline decoration-coffee/30 underline-offset-4 hover:decoration-coffee"
          >
            Política de compra, cancelamento e reembolso
          </a>
          <div>
            <a
              href="https://portfolio-lg-sooty.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-[2.75rem] items-center gap-2 hover:underline"
            >
              <span>Site desenvolvido por</span>
              <img
                src="/images/lg-simbolo.svg"
                alt=""
                aria-hidden="true"
                width="16"
                height="17"
                className="h-4 w-auto"
              />
              <span className="font-bold">Luan Gabriel</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
