/**
 * Manchas de cor muito suaves que se movem devagar atrás de uma seção.
 * A seção precisa ter as classes "relative isolate overflow-hidden".
 * São só gradientes (sem blur pesado), então rodam bem em celulares simples.
 */
export function Ornamentos({ tom = 'terracota' }: { tom?: 'terracota' | 'oliva' }) {
  const principal = tom === 'terracota' ? 'orn-terracota' : 'orn-oliva';
  const secundaria = tom === 'terracota' ? 'orn-oliva' : 'orn-terracota';

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className={`orn orn-a ${principal}`} />
      <div className={`orn orn-b hidden sm:block ${secundaria}`} />
    </div>
  );
}
