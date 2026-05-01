import { useState } from 'react';
import { CATEGORIES } from '../data';
import { ModeBadge, CPFBadge } from './Badges';

export default function FormationCard({ f, navigate }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORIES.find(c => c.id === f.category);
  return (
    <div onClick={() => navigate('detail', { id: f.id })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', background: 'white', border: hovered ? '1.5px solid var(--navy)' : '1.5px solid var(--border)',
        borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 0,
        boxShadow: hovered ? '0 6px 24px oklch(0.22 0.07 255 / 0.12)' : 'var(--shadow)',
        transition: 'all 0.2s', transform: hovered ? 'translateY(-2px)' : 'none'
      }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
        {cat?.label}
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: 10 }}>
        {f.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: 'var(--muted)', fontSize: 12.5 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          {f.duration} jour{f.duration > 1 ? 's' : ''} — {f.hours}h
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {f.modes.includes('presentiel') && <ModeBadge label="Présentiel" />}
        {f.modes.includes('distanciel') && <ModeBadge label="Distanciel" />}
        {f.cpf && <CPFBadge />}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>
          À partir de <span>{f.price.toLocaleString('fr-FR')} €</span> <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)' }}>HT</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: hovered ? 'var(--amber)' : 'var(--navy)', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}>
          Détail
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}
