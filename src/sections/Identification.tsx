import { Sparkles, Heart, Footprints } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { Ornamentos } from '@/components/Ornamentos';

const topics = [
  {
    icon: Sparkles,
    title: 'Romper',
    text: 'Olhar para as crenças e os ciclos que te mantêm no mesmo lugar.',
  },
  {
    icon: Heart,
    title: 'Restaurar',
    text: 'Reencontrar quem você é, sem o peso do medo.',
  },
  {
    icon: Footprints,
    title: 'Decidir',
    text: 'Escolher o seu próximo passo e sair com ele definido.',
  },
];

export function Identification() {
  return (
    <section className="relative isolate overflow-hidden bg-cream py-20 sm:py-32 bg-grain">
      <Ornamentos />
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Para quem é este encontro">
            Você sente que precisa mudar, mas não sabe por onde começar?
          </SectionHeading>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3 sm:mt-16">
          {topics.map((topic, i) => (
            <Reveal key={topic.title} delay={i * 150}>
              <div className="group h-full rounded-3xl bg-sand p-6 text-center transition-all duration-500 hover:shadow-soft-lg hover:-translate-y-1 sm:p-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-nude/60 text-terracota transition-colors duration-500 group-hover:bg-terracota group-hover:text-cream sm:h-16 sm:w-16">
                  <topic.icon size={26} strokeWidth={1.5} className="sm:!h-7 sm:!w-7" />
                </div>
                <h3 className="mt-5 font-serif text-xl text-coffee sm:mt-6 sm:text-2xl">{topic.title}</h3>
                <p className="mt-3 text-sm text-coffee-soft leading-relaxed sm:text-base">{topic.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
