import { useEffect, useState } from 'react';
import { LandingPage } from '@/pages/LandingPage';
import { ThankYouPage } from '@/pages/ThankYouPage';
import { PoliticaPage } from '@/pages/PoliticaPage';
import { Analytics } from '@vercel/analytics/react';

function useRoute() {
  const [route, setRoute] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return route;
}

function App() {
  const route = useRoute();
  const caminho = route.trim().toLowerCase().replace(/\/$/, '');

  let pagina = <LandingPage />;
  if (caminho === '/obrigado') pagina = <ThankYouPage />;
  else if (caminho === '/politica') pagina = <PoliticaPage />;

  return (
    <>
      {pagina}
      {/* Estatísticas de visitas da Vercel (Web Analytics) */}
      <Analytics />
    </>
  );
}

export default App;
