import { Folha } from '@/components/Folha';
import { Reveal } from '@/components/Reveal';

export function Organizers() {
  return (
    <Folha id="quem-conduz" tom="sand" titulo="Quem recebe você no encontro">
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-coffee-soft">
        Soraia e Wirlla criaram este encontro para dar às mulheres uma pausa: um tempo para escutar, refletir e
        decidir o que vem depois.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <Reveal>
        <figure className="mx-auto w-full max-w-sm lg:mx-0">
          <div className="moldura relative mx-2 sm:mx-0">
            <div className="revela-foto overflow-hidden rounded-[1.25rem]">
            <img
              src="/images/02.jpeg"
              alt="Soraia Ferreira e Wirlla Dantas, que conduzem o encontro"
              width={1086}
              height={1174}
              className="aspect-[4/5] w-full object-cover object-center"
              loading="lazy"
            />
            </div>
            <p className="absolute -bottom-4 right-3 rounded-xl bg-terracota px-4 py-2 text-sm font-bold text-cream sm:-right-6">
              Duas mulheres, uma travessia
            </p>
          </div>
        </figure>
        </Reveal>

        <dl className="max-w-xl divide-y divide-linha border-y border-linha">
          <div className="py-5">
            <dt className="font-serif text-2xl text-coffee sm:text-3xl">Soraia Ferreira</dt>
            <dd className="mt-1 text-coffee-soft">Terapeuta Cristã do Emocional Feminino</dd>
          </div>
          <div className="py-5">
            <dt className="font-serif text-2xl text-coffee sm:text-3xl">Wirlla Dantas</dt>
            <dd className="mt-1 text-coffee-soft">Mentora de Recomeços e Desenvolvimento Pessoal</dd>
          </div>
        </dl>
      </div>

      {/* Palestrante convidada */}
      <Reveal>
      <article className="mt-16 grid gap-8 sm:mt-20 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-start sm:gap-10">
        <div className="moldura relative ml-2 w-full max-w-[13rem] sm:ml-0">
          <div className="revela-foto overflow-hidden rounded-[1.25rem]">
          <img
            src="/images/lu-santos.jpg"
            alt="Lu Santos, palestrante convidada do encontro"
            width={787}
            height={1048}
            className="aspect-[3/4] w-full object-cover object-top"
            loading="lazy"
          />
          </div>
        </div>
        <div className="max-w-2xl">
          <h3 className="text-3xl text-coffee sm:text-4xl">Lu Santos</h3>
          <p className="mt-1 font-serif italic text-coffee-soft">Palestrante convidada</p>
          <p className="mt-4 text-coffee-soft">
            Especialista em Harmonização Facial e palestrante, com atuação voltada à estética, ao posicionamento
            profissional e à construção de autoridade.
          </p>
          <details className="group mt-3">
            <summary className="inline-flex min-h-[2.75rem] cursor-pointer list-none items-center gap-2 font-bold text-terracota underline decoration-terracota/40 underline-offset-4 hover:decoration-terracota [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Ler mais sobre a Lu</span>
              <span className="hidden group-open:inline">Ler menos</span>
            </summary>
            <div className="mt-2 space-y-4 text-coffee-soft">
              <p>
                Através de sua experiência na prática clínica e no ambiente digital, compartilha conhecimentos sobre
                como transformar competência em valor percebido, construir credibilidade e desenvolver uma presença
                profissional autêntica e estratégica.
              </p>
              <p>
                Suas palestras conectam imagem, comunicação e posicionamento, mostrando como a forma como nos
                apresentamos influencia a confiança que despertamos e as oportunidades que construímos.
              </p>
              <p>
                Seu propósito é inspirar profissionais a reconhecerem o valor do que fazem e aprenderem a comunicá-lo
                com clareza, autenticidade e intenção.
              </p>
            </div>
          </details>
        </div>
      </article>
      </Reveal>
    </Folha>
  );
}
