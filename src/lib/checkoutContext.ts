import { createContext, useContext } from 'react';

export const CheckoutContext = createContext<{ abrir: () => void } | null>(null);

/** Abre a janela de inscrição a partir de qualquer botão da página. */
export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout precisa estar dentro de <CheckoutProvider>');
  return ctx;
}
