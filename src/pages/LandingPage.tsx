import { Hero } from '@/sections/Hero';
import { Identification } from '@/sections/Identification';
import { Organizers } from '@/sections/Organizers';
import { Schedule } from '@/sections/Schedule';
import { FinalCTA } from '@/sections/FinalCTA';
import { Details } from '@/sections/Details';
import { FAQ } from '@/sections/FAQ';
import { Footer } from '@/sections/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { CheckoutProvider } from '@/components/CheckoutDialog';
import { AvisoPagamento } from '@/components/AvisoPagamento';
import { FaixaContagem } from '@/components/FaixaContagem';
import { FaixaMomentos } from '@/components/FaixaMomentos';
import { BarraInscricao } from '@/components/BarraInscricao';

/**
 * A tarde é contada em ordem e termina em "A Decisão", onde fica a inscrição.
 * Os detalhes práticos e as dúvidas vêm depois, para quem ainda quer conferir.
 */
export function LandingPage() {
  return (
    <CheckoutProvider>
      <AvisoPagamento />
      <FaixaContagem />
      <Hero />
      <FaixaMomentos />
      <main>
        <Identification />
        <Organizers />
        <Schedule />
        <FinalCTA />
        <Details />
        <FAQ />
      </main>
      <Footer />
      <BarraInscricao />
      <WhatsAppFloat />
    </CheckoutProvider>
  );
}
