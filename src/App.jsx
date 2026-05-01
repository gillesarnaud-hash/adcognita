import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { TweaksPanel, TweakSection, TweakColor, TweakSelect, TweakButton, useTweaks } from './components/TweaksPanel';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import DetailPage from './pages/DetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const TWEAK_DEFAULTS = {
  primaryColor: 'oklch(0.22 0.12 148)',
  accentColor: 'oklch(0.74 0.15 82)',
  fontFamily: 'Plus Jakarta Sans',
};

export default function App() {
  const [page, setPage] = useState('home');
  const [params, setParams] = useState({});
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--navy', tweaks.primaryColor);
    document.documentElement.style.setProperty('--amber', tweaks.accentColor);
    document.body.style.fontFamily = `'${tweaks.fontFamily}', sans-serif`;
  }, [tweaks.primaryColor, tweaks.accentColor, tweaks.fontFamily]);

  const navigate = (p, par = {}) => {
    setPage(p);
    setParams(par);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'home':      return <HomePage navigate={navigate} tweaks={tweaks} />;
      case 'catalogue': return <CataloguePage navigate={navigate} params={params} />;
      case 'detail':    return <DetailPage navigate={navigate} params={params} />;
      case 'about':     return <AboutPage navigate={navigate} />;
      case 'contact':   return <ContactPage navigate={navigate} />;
      default:          return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar navigate={navigate} currentPage={page} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <Footer navigate={navigate} />

      <TweaksPanel title="Tweaks — Ad Cognita">
        <TweakSection title="Couleurs">
          <TweakColor label="Couleur principale (navy)" value={tweaks.primaryColor} onChange={v => setTweak('primaryColor', v)} />
          <TweakColor label="Couleur accent (amber)" value={tweaks.accentColor} onChange={v => setTweak('accentColor', v)} />
        </TweakSection>
        <TweakSection title="Typographie">
          <TweakSelect label="Police" value={tweaks.fontFamily}
            options={[
              { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
              { value: 'Inter', label: 'Inter' },
              { value: 'DM Sans', label: 'DM Sans' },
              { value: 'Sora', label: 'Sora' },
            ]}
            onChange={v => setTweak('fontFamily', v)}
          />
        </TweakSection>
        <TweakSection title="Navigation">
          <TweakButton label="Accueil" onClick={() => navigate('home')} />
          <TweakButton label="Catalogue" onClick={() => navigate('catalogue')} />
          <TweakButton label="À propos" onClick={() => navigate('about')} />
          <TweakButton label="Contact" onClick={() => navigate('contact')} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}
