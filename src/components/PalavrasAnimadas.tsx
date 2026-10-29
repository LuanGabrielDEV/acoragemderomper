import { Fragment } from 'react';

/**
 * Mostra um texto aparecendo palavra por palavra.
 * Quem usa leitor de tela lê o texto inteiro normalmente (aria-label).
 */
export function PalavrasAnimadas({
  texto,
  atraso = 0,
  passo = 70,
}: {
  texto: string;
  atraso?: number;
  passo?: number;
}) {
  const palavras = texto.split(' ');

  return (
    <span aria-label={texto}>
      {palavras.map((palavra, i) => (
        <Fragment key={`${palavra}-${i}`}>
          {i > 0 && ' '}
          <span aria-hidden="true" className="palavra-wrap">
            <span className="palavra" style={{ animationDelay: `${atraso + i * passo}ms` }}>
              {palavra}
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}
