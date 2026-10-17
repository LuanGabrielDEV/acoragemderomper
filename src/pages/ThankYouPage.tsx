import { CheckCircle2, ArrowLeft, Mail } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';
import { CTAButton } from '@/components/CTAButton';

export function ThankYouPage() {
  return (
    <main className="min-h-[100svh] flex items-center justify-center bg-cream bg-grain px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-olive/15 text-olive-dark animate-float-slow">
          <CheckCircle2 size={44} strokeWidth={1.5} />
        </div>

        <h1 className="mt-8 font-serif text-4xl sm:text-5xl text-coffee text-balance">
          Sua vaga está garantida!
        </h1>

        <p className="mt-5 text-lg text-coffee-soft leading-relaxed">
          Você receberá o comprovante por e-mail. Para receber o endereço completo
          e as orientações do encontro, fale conosco no WhatsApp.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <CTAButton
            href={eventConfig.whatsappThankYou}
            external
            variant="olive"
            className="text-lg px-9 py-5"
          >
            Falar no WhatsApp
          </CTAButton>

          <div className="mt-2 inline-flex items-center gap-2 text-sm text-coffee-soft">
            <Mail size={16} /> Confira também a sua caixa de entrada (e o spam).
          </div>
        </div>

        <a
          href="/"
          className="mt-12 inline-flex items-center gap-2 text-sm text-coffee-soft hover:text-terracota transition-colors"
        >
          <ArrowLeft size={16} /> Voltar para a página do evento
        </a>
      </div>
    </main>
  );
}
