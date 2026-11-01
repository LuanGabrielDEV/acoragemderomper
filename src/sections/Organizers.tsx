import { Mic2, Sparkles } from 'lucide-react';
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

        <ul className="grid max-w-xl gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[
            { nome: 'Soraia Ferreira', papel: 'Terapeuta Cristã do Emocional Feminino' },
            { nome: 'Wirlla Dantas', papel: 'Mentora de Recomeços e Desenvolvimento Pessoal' },
          ].map((o, i) => (
            <li key={o.nome}>
              <Reveal delay={i * 120} className="h-full">
                <div className="h-full rounded-[1.25rem] bg-cream p-5 sm:p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-nude/70 text-dourado">
                    <Sparkles size={21} strokeWidth={1.6} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-2xl text-coffee sm:mt-5">{o.nome}</h3>
                  <p className="mt-1.5 font-medium leading-snug text-olive-dark">{o.papel}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
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
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-nude/70 text-dourado">
              <Mic2 size={20} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <p className="font-serif text-lg italic text-dourado">Palestrante convidada</p>
          </div>
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
