import { useState } from 'react';
import { CATEGORIES, FORMATIONS } from '../data';
import { ModeBadge, CPFBadge, QualiopiBadge } from '../components/Badges';
import FormationCard from '../components/FormationCard';

function InfoBlock({ title, content }) {
  return (
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.65 }}>{content}</div>
    </div>
  );
}

export default function DetailPage({ navigate, params }) {
  const f = FORMATIONS.find(x => x.id === params?.id) || FORMATIONS[0];
  const cat = CATEGORIES.find(c => c.id === f.category);
  const related = FORMATIONS.filter(x => x.category === f.category && x.id !== f.id).slice(0, 3);
  const [activeTab, setActiveTab] = useState('programme');

  return (
    <div style={{ background: 'var(--bg-alt)', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '36px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('home')}>Accueil</span>
            <span>›</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('catalogue')}>Catalogue</span>
            <span>›</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('catalogue', { category: f.category })}>{cat?.label}</span>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>{f.title}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>{cat?.label} — {f.subcategory}</div>
              <h1 style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 800, color: 'white', margin: '0 0 14px', letterSpacing: '-0.6px' }}>{f.title}</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 620 }}>{f.description}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {f.modes.includes('presentiel') && <ModeBadge label="Présentiel" />}
                {f.modes.includes('distanciel') && <ModeBadge label="Distanciel" />}
                {f.cpf && <CPFBadge />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 60px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' }}>
        {/* Main */}
        <div>
          {/* Key info strip */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', display: 'flex', gap: 0, marginBottom: 24 }}>
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>, label: 'Durée', val: `${f.duration} jour${f.duration > 1 ? 's' : ''} (${f.hours}h)` },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, label: 'Participants', val: '4 à 12 personnes' },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.88 12 19.79 19.79 0 0 1 1.85 3.4 2 2 0 0 1 3.83 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.99-.99a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>, label: 'Modalité', val: f.modes.map(m => m === 'presentiel' ? 'Présentiel' : 'Distanciel').join(' / ') },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, label: 'Tarif', val: `À partir de ${f.price.toLocaleString('fr-FR')} € HT` },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, padding: '0 20px', borderRight: i < 3 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {[
                { id: 'programme', label: 'Programme' },
                { id: 'objectifs', label: 'Objectifs' },
                { id: 'public', label: 'Public & prérequis' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ flex: 1, padding: '14px 20px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? 'var(--navy)' : 'var(--muted)', borderBottom: activeTab === tab.id ? '2.5px solid var(--navy)' : '2.5px solid transparent', transition: 'all 0.15s', marginBottom: '-1px' }}
                >{tab.label}</button>
              ))}
            </div>

            <div style={{ padding: '24px 28px' }}>
              {activeTab === 'programme' && (
                <div>
                  <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 20 }}>
                    Ce programme est donné à titre indicatif et peut être adapté selon le profil et les besoins des participants.
                  </div>
                  {f.program.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                      <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, paddingTop: 4 }}>{step}</div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'objectifs' && (
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>À l'issue de cette formation, vous serez capable de :</div>
                  {f.objectives.map((obj, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'oklch(0.93 0.08 145)', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5 4.5-4" stroke="oklch(0.35 0.12 145)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{obj}</div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'public' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <InfoBlock title="Public visé" content="Tout professionnel souhaitant développer ses compétences dans ce domaine. Aucune expérience préalable requise sauf mention contraire." />
                  <InfoBlock title="Prérequis" content="Aucun prérequis particulier. Une expérience professionnelle préalable est conseillée pour mieux assimiler les contenus." />
                  <InfoBlock title="Méthodes pédagogiques" content="Alternance d'apports théoriques, d'études de cas concrets et de mises en situation. Supports pédagogiques remis en fin de formation." />
                  <InfoBlock title="Évaluation" content="Évaluation des acquis en cours et en fin de formation. Attestation de formation délivrée à l'issue." />
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Dans le même domaine</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {related.map(r => <FormationCard key={r.id} f={r} navigate={navigate} />)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 20px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)', marginBottom: 4, letterSpacing: '-0.4px' }}>
              {f.price.toLocaleString('fr-FR')} €
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginLeft: 4 }}>HT / personne</span>
            </div>
            {f.cpf && (
              <div style={{ background: 'oklch(0.93 0.08 145)', border: '1px solid oklch(0.82 0.1 145)', borderRadius: 7, padding: '8px 12px', marginBottom: 16, marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="oklch(0.35 0.12 145)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'oklch(0.35 0.12 145)' }}>Financement CPF possible</span>
              </div>
            )}
            <button onClick={() => navigate('contact')}
              style={{ width: '100%', background: 'var(--navy)', color: 'white', padding: '13px', borderRadius: 9, fontWeight: 700, fontSize: 14.5, border: 'none', cursor: 'pointer', marginBottom: 10, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-mid)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}
            >
              S'inscrire à cette formation
            </button>
            <button onClick={() => navigate('contact')}
              style={{ width: '100%', background: 'transparent', color: 'var(--navy)', padding: '11px', borderRadius: 9, fontWeight: 600, fontSize: 14, border: '1.5px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--navy)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              Demander un devis intra
            </button>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
              Réponse sous 24h · Accompagnement personnalisé
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Informations pratiques</div>
            {[
              { label: 'Durée', val: `${f.duration} jour${f.duration > 1 ? 's' : ''} — ${f.hours}h` },
              { label: 'Effectif', val: '4 à 12 personnes' },
              { label: 'Format', val: f.modes.map(m => m === 'presentiel' ? 'Présentiel' : 'Distanciel').join(' / ') },
              { label: 'Langue', val: 'Français' },
              { label: 'Attestation', val: 'Oui, en fin de formation' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', gap: 10 }}>
                <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{item.label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{item.val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--navy)', borderRadius: 12, padding: '18px 20px' }}>
            <QualiopiBadge />
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 12, lineHeight: 1.55 }}>
              Cette formation est dispensée par un organisme certifié Qualiopi — financement OPCO et CPF possible.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
