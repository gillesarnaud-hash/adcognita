import { useState, useEffect } from 'react';
import { CATEGORIES, FORMATIONS } from '../data';
import FormationCard from '../components/FormationCard';

function FilterItem({ label, count, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ background: active ? 'var(--navy)' : 'transparent', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.15s', textAlign: 'left', width: '100%' }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-alt)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'white' : 'var(--text)' }}>{label}</span>
      {count !== null && (
        <span style={{ fontSize: 11.5, color: active ? 'rgba(255,255,255,0.6)' : 'var(--muted)', background: active ? 'rgba(255,255,255,0.15)' : 'var(--bg-alt)', padding: '1px 7px', borderRadius: 20 }}>{count}</span>
      )}
    </button>
  );
}

export default function CataloguePage({ navigate, params }) {
  const initCat = params?.category || '';
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(initCat);
  const [modeFilter, setModeFilter] = useState('');
  const [cpfOnly, setCpfOnly] = useState(false);
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    if (params?.category !== undefined) setSelectedCat(params.category);
  }, [params?.category]);

  const filtered = FORMATIONS
    .filter(f => {
      if (selectedCat && f.category !== selectedCat) return false;
      if (modeFilter && !f.modes.includes(modeFilter)) return false;
      if (cpfOnly && !f.cpf) return false;
      if (search) {
        const q = search.toLowerCase();
        return f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) ||
          CATEGORIES.find(c => c.id === f.category)?.label.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'duration') return a.hours - b.hours;
      return a.title.localeCompare(b.title);
    });

  const activeCat = CATEGORIES.find(c => c.id === selectedCat);

  return (
    <div style={{ background: 'var(--bg-alt)', minHeight: '80vh' }}>
      {/* Banner */}
      <div style={{ background: 'var(--navy)', padding: '40px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('home')}>Accueil</span>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Catalogue</span>
            {activeCat && <><span style={{ margin: '0 8px' }}>›</span><span style={{ color: 'white' }}>{activeCat.label}</span></>}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', margin: '0 0 10px', letterSpacing: '-0.6px' }}>
            {activeCat ? activeCat.label : 'Catalogue des formations'}
          </h1>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            {activeCat ? activeCat.desc : `${FORMATIONS.length} formations professionnelles certifiées Qualiopi — financement CPF et OPCO possible.`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 60px', display: 'grid', gridTemplateColumns: '256px 1fr', gap: 28, alignItems: 'start' }}>
        {/* Sidebar filtres */}
        <aside>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Filtres
              {(selectedCat || modeFilter || cpfOnly || search) && (
                <button onClick={() => { setSelectedCat(''); setModeFilter(''); setCpfOnly(false); setSearch(''); }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11.5, color: 'var(--amber)', fontWeight: 600, padding: 0 }}>
                  Réinitialiser
                </button>
              )}
            </div>

            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>Recherche</div>
              <div style={{ position: 'relative' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Mot-clé..."
                  style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1.5px solid var(--border)', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: 'var(--text)' }} />
              </div>
            </div>

            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>Domaine</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <FilterItem label="Tous les domaines" count={FORMATIONS.length} active={selectedCat === ''} onClick={() => setSelectedCat('')} />
                {CATEGORIES.map(cat => (
                  <FilterItem key={cat.id} label={cat.label} count={FORMATIONS.filter(f => f.category === cat.id).length} active={selectedCat === cat.id} onClick={() => setSelectedCat(cat.id)} />
                ))}
              </div>
            </div>

            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>Modalité</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <FilterItem label="Toutes" count={null} active={modeFilter === ''} onClick={() => setModeFilter('')} />
                <FilterItem label="Présentiel" count={FORMATIONS.filter(f => f.modes.includes('presentiel')).length} active={modeFilter === 'presentiel'} onClick={() => setModeFilter('presentiel')} />
                <FilterItem label="Distanciel" count={FORMATIONS.filter(f => f.modes.includes('distanciel')).length} active={modeFilter === 'distanciel'} onClick={() => setModeFilter('distanciel')} />
              </div>
            </div>

            <div style={{ padding: '14px 18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={cpfOnly} onChange={e => setCpfOnly(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--navy)', cursor: 'pointer' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Éligibles CPF uniquement</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{FORMATIONS.filter(f => f.cpf).length} formations</div>
                </div>
              </label>
            </div>
          </div>

          <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 18px', marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 8 }}>Besoin de conseils ?</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, marginBottom: 16 }}>Notre équipe vous aide à trouver la formation adaptée à votre projet.</div>
            <button onClick={() => navigate('contact')}
              style={{ width: '100%', background: 'var(--amber)', color: 'var(--navy)', padding: '10px', borderRadius: 7, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
              Nous contacter
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> formation{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Trier par</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding: '6px 10px', border: '1.5px solid var(--border)', borderRadius: 7, fontSize: 12.5, color: 'var(--text)', outline: 'none', background: 'white' }}>
                <option value="title">Titre A–Z</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="duration">Durée croissante</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Aucune formation trouvée</div>
              <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>Essayez de modifier vos filtres</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {filtered.map(f => <FormationCard key={f.id} f={f} navigate={navigate} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
