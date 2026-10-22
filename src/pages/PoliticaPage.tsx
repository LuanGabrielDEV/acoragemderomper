import { useEffect } from 'react';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { politica } from '@/data/politica';

/** Página /politica: Política de Compra, Cancelamento e Reembolso. */
export function PoliticaPage() {
  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = `Política de compra e reembolso | ${eventConfig.eventName}`;
    window.scrollTo(0, 0);
    return () => {
      document.title = tituloAnterior;
    };
  }, []);

  return (
    <main className="min-h-[100svh] bg-cream bg-grain px-5 py-14 sm:py-20">
      <article className="mx-auto max-w-2xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-coffee-soft transition-colors hover:text-terracota"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Voltar para a página do evento
        </a>

        <h1 className="mt-8 font-serif text-3xl leading-tight text-coffee text-balance sm:text-4xl">
          {politica.titulo}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-coffee-soft sm:text-lg">{politica.introducao}</p>

        <ol className="mt-10 space-y-8">
          {politica.secoes.map((secao, i) => (
            <li key={secao.titulo}>
              <h2 className="font-serif text-xl text-coffee sm:text-2xl">
                {i + 1}. {secao.titulo}
              </h2>
              {secao.paragrafos.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-base leading-relaxed text-coffee-soft">
                  {p}
                </p>
              ))}
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl bg-sand p-5 sm:p-6">
          <p className="font-semibold text-coffee">Canal oficial de atendimento</p>
          <div className="mt-3 flex flex-col gap-2 text-coffee-soft sm:flex-row sm:gap-6">
            <a
              href={eventConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-terracota"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
            <a href={`mailto:${eventConfig.organizerContact}`} className="inline-flex items-center gap-2 hover:text-terracota">
              <Mail size={16} aria-hidden="true" /> {eventConfig.organizerContact}
            </a>
          </div>
          <p className="mt-3 text-sm text-coffee-soft">
            Informe o seu nome e o código de inscrição recebido por e-mail para identificarmos a compra.
          </p>
        </div>
      </article>
    </main>
  );
}
