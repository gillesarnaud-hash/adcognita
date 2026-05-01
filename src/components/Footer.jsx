import Logo from './Logo';
import { QualiopiBadge } from './Badges';

function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.9px', color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {links.map((l, i) => (
          <button key={i} onClick={l.action}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: 'rgba(255,255,255,0.7)', padding: 0, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >{l.label}</button>
        ))}
      </div>
    </div>
  );
}

export default function Footer({ navigate }) {
  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.75)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 28px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <Logo navigate={navigate} color="white" />
          <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 18, color: 'rgba(255,255,255,0.55)', maxWidth: 280 }}>
            Développez les compétences qui font la différence. Formations professionnelles certifiées Qualiopi pour salariés et entreprises.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <QualiopiBadge />
          </div>
        </div>
        <FooterCol title="Formations" links={[
          { label: 'Management', action: () => navigate('catalogue', { category: 'management' }) },
          { label: 'Bureautique', action: () => navigate('catalogue', { category: 'bureautique' }) },
          { label: 'Ressources Humaines', action: () => navigate('catalogue', { category: 'rh' }) },
          { label: 'Intelligence Artificielle', action: () => navigate('catalogue', { category: 'ia' }) },
          { label: 'Voir tout', action: () => navigate('catalogue') },
        ]} />
        <FooterCol title="À propos" links={[
          { label: 'Qui sommes-nous', action: () => navigate('about') },
          { label: 'Démarche Qualité', action: () => navigate('about') },
          { label: 'Nos valeurs', action: () => navigate('about') },
          { label: 'Contact', action: () => navigate('contact') },
        ]} />
        <FooterCol title="Informations" links={[
          { label: 'Financement CPF', action: () => navigate('catalogue') },
          { label: 'Prise en charge OPCO', action: () => navigate('contact') },
          { label: 'Accessibilité & Handicap', action: () => navigate('contact') },
          { label: 'Mentions légales', action: () => {} },
        ]} />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>© 2025 Ad Cognita — Organisme de formation professionnelle</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>NDA : 11 XX XXXXX XX</span>
      </div>
    </footer>
  );
}
