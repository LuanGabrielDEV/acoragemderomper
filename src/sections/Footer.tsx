import { Mail, MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CheckoutButton } from '@/components/CheckoutButton';

const atalhos = [
  { href: '#quem-conduz', texto: 'Quem conduz' },
  { href: '#a-tarde', texto: 'Como é a tarde' },
  { href: '#detalhes', texto: 'Detalhes' },
  { href: '#duvidas', texto: 'Dúvidas' },
];

const link = 'underline decoration-cream/30 underline-offset-4 transition-colors hover:decoration-cream';

/** Rodapé no verde do ramo da logo: a marca, o resumo do encontro, atalhos e contato. */
export function Footer() {
  return (
    <footer className="bg-olive-dark text-cream">
      <div className="mx-auto max-w-5xl px-5 pb-28 pt-16 sm:px-8 sm:pb-14 sm:pt-20">
        {/* Marca e chamada */}
        <div className="flex flex-col gap-8 border-b border-cream/20 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <img
              src="/images/logo-romper.webp"
              alt="Romper"
              width={1952}
              height={1449}
              className="silhueta-clara h-16 w-auto opacity-90 sm:h-20"
              loading="lazy"
            />
            <p className="mt-6 font-serif text-2xl leading-snug sm:text-3xl">
              Existe algo novo <em className="italic text-nude">do outro lado.</em>
            </p>
          </div>
          <div className="lg:text-right">
            <CheckoutButton variant="papel" className="w-full sm:w-auto">
              Garantir minha vaga · {eventConfig.price}
            </CheckoutButton>
            <p className="mt-3 text-sm text-cream/80">Vagas limitadas a {eventConfig.spots}.</p>
          </div>
        </div>

        {/* Colunas */}
        <div className="grid gap-10 py-12 sm:grid-cols-3">
          <div>
            <h2 className="font-serif text-lg italic text-nude">O encontro</h2>
            <ul className="mt-4 space-y-2 text-cream/85">
              <li>{eventConfig.date}, a partir das 14h</li>
              <li>{eventConfig.cidade || 'Presencial, endereço por e‑mail'}</li>
              <li>{eventConfig.spots}</li>
              <li>{eventConfig.price}, Pix ou até 5x</li>
            </ul>
          </div>

          <nav aria-label="Atalhos da página">
            <h2 className="font-serif text-lg italic text-nude">Na página</h2>
            <ul className="mt-4 space-y-1">
              {atalhos.map((a) => (
                <li key={a.href}>
                  <a href={a.href} className={`inline-flex min-h-[2.25rem] items-center ${link}`}>
                    {a.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-serif text-lg italic text-nude">Fale com a gente</h2>
            <ul className="mt-4 space-y-1">
              <li>
                <a
                  href={eventConfig.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-[2.75rem] items-center gap-2 ${link}`}
                >
                  <MessageCircle size={18} aria-hidden="true" /> (81) 98552-6701
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${eventConfig.organizerContact}`}
                  className={`inline-flex min-h-[2.75rem] items-center gap-2 break-all ${link}`}
                >
                  <Mail size={18} aria-hidden="true" /> {eventConfig.organizerContact}
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm text-cream/80">Organizadoras: Wirlla Dantas e Soraia Ferreira</p>
          </div>
        </div>

        {/* Linha final */}
        <div className="flex flex-col gap-3 border-t border-cream/20 pt-6 text-sm text-cream/80 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl">
            © {new Date().getFullYear()} {eventConfig.eventName}.{' '}
            <a href={eventConfig.politicaUrl} className={`font-bold text-cream ${link}`}>
              Política de compra, cancelamento e reembolso
            </a>
            . Suas informações são tratadas com privacidade e usadas apenas para a comunicação sobre o evento.
          </p>
          <a
            href="https://portfolio-lg-sooty.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[2.75rem] items-center gap-2 text-cream/80 hover:text-cream"
          >
            <span>Site por</span>
            <img src="/images/lg-simbolo.svg" alt="" aria-hidden="true" width="16" height="17" className="h-4 w-auto brightness-0 invert" />
            <span className="font-bold">Luan Gabriel</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
