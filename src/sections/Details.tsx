import { MapPin, Calendar, Clock, Users, Wallet } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CTAButton } from '@/components/CTAButton';
import { Reveal } from '@/components/Reveal';

export function Details() {
  const details = [
    { icon: Calendar, label: 'Data', value: eventConfig.date },
    { icon: Clock, label: 'Horário', value: `${eventConfig.time} · ${eventConfig.duration}` },
    { icon: MapPin, label: 'Local', value: eventConfig.location },
    { icon: Users, label: 'Vagas', value: `Limitadas a ${eventConfig.spots}` },
    { icon: Wallet, label: 'Investimento', value: eventConfig.price },
  ];

  return (
    <section className="relative bg-sand py-20 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <h2 className="text-center font-serif text-2xl sm:text-4xl md:text-5xl text-coffee text-balance leading-tight">
            Detalhes do encontro
          </h2>
          <p className="mt-4 text-center text-coffee-soft text-base sm:text-lg max-w-xl mx-auto">
            Um encontro presencial, intimista e cuidadoso — pensado para poucas mulheres.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-10 overflow-hidden rounded-3xl bg-cream shadow-soft-lg sm:mt-14">
            {/* Top image banner */}
            <div className="relative h-44 sm:h-64">
              <img
                src="https://images.pexels.com/photos/6979275/pexels-photo-6979275.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Três mulheres compartilhando uma conversa leve em um ambiente residencial aconchegante"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee/60 to-transparent" />
              <div className="absolute bottom-4 left-5 sm:bottom-5 sm:left-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-cream/95 px-3 py-1.5 text-xs font-semibold text-terracota sm:px-4 sm:py-2 sm:text-sm">
                  <MapPin size={15} className="flex-shrink-0" /> Encontro presencial intimista
                </span>
              </div>
            </div>

            {/* Details grid */}
            <div className="divide-y divide-coffee/8">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-start gap-4 px-5 py-4 sm:px-9 sm:py-5"
                >
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-nude/50 text-terracota">
                    <detail.icon size={20} strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-coffee-soft/70">
                      {detail.label}
                    </p>
                    <p className="mt-1 text-sm text-coffee leading-relaxed sm:text-base">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 text-center sm:mt-12">
            <CTAButton href={eventConfig.checkoutUrl} external className="w-full justify-center text-base sm:w-auto sm:text-lg">
              Garantir minha vaga — {eventConfig.price}
            </CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
