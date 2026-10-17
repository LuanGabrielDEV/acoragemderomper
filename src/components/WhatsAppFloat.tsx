import { MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';

export function WhatsAppFloat() {
  return (
    <a
      href={eventConfig.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-olive text-cream shadow-soft-lg transition-all duration-300 hover:scale-110 hover:bg-olive-dark sm:bottom-7 sm:right-7"
    >
      <MessageCircle size={26} strokeWidth={1.8} />
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="absolute h-full w-full animate-ping rounded-full bg-terracota/60" />
        <span className="relative h-3.5 w-3.5 rounded-full bg-terracota" />
      </span>
    </a>
  );
}
