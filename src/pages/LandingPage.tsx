import { Hero } from '@/sections/Hero';
import { Identification } from '@/sections/Identification';
import { Experience } from '@/sections/Experience';
import { Organizers } from '@/sections/Organizers';
import { Schedule } from '@/sections/Schedule';
import { Details } from '@/sections/Details';
import { FAQ } from '@/sections/FAQ';
import { FinalCTA } from '@/sections/FinalCTA';
import { Footer } from '@/sections/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { CheckoutProvider } from '@/components/CheckoutDialog';
import { AvisoPagamento } from '@/components/AvisoPagamento';

export function LandingPage() {
  return (
    <CheckoutProvider>
      <AvisoPagamento />
      <Hero />
      <Identification />
      <Experience />
      <Organizers />
      <Schedule />
      <Details />
      <FAQ />
      <FinalCTA />
      <Footer />
      <WhatsAppFloat />
    </CheckoutProvider>
  );
}
