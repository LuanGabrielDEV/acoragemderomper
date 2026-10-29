import { useEffect, useRef, useState, type RefObject } from 'react';

/** True quando a pessoa pediu "reduzir movimento" no aparelho. */
export function prefereMenosMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Devolve [ref, visivel]: vira true uma única vez, quando o elemento entra na tela. */
export function useEmVista<T extends HTMLElement>(margem = '0px 0px -60px 0px') {
  const ref = useRef<T>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisivel(true);
      return;
    }
    // Segurança: nada fica escondido para sempre.
    const seguranca = setTimeout(() => setVisivel(true), 3000);
    const observer = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisivel(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: margem },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(seguranca);
    };
  }, [margem]);

  return [ref, visivel] as const;
}

/**
 * Parallax suave: o elemento anda mais devagar que a página.
 * Mexe direto no estilo (sem re-renderizar o React) e só roda enquanto o elemento está visível.
 */
export function useParallax<T extends HTMLElement>(ref: RefObject<T>, velocidade = 0.06, maximo = 36) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefereMenosMovimento()) return;

    let quadro = 0;
    let visivel = true;

    const atualizar = () => {
      quadro = 0;
      const y = Math.min(window.scrollY * velocidade, maximo);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const aoRolar = () => {
      if (visivel && !quadro) quadro = requestAnimationFrame(atualizar);
    };

    const observer = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
    });
    observer.observe(el);
    window.addEventListener('scroll', aoRolar, { passive: true });
    atualizar();

    return () => {
      window.removeEventListener('scroll', aoRolar);
      observer.disconnect();
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [ref, velocidade, maximo]);
}

/**
 * Preenche uma linha (fillRef) de 0 a 100% conforme a pessoa rola por um bloco (blocoRef).
 * A linha começa a crescer quando o bloco chega ao meio da tela.
 */
export function useProgressoDeRolagem<A extends HTMLElement, B extends HTMLElement>(
  blocoRef: RefObject<A>,
  fillRef: RefObject<B>,
) {
  useEffect(() => {
    const bloco = blocoRef.current;
    const fill = fillRef.current;
    if (!bloco || !fill) return;

    if (prefereMenosMovimento()) {
      fill.style.transform = 'scaleY(1)';
      return;
    }

    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const r = bloco.getBoundingClientRect();
      const meio = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (meio - r.top) / r.height));
      fill.style.transform = `scaleY(${p.toFixed(3)})`;
    };
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };

    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    atualizar();

    return () => {
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [blocoRef, fillRef]);
}
