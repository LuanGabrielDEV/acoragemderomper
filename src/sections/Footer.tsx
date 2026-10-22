import { Heart, Mail, MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';

export function Footer() {
  return (
    <footer className="bg-sand border-t border-coffee/10 pt-12 pb-28 sm:pb-12">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2 text-terracota">
            <Heart size={18} strokeWidth={1.5} />
            <span className="font-serif text-lg text-coffee">{eventConfig.organizerName}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-coffee-soft">
            <a
              href={`mailto:${eventConfig.organizerContact}`}
              className="inline-flex items-center gap-1.5 hover:text-terracota transition-colors"
            >
              <Mail size={15} /> {eventConfig.organizerContact}
            </a>
            <a
              href={eventConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-terracota transition-colors"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>

          <p className="mt-4 text-xs text-coffee-soft/60 max-w-md leading-relaxed">
            © {new Date().getFullYear()} {eventConfig.eventName}. Todos os direitos reservados.{' '}
            <a href={eventConfig.politicaUrl} className="underline underline-offset-2 hover:text-terracota">
              Política de compra, cancelamento e reembolso
            </a>
            .
            Suas informações são tratadas com privacidade e utilizadas apenas para a comunicação sobre o evento.
          </p>

          {/* Crédito do desenvolvedor */}
          <a
            href="https://portfolio-lg-sooty.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 inline-flex items-center gap-2 border-t border-coffee/10 pt-5 text-xs text-coffee-soft/70 transition-colors hover:text-coffee"
          >
            <span>Desenvolvido por</span>
            <img
              src="/images/lg-simbolo.svg"
              alt=""
              aria-hidden="true"
              width="16"
              height="17"
              className="h-4 w-auto opacity-60 transition-opacity group-hover:opacity-100"
            />
            <span className="font-semibold">Luan Gabriel</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
