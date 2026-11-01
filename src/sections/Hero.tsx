import { eventConfig } from '@/data/eventConfig';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Reveal } from '@/components/Reveal';

/**
 * Abertura: a logo do Romper dentro de um arco de porta (a mesma forma da porta
 * da logo) e, ao lado (no celular, logo abaixo), o nome, os dados e o botão.
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
      <div className="mx-auto grid max-w-5xl items-center gap-7 px-5 pb-12 pt-6 sm:px-8 sm:pb-20 sm:pt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-20">
        {/* Logo dentro de um arco de porta, como a porta da logo */}
        <div className="flex justify-center lg:order-2 lg:justify-end">
          <div className="batente w-[13.5rem] [@media(max-height:760px)]:w-[10.5rem] sm:w-[19rem] lg:w-[22rem] lg:[@media(max-height:760px)]:w-[19rem]">
            <div className="arco flex aspect-[13/15] flex-col items-center justify-end overflow-hidden bg-gradient-to-b from-[#FFF8F2] via-[#FBEBDD] to-[#F1D8C4] px-5 pb-5 sm:aspect-[4/5] sm:px-8 sm:pb-9">
              <img
                src="/images/logo-romper.webp"
                alt="Logo do Romper: um R dentro de um círculo, com uma porta aberta e um ramo de folhas"
                width={1952}
                height={1449}
                className="w-full object-contain"
                loading="eager"
                fetchPriority="high"
              />
              <p className="mt-2 text-center font-serif text-sm italic leading-snug text-terracota-dark [@media(max-height:760px)]:hidden sm:mt-5 sm:text-lg sm:[@media(max-height:760px)]:block">
                Existe algo novo do outro lado.
              </p>
            </div>
          </div>
        </div>

        {/* Nome, dados e ação */}
        <Reveal className="lg:order-1">
          <h1 className="mt-2 text-[2.3rem] leading-[1.05] text-coffee sm:text-6xl lg:mt-0">
            A Coragem para <em className="font-serif italic text-terracota">Romper</em> e Recomeçar
          </h1>
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
