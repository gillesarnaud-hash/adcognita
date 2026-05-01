import { useState } from 'react';

const CAT_ICONS = {
  management: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="11" y="2" width="6" height="6" rx="3" fill="currentColor" />
      <rect x="2" y="18" width="7" height="7" rx="3.5" fill="currentColor" opacity="0.7" />
      <rect x="19" y="18" width="7" height="7" rx="3.5" fill="currentColor" opacity="0.7" />
      <path d="M14 8v5M14 13l-7 5M14 13l7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  bureautique: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="5" width="22" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h22" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="14" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="12" y="14" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="17" y="14" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
    </svg>
  ),
  rh: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="10" cy="9" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 22c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" opacity="0.5" />
      <path d="M24 21c0-2.76-1.79-5.11-4.27-5.87" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  ia: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 3v4M14 21v4M3 14h4M21 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      <circle cx="14" cy="14" r="2" fill="currentColor" />
    </svg>
  ),
  marketing: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M4 18V12l6-4 6 4 6-8v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 22h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  droit: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4v20M14 4l-8 5M14 4l8 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="8" cy="13" rx="4" ry="1.5" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="20" cy="13" rx="4" ry="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  entrepreneuriat: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3l2.5 5.5 6 .9-4.3 4.2 1 6-5.2-2.7-5.2 2.7 1-6L5.5 9.4l6-.9L14 3z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

export default function CategoryCard({ cat, navigate, count }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => navigate('catalogue', { category: cat.id })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', background: hovered ? 'var(--navy)' : 'white',
        border: hovered ? '1.5px solid var(--navy)' : '1.5px solid var(--border)',
        borderRadius: 12, padding: '22px 20px', transition: 'all 0.2s',
        boxShadow: hovered ? '0 8px 28px oklch(0.22 0.07 255 / 0.18)' : 'var(--shadow)'
      }}>
      <div style={{ color: hovered ? 'var(--amber)' : 'var(--navy)', marginBottom: 14, transition: 'color 0.2s' }}>
        {CAT_ICONS[cat.id]}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: hovered ? 'white' : 'var(--text)', marginBottom: 6, transition: 'color 0.2s' }}>{cat.label}</div>
      <div style={{ fontSize: 12.5, color: hovered ? 'rgba(255,255,255,0.65)' : 'var(--muted)', lineHeight: 1.45, marginBottom: 14, transition: 'color 0.2s' }}>{cat.shortDesc}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: hovered ? 'var(--amber)' : 'var(--navy)', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}>
        {count} formation{count > 1 ? 's' : ''}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}
