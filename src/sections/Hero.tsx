import { eventConfig } from '@/data/eventConfig';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Reveal } from '@/components/Reveal';

/**
 * Abertura: a logo do Romper em destaque, num quadro pêssego com moldura,
 * e ao lado (no celular, logo abaixo) o nome, os dados do encontro e o botão.
 * No celular, tudo isso cabe na primeira tela.
 */
export function Hero() {
  const fatos = [
    { rotulo: 'Data', valor: eventConfig.date },
    { rotulo: 'Horário', valor: 'A partir das 14h' },
    { rotulo: 'Local', valor: eventConfig.cidade || 'Encontro presencial' },
    { rotulo: 'Valor', valor: `${eventConfig.price} (até 5x)` },
  ];

  return (
    <header className="overflow-hidden bg-sand">
      <div className="mx-auto grid max-w-6xl items-center gap-7 px-5 pb-12 pt-6 sm:px-8 sm:pb-20 sm:pt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-20">
        {/* Logo em destaque */}
        <div className="lg:order-2">
          <div className="moldura relative mx-2 sm:mx-4 lg:mx-0">
            <div className="relative overflow-hidden rounded-[1.25rem] bg-gradient-to-b from-[#FFF7F0] to-[#F3DDCB] sm:rounded-[1.5rem]">
              <img
                src="/images/logo-romper.webp"
                alt="Logo do Romper: um R dentro de um círculo, com uma porta aberta e um ramo de folhas"
                width={1952}
                height={1449}
                className="aspect-[16/9] w-full object-contain p-4 sm:aspect-[4/3] sm:p-10 lg:aspect-square"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <p className="flutuar absolute -bottom-4 left-4 rounded-xl bg-cream px-4 py-2 font-serif text-base italic text-terracota shadow-soft sm:left-6 sm:text-lg">
              Existe algo novo do outro lado.
            </p>
          </div>
        </div>

        {/* Nome, dados e ação */}
        <Reveal className="lg:order-1">
          <h1 className="mt-4 text-[2.3rem] leading-[1.05] text-coffee sm:text-6xl lg:mt-0">{eventConfig.eventName}</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-coffee-soft sm:mt-5 sm:text-xl">
            {eventConfig.subtitle}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-terracota/25 py-4 sm:mt-8">
            {fatos.map((f) => (
              <div key={f.rotulo}>
                <dt className="text-sm text-coffee-soft">{f.rotulo}</dt>
                <dd className="font-serif text-lg leading-snug text-coffee sm:text-xl">{f.valor}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 sm:mt-8">
            <CheckoutButton className="w-full sm:w-auto">Garantir minha vaga · {eventConfig.price}</CheckoutButton>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-coffee-soft sm:text-base">{eventConfig.garantia}</p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
