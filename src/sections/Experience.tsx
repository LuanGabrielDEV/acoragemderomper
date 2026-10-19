import { Sparkles, PenLine, UtensilsCrossed, HeartHandshake, Flower2 } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

const iconMap = { Sparkles, PenLine, UtensilsCrossed, HeartHandshake, Flower2 };

export function Experience() {
  return (
    <section className="relative bg-sand py-20 sm:py-32 overflow-hidden">
      {/* Decorative image strip */}
      <div className="absolute right-0 top-0 h-72 w-72 hidden lg:block opacity-[0.18]">
        <img
          src="/images/01.jpeg"
          alt=""
          className="h-full w-full object-cover rounded-bl-[5rem]"
          aria-hidden="true"
        />
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-8 relative">
        <Reveal>
          <SectionHeading eyebrow="A Experiência">
            O que esperar deste encontro
          </SectionHeading>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6">
          {eventConfig.experiences.map((exp, i) => {
            const Icon = iconMap[exp.icon as keyof typeof iconMap];
            return (
              <Reveal
                key={exp.title}
                delay={i * 120}
                className={
                  eventConfig.experiences.length % 2 === 1 && i === eventConfig.experiences.length - 1
                    ? 'sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)]'
                    : ''
                }
              >
                <div className="flex h-full gap-4 rounded-2xl bg-cream p-5 shadow-soft transition-all duration-500 hover:shadow-soft-lg sm:gap-5 sm:p-7">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-olive/15 text-olive-dark sm:h-14 sm:w-14">
                      {Icon && <Icon size={24} strokeWidth={1.5} className="sm:!h-6 sm:!w-6" />}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg text-coffee sm:text-xl">{exp.title}</h3>
                    <p className="mt-2 text-sm text-coffee-soft leading-relaxed sm:text-base">{exp.desc}</p>
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
