import { Check, Calendar, Clock } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

const includedItems = [
  'Material de escrita e reflexão',
  'Mesa posta com chá e cuidados',
  'Coffee break',
  'Experiência relaxante com massagem e escalda-pés',
  'Espaço intimista e acolhedor',
  'Encontro guiado e presencial',
];

export function Schedule() {
  return (
    <section className="bg-cream py-20 sm:py-32 bg-grain">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Como será o encontro">
            Uma jornada de travessia, em poucos momentos
          </SectionHeading>
        </Reveal>

        {/* Timeline */}
        <div className="mt-12 sm:mt-16 relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] sm:left-1/2 top-0 bottom-0 w-px bg-terracota/20 sm:-translate-x-1/2" />

          <div className="space-y-8 sm:space-y-10">
            {eventConfig.schedule.map((moment, i) => (
              <Reveal key={moment.title} delay={i * 100}>
                <div
                  className={`relative flex items-start gap-4 sm:gap-0 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-terracota text-cream font-serif text-base shadow-soft sm:absolute sm:left-1/2 sm:h-14 sm:w-14 sm:-translate-x-1/2 sm:text-lg">
                    {i + 1}
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 sm:w-1/2 ${
                      i % 2 === 0 ? 'sm:pr-16 sm:text-right' : 'sm:pl-16'
                    }`}
                  >
                    <div className="rounded-2xl bg-sand p-5 shadow-soft sm:p-6">
                      <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-terracota">
                        {moment.time}
                      </p>
                      <h3 className="mt-2 font-serif text-xl text-coffee">{moment.title}</h3>
                      <p className="mt-2 text-coffee-soft leading-relaxed">{moment.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Included */}
        <Reveal delay={200}>
          <div className="mt-16 rounded-3xl bg-olive/8 p-6 sm:mt-20 sm:p-10 border border-olive/15">
            <h3 className="font-serif text-xl sm:text-2xl text-coffee text-center">O que está incluso</h3>
            <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              {includedItems.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-olive text-cream">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-coffee">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-coffee-soft">
              <span className="inline-flex items-center gap-2">
                <Calendar size={16} className="text-olive-dark" /> {eventConfig.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={16} className="text-olive-dark" /> {eventConfig.time} · {eventConfig.duration}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
