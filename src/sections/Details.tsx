import { eventConfig } from '@/data/eventConfig';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Folha } from '@/components/Folha';
import { Reveal } from '@/components/Reveal';

export function Details() {
  const ficha = [
    { rotulo: 'Data', valor: eventConfig.date },
    { rotulo: 'Horário', valor: eventConfig.time },
    {
      rotulo: 'Local',
      valor: eventConfig.cidade ? `${eventConfig.cidade}. ${eventConfig.location}` : eventConfig.location,
    },
    { rotulo: 'Vagas', valor: `Limitadas a ${eventConfig.spots}` },
    { rotulo: 'Valor', valor: `${eventConfig.price}, Pix ou cartão em até 5x` },
  ];

  return (
    <Folha id="detalhes" tom="sand" titulo="Tudo o que você precisa saber antes de ir">
      <div className="mt-12 grid max-w-3xl gap-12 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
      <Reveal className="lg:order-2 lg:pt-1">
        <div className="moldura relative mx-2 sm:mx-0">
          <div className="revela-foto tom-barro-leve relative overflow-hidden rounded-[1.25rem]">
            <img
              src="/images/encontro-mulheres.jpg"
              alt="Três mulheres conversando em volta de uma mesinha, num ambiente acolhedor"
              width={1600}
              height={1067}
              className="foto-suave aspect-[16/10] w-full object-cover object-[50%_55%] lg:aspect-[5/4] lg:object-[48%_55%]"
              loading="lazy"
            />
          </div>
        </div>
      </Reveal>
      <div className="lg:order-1">
      <dl className="border-t border-linha">
        {ficha.map((f) => (
          <div key={f.rotulo} className="grid gap-1 border-b border-linha py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
            <dt className="font-bold text-coffee">{f.rotulo}</dt>
            <dd className="text-coffee-soft">{f.valor}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10">
        <CheckoutButton variant="secondary" className="w-full sm:w-auto">
          Quero uma das 30 vagas
        </CheckoutButton>
      </div>
      </div>
      </div>

    </Folha>
  );
}
