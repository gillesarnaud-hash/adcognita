import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { CATEGORIES, FORMATIONS } from '../data';

export default function NavBar({ navigate, currentPage }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLink = (label, page, onClick) => {
    const active = currentPage === page;
    return (
      <button onClick={onClick || (() => navigate(page))}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: active ? 600 : 500,
          color: active ? 'var(--amber)' : 'var(--text)', padding: '6px 12px', borderRadius: 6,
          transition: 'background 0.15s, color 0.15s'
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-alt)'; }}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >{label}</button>
    );
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white',
      borderBottom: '1px solid var(--border)',
      boxShadow: scrolled ? '0 2px 16px oklch(0.22 0.07 255 / 0.07)' : 'none',
      transition: 'box-shadow 0.25s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Logo navigate={navigate} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 28, flex: 1 }}>
          <div ref={megaRef} style={{ position: 'relative' }}>
            <button onClick={() => setMegaOpen(v => !v)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: currentPage === 'catalogue' ? 600 : 500,
                color: currentPage === 'catalogue' ? 'var(--amber)' : 'var(--text)', padding: '6px 12px', borderRadius: 6,
                display: 'flex', alignItems: 'center', gap: 5, transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-alt)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Nos formations
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ transform: megaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="M2 3.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {megaOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: '-16px',
                background: 'white', border: '1px solid var(--border)', borderRadius: 14,
                boxShadow: '0 12px 40px oklch(0.22 0.07 255 / 0.14)', padding: 20, width: 600, zIndex: 200 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  Domaines de formation
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id}
                      onClick={() => { navigate('catalogue', { category: cat.id }); setMegaOpen(false); }}
                      style={{ textAlign: 'left', background: 'transparent', border: 'none', padding: '9px 11px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-alt)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{cat.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{cat.shortDesc}</div>
                    </button>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{FORMATIONS.length} formations disponibles</span>
                  <button onClick={() => { navigate('catalogue'); setMegaOpen(false); }}
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    Voir tout le catalogue →
                  </button>
                </div>
              </div>
            )}
          </div>

          {navLink('À propos', 'about')}
          {navLink('Contact', 'contact')}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('catalogue')}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 7,
              border: '1.5px solid var(--border)', fontSize: 12.5, color: 'var(--muted)', background: 'transparent', cursor: 'pointer',
              transition: 'border-color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--navy)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Rechercher
          </button>
          <button onClick={() => navigate('contact')}
            style={{ background: 'var(--navy)', color: 'white', padding: '8px 18px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-mid)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}
          >
            Demander un devis
          </button>
        </div>
      </div>
    </nav>
  );
}
