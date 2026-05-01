const { useState, useEffect, useRef } = React;

// ── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ navigate, color }) {
  return (
    <div onClick={() => navigate('home')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:36, height:36, borderRadius:9, background: color === 'white' ? 'rgba(255,255,255,0.15)' : 'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="8" r="4" fill={color === 'white' ? 'white' : 'var(--amber)'} />
          <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={color === 'white' ? 'white' : 'white'} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <div style={{ fontWeight:800, fontSize:15, letterSpacing:'-0.4px', color: color === 'white' ? 'white' : 'var(--navy)', lineHeight:1.1 }}>Ad Cognita</div>
        <div style={{ fontSize:9.5, color: color === 'white' ? 'rgba(255,255,255,0.6)' : 'var(--muted)', letterSpacing:'1px', textTransform:'uppercase', marginTop:1 }}>Organisme de formation</div>
      </div>
    </div>
  );
}

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar({ navigate, currentPage }) {
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
        style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:13.5, fontWeight: active ? 600 : 500,
          color: active ? 'var(--amber)' : 'var(--text)', padding:'6px 12px', borderRadius:6,
          transition:'background 0.15s, color 0.15s'
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-alt)'; }}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >{label}</button>
    );
  };

  return (
    <nav style={{ position:'sticky', top:0, zIndex:100, background:'white',
      borderBottom:'1px solid var(--border)',
      boxShadow: scrolled ? '0 2px 16px oklch(0.22 0.07 255 / 0.07)' : 'none',
      transition:'box-shadow 0.25s' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px', height:64, display:'flex', alignItems:'center', gap:8 }}>
        <Logo navigate={navigate} />

        <div style={{ display:'flex', alignItems:'center', gap:2, marginLeft:28, flex:1 }}>
          {/* Mega-menu trigger */}
          <div ref={megaRef} style={{ position:'relative' }}>
            <button onClick={() => setMegaOpen(v => !v)}
              style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:13.5, fontWeight: currentPage==='catalogue'?600:500,
                color: currentPage==='catalogue' ? 'var(--amber)' : 'var(--text)', padding:'6px 12px', borderRadius:6,
                display:'flex', alignItems:'center', gap:5, transition:'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-alt)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Nos formations
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ transform: megaOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>
                <path d="M2 3.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {megaOpen && (
              <div style={{ position:'absolute', top:'calc(100% + 6px)', left:'-16px',
                background:'white', border:'1px solid var(--border)', borderRadius:14,
                boxShadow:'0 12px 40px oklch(0.22 0.07 255 / 0.14)', padding:20, width:600, zIndex:200 }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:12, paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
                  Domaines de formation
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:3 }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id}
                      onClick={() => { navigate('catalogue', { category: cat.id }); setMegaOpen(false); }}
                      style={{ textAlign:'left', background:'transparent', border:'none', padding:'9px 11px', borderRadius:8, cursor:'pointer', transition:'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-alt)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{cat.label}</div>
                      <div style={{ fontSize:11.5, color:'var(--muted)', marginTop:2 }}>{cat.shortDesc}</div>
                    </button>
                  ))}
                </div>
                <div style={{ borderTop:'1px solid var(--border)', marginTop:12, paddingTop:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'var(--muted)' }}>{FORMATIONS.length} formations disponibles</span>
                  <button onClick={() => { navigate('catalogue'); setMegaOpen(false); }}
                    style={{ fontSize:13, fontWeight:600, color:'var(--amber)', background:'transparent', border:'none', cursor:'pointer' }}>
                    Voir tout le catalogue →
                  </button>
                </div>
              </div>
            )}
          </div>

          {navLink('À propos', 'about')}
          {navLink('Contact', 'contact')}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={() => navigate('catalogue')}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 13px', borderRadius:7,
              border:'1.5px solid var(--border)', fontSize:12.5, color:'var(--muted)', background:'transparent', cursor:'pointer',
              transition:'border-color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--navy)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Rechercher
          </button>
          <button onClick={() => navigate('contact')}
            style={{ background:'var(--navy)', color:'white', padding:'8px 18px', borderRadius:8,
              fontSize:13, fontWeight:600, border:'none', cursor:'pointer', whiteSpace:'nowrap',
              transition:'background 0.15s'
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

// ── CategoryCard ─────────────────────────────────────────────────────────────
const CAT_ICONS = {
  management: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="11" y="2" width="6" height="6" rx="3" fill="currentColor"/>
      <rect x="2" y="18" width="7" height="7" rx="3.5" fill="currentColor" opacity="0.7"/>
      <rect x="19" y="18" width="7" height="7" rx="3.5" fill="currentColor" opacity="0.7"/>
      <path d="M14 8v5M14 13l-7 5M14 13l7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  bureautique: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="5" width="22" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 10h22" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="7" y="14" width="4" height="3" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="12" y="14" width="4" height="3" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="17" y="14" width="4" height="3" rx="1" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  rh: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="10" cy="9" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 22c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="20" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" opacity="0.5"/>
      <path d="M24 21c0-2.76-1.79-5.11-4.27-5.87" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  ia: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14 3v4M14 21v4M3 14h4M21 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6"/>
      <circle cx="14" cy="14" r="2" fill="currentColor"/>
    </svg>
  ),
  marketing: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M4 18V12l6-4 6 4 6-8v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 22h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  droit: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4v20M14 4l-8 5M14 4l8 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="8" cy="13" rx="4" ry="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <ellipse cx="20" cy="13" rx="4" ry="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  entrepreneuriat: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3l2.5 5.5 6 .9-4.3 4.2 1 6-5.2-2.7-5.2 2.7 1-6L5.5 9.4l6-.9L14 3z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

function CategoryCard({ cat, navigate, count }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => navigate('catalogue', { category: cat.id })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor:'pointer', background: hovered ? 'var(--navy)' : 'white',
        border: hovered ? '1.5px solid var(--navy)' : '1.5px solid var(--border)',
        borderRadius:12, padding:'22px 20px', transition:'all 0.2s',
        boxShadow: hovered ? '0 8px 28px oklch(0.22 0.07 255 / 0.18)' : 'var(--shadow)'
      }}>
      <div style={{ color: hovered ? 'var(--amber)' : 'var(--navy)', marginBottom:14, transition:'color 0.2s' }}>
        {CAT_ICONS[cat.id]}
      </div>
      <div style={{ fontSize:15, fontWeight:700, color: hovered ? 'white' : 'var(--text)', marginBottom:6, transition:'color 0.2s' }}>{cat.label}</div>
      <div style={{ fontSize:12.5, color: hovered ? 'rgba(255,255,255,0.65)' : 'var(--muted)', lineHeight:1.45, marginBottom:14, transition:'color 0.2s' }}>{cat.shortDesc}</div>
      <div style={{ fontSize:12, fontWeight:600, color: hovered ? 'var(--amber)' : 'var(--navy)', display:'flex', alignItems:'center', gap:4, transition:'color 0.2s' }}>
        {count} formation{count > 1 ? 's' : ''}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}

// ── FormationCard ─────────────────────────────────────────────────────────────
function FormationCard({ f, navigate }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORIES.find(c => c.id === f.category);
  return (
    <div onClick={() => navigate('detail', { id: f.id })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor:'pointer', background:'white', border: hovered ? '1.5px solid var(--navy)' : '1.5px solid var(--border)',
        borderRadius:12, padding:'20px', display:'flex', flexDirection:'column', gap:0,
        boxShadow: hovered ? '0 6px 24px oklch(0.22 0.07 255 / 0.12)' : 'var(--shadow)',
        transition:'all 0.2s', transform: hovered ? 'translateY(-2px)' : 'none'
      }}>
      <div style={{ fontSize:11, fontWeight:600, color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:8 }}>
        {cat?.label}
      </div>
      <div style={{ fontSize:14.5, fontWeight:700, color:'var(--text)', lineHeight:1.4, marginBottom:10, textWrap:'pretty' }}>
        {f.title}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, color:'var(--muted)', fontSize:12.5 }}>
        <span style={{ display:'flex', alignItems:'center', gap:4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          {f.duration} jour{f.duration > 1 ? 's' : ''} — {f.hours}h
        </span>
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
        {f.modes.includes('presentiel') && <ModeBadge label="Présentiel" />}
        {f.modes.includes('distanciel') && <ModeBadge label="Distanciel" />}
        {f.cpf && <CPFBadge />}
      </div>
      <div style={{ marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)' }}>
          À partir de <span>{f.price.toLocaleString('fr-FR')} €</span> <span style={{ fontSize:11, fontWeight:500, color:'var(--muted)' }}>HT</span>
        </div>
        <div style={{ fontSize:12, fontWeight:600, color: hovered ? 'var(--amber)' : 'var(--navy)', display:'flex', alignItems:'center', gap:4, transition:'color 0.2s' }}>
          Détail
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </div>
  );
}

// ── Badges ────────────────────────────────────────────────────────────────────
function ModeBadge({ label }) {
  return (
    <span style={{ fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:5,
      background:'var(--bg-alt)', color:'var(--muted)', border:'1px solid var(--border)', whiteSpace:'nowrap' }}>
      {label}
    </span>
  );
}

function CPFBadge() {
  return (
    <span style={{ fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:5,
      background:'oklch(0.93 0.08 145)', color:'oklch(0.35 0.12 145)', border:'1px solid oklch(0.82 0.1 145)', whiteSpace:'nowrap' }}>
      CPF
    </span>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ navigate }) {
  return (
    <footer style={{ background:'var(--navy)', color:'rgba(255,255,255,0.75)', marginTop:'auto' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'56px 28px 32px', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40 }}>
        <div>
          <Logo navigate={navigate} color="white" />
          <p style={{ fontSize:13, lineHeight:1.7, marginTop:18, color:'rgba(255,255,255,0.55)', maxWidth:280 }}>
            Développez les compétences qui font la différence. Formations professionnelles certifiées Qualiopi pour salariés et entreprises.
          </p>
          <div style={{ display:'flex', gap:12, marginTop:20 }}>
            <QualiopiBadge />
          </div>
        </div>
        <FooterCol title="Formations" links={[
          { label:'Management', action: () => navigate('catalogue', { category:'management' }) },
          { label:'Bureautique', action: () => navigate('catalogue', { category:'bureautique' }) },
          { label:'Ressources Humaines', action: () => navigate('catalogue', { category:'rh' }) },
          { label:'Intelligence Artificielle', action: () => navigate('catalogue', { category:'ia' }) },
          { label:'Voir tout', action: () => navigate('catalogue') },
        ]} />
        <FooterCol title="À propos" links={[
          { label:'Qui sommes-nous', action: () => navigate('about') },
          { label:'Démarche Qualité', action: () => navigate('about') },
          { label:'Nos valeurs', action: () => navigate('about') },
          { label:'Contact', action: () => navigate('contact') },
        ]} />
        <FooterCol title="Informations" links={[
          { label:'Financement CPF', action: () => navigate('catalogue') },
          { label:"Prise en charge OPCO", action: () => navigate('contact') },
          { label:'Accessibilité & Handicap', action: () => navigate('contact') },
          { label:'Mentions légales', action: () => {} },
        ]} />
      </div>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'20px 28px', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>© 2025 Ad Cognita — Organisme de formation professionnelle</span>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>NDA : 11 XX XXXXX XX</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{ fontSize:11.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.9px', color:'rgba(255,255,255,0.45)', marginBottom:16 }}>{title}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {links.map((l, i) => (
          <button key={i} onClick={l.action}
            style={{ background:'transparent', border:'none', cursor:'pointer', textAlign:'left', fontSize:13, color:'rgba(255,255,255,0.7)', padding:0, transition:'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >{l.label}</button>
        ))}
      </div>
    </div>
  );
}

function QualiopiBadge() {
  return (
    <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--amber)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div>
        <div style={{ fontSize:11.5, fontWeight:700, color:'white' }}>Certifié Qualiopi</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>Actions de formation</div>
      </div>
    </div>
  );
}

Object.assign(window, { Logo, NavBar, CategoryCard, FormationCard, ModeBadge, CPFBadge, Footer, QualiopiBadge });
