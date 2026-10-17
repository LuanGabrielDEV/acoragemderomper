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

export function LandingPage() {
  return (
    <>
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
    </>
  );
}
