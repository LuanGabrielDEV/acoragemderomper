import { useState } from 'react';
import { Plus } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { Folha } from '@/components/Folha';

export function FAQ() {
  // Abre por padrão a dúvida sobre quem recebe o pagamento.
  const inicial = Math.max(0, eventConfig.faqs.findIndex((f) => f.q.startsWith('Por que o Pix')));
  const [open, setOpen] = useState<number | null>(inicial);

  return (
    <Folha id="duvidas" titulo="Perguntas que sempre chegam pelo WhatsApp">
      <div className="mt-10 max-w-3xl border-t border-terracota/20">
        {eventConfig.faqs.map((faq, i) => {
          const isOpen = open === i;
          const painel = `duvida-${i}`;
          return (
            <div key={faq.q} className="border-b border-terracota/20">
              <h3 className="font-body text-lg font-bold sm:text-xl">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={painel}
                  className="flex min-h-[3.5rem] w-full items-center justify-between gap-4 py-4 text-left text-coffee hover:text-terracota"
                >
                  <span>{faq.q}</span>
                  <Plus
                    size={22}
                    aria-hidden="true"
                    className={`flex-shrink-0 text-terracota transition-transform duration-200 ease-out ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
              </h3>
              <div id={painel} hidden={!isOpen} className="pb-6">
                <p className="max-w-[65ch] whitespace-pre-line text-coffee-soft">
                  {faq.a}
                  {'link' in faq && faq.link && (
                    <>
                      {' '}
                      <a
                        href={faq.link.href}
                        {...(faq.link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="font-bold text-terracota underline decoration-terracota/40 hover:decoration-terracota"
                      >
                        {faq.link.texto}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Folha>
  );
}
