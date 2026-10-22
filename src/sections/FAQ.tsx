import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream py-20 sm:py-32 bg-grain">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Perguntas Frequentes">
            Tudo o que você precisa saber
          </SectionHeading>
        </Reveal>

        <div className="mt-10 space-y-3 sm:mt-14 sm:space-y-4">
          {eventConfig.faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.q} delay={i * 80}>
                <div
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-terracota/30 bg-sand shadow-soft'
                      : 'border-coffee/10 bg-sand/60 hover:bg-sand'
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:gap-4 sm:px-6 sm:py-5"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-base text-coffee sm:text-lg">{faq.q}</span>
                    <span
                      className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${
                        isOpen ? 'bg-terracota text-cream' : 'bg-nude/60 text-terracota'
                      }`}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-400 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm text-coffee-soft leading-relaxed sm:px-6 sm:pb-5 sm:text-base">
                        {faq.a}
                        {'link' in faq && faq.link && (
                          <>
                            {' '}
                            <a href={faq.link.href} className="font-semibold text-terracota underline-offset-2 hover:underline">
                              {faq.link.texto}
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
