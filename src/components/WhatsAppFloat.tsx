import { MessageCircle } from 'lucide-react';
import { eventConfig } from '@/data/eventConfig';

export function WhatsAppFloat() {
  return (
    <a
      href={eventConfig.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-olive-dark text-cream shadow-soft-lg transition-colors duration-200 ease-out hover:bg-coffee sm:bottom-7 sm:right-7"
    >
      <MessageCircle size={26} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}
