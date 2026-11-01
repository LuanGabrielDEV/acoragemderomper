import { eventConfig } from '@/data/eventConfig';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Folha } from '@/components/Folha';

export function Details() {
  const ficha = [
    { rotulo: 'Data', valor: eventConfig.date },
    { rotulo: 'Horário', valor: eventConfig.time },
    {
      rotulo: 'Local',
      valor: eventConfig.cidade ? `${eventConfig.cidade}. ${eventConfig.location}` : eventConfig.location,
    },
    { rotulo: 'Vagas', valor: `Limitadas a ${eventConfig.spots}` },
    { rotulo: 'Valor', valor: `${eventConfig.price}, no Pix ou no cartão em até 5x` },
  ];

  return (
    <Folha id="detalhes" tom="sand" titulo="Tudo o que você precisa saber antes de ir">
      <div className="mt-12 grid max-w-3xl gap-12 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
      <figure className="lg:order-2 lg:pt-1">
        <div className="moldura relative mx-2 sm:mx-0">
          <div className="tom-barro relative overflow-hidden rounded-[1.25rem]">
            <img
              src="/images/03.jpg"
              alt="Mulheres conversando com xícaras nas mãos, em clima de acolhimento"
              width={1800}
              height={1202}
              className="foto-quente aspect-[16/10] w-full object-cover object-[55%_72%] sm:aspect-[21/9] sm:object-[55%_78%] lg:aspect-[4/5] lg:object-[45%_60%]"
              loading="lazy"
            />
          </div>
        </div>
        <figcaption className="mt-3 font-serif text-base italic text-coffee-soft">Imagem ilustrativa do clima do encontro</figcaption>
      </figure>
      <dl className="border-t border-linha lg:order-1">
        {ficha.map((f) => (
          <div key={f.rotulo} className="grid gap-1 border-b border-linha py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
            <dt className="font-bold text-coffee">{f.rotulo}</dt>
            <dd className="text-coffee-soft">{f.valor}</dd>
          </div>
        ))}
      </dl>
      </div>

      <div className="mt-10">
        <CheckoutButton variant="secondary" className="w-full sm:w-auto">
          Quero uma das 30 vagas
        </CheckoutButton>
      </div>
    </Folha>
  );
}
