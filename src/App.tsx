import { useEffect, useState } from 'react';
import { LandingPage } from '@/pages/LandingPage';
import { ThankYouPage } from '@/pages/ThankYouPage';
import { PoliticaPage } from '@/pages/PoliticaPage';

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

  if (caminho === '/obrigado') return <ThankYouPage />;
  if (caminho === '/politica') return <PoliticaPage />;
  return <LandingPage />;
}

export default App;
