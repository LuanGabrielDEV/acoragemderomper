import { useEffect, useState } from 'react';
import { LandingPage } from '@/pages/LandingPage';
import { ThankYouPage } from '@/pages/ThankYouPage';

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
  const isThankYou = route.trim().toLowerCase().replace(/\/$/, '') === '/obrigado';

  return isThankYou ? <ThankYouPage /> : <LandingPage />;
}

export default App;
