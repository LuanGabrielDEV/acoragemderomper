import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

/** Uma seção da página: título em serifada, alinhado à esquerda, e o conteúdo abaixo. */
export function Folha({
  id,
  titulo,
  children,
  tom = 'cream',
  className = '',
}: {
  id?: string;
  titulo: ReactNode;
  children?: ReactNode;
  tom?: 'cream' | 'sand';
  className?: string;
}) {
  const tituloId = id ? `${id}-titulo` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={tituloId}
      className={`scroll-mt-6 py-16 sm:py-24 ${tom === 'sand' ? 'bg-sand' : 'bg-cream'} ${className}`}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <h2 id={tituloId} className="max-w-3xl text-[2rem] text-coffee sm:text-5xl">
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  );
}

/** Marca de item incluso, no verde do ramo da logo. */
export function Visto({ className = '' }: { className?: string }) {
  return <Check aria-hidden="true" size={20} strokeWidth={1.75} className={`flex-shrink-0 text-olive ${className}`} />;
}
