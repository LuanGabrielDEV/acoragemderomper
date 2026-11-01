import { Folha } from '@/components/Folha';
import { Reveal } from '@/components/Reveal';

const passos = [
  { titulo: 'Romper', texto: 'Olhar para as crenças e os ciclos que te mantêm no mesmo lugar.' },
  { titulo: 'Restaurar', texto: 'Reencontrar quem você é, sem o peso do medo.' },
  { titulo: 'Decidir', texto: 'Escolher o seu próximo passo e sair com ele definido.' },
];

export function Identification() {
  return (
    <Folha id="para-quem" titulo="Você sente que precisa mudar, mas não sabe por onde começar?">
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-coffee-soft">
        Esta tarde foi pensada para mulheres que estão adiando uma decisão. Nela, você faz três movimentos:
      </p>

      <Reveal>
      <ol className="mt-8 max-w-2xl divide-y divide-linha border-y border-linha">
        {passos.map((p, i) => (
          <li key={p.titulo} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:py-6">
            <span aria-hidden="true" className="font-serif text-2xl leading-none text-terracota sm:text-3xl">
              {i + 1}.
            </span>
            <div>
              <h3 className="text-2xl text-coffee sm:text-3xl">{p.titulo}</h3>
              <p className="mt-1.5 text-coffee-soft">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
      </Reveal>
    </Folha>
  );
}
