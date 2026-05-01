import { CATEGORIES, FORMATIONS } from '../data';
import CategoryCard from '../components/CategoryCard';
import FormationCard from '../components/FormationCard';
import SectionHeader from '../components/SectionHeader';

export default function HomePage({ navigate }) {
  const popular = FORMATIONS.filter(f => f.popular);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, oklch(0.28 0.12 255) 60%, oklch(0.24 0.1 265) 100%)',
        padding: '80px 28px 90px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -80, right: -60, width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '40%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.025)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '6px 14px', marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)' }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.3px' }}>Organisme certifié Qualiopi</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.18, margin: '0 0 22px', letterSpacing: '-1.2px' }}>
              Développez les compétences<br />
              <span style={{ color: 'var(--amber)' }}>qui font la différence</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.68)', lineHeight: 1.65, marginBottom: 36, maxWidth: 540 }}>
              Ad Cognita accompagne salariés et entreprises avec des formations professionnelles sur mesure — en présentiel ou à distance, éligibles CPF.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('catalogue')}
                style={{ background: 'var(--amber)', color: 'var(--navy)', padding: '13px 28px', borderRadius: 9, fontWeight: 700, fontSize: 14.5, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px oklch(0.7 0.18 65 / 0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.82 0.18 65)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--amber)'; e.currentTarget.style.transform = 'none'; }}
              >
                Explorer le catalogue
              </button>
              <button onClick={() => navigate('contact')}
                style={{ background: 'transparent', color: 'white', padding: '13px 28px', borderRadius: 9, fontWeight: 600, fontSize: 14.5, border: '2px solid rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'}
              >
                Demander un devis
              </button>
            </div>

            <div style={{ display: 'flex', gap: 28, marginTop: 44, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { val: FORMATIONS.length + '+', label: 'formations disponibles' },
                { val: '100%', label: 'certifié Qualiopi' },
                { val: 'CPF', label: 'éligible' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>{s.val}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero search card */}
          <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: '32px 28px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 20 }}>Trouvez votre formation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input placeholder="Mot-clé, titre..." style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 8, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)', color: 'white', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <select style={{ padding: '11px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)', fontSize: 13.5, outline: 'none' }}>
                <option value="">Tous les domaines</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <select style={{ padding: '11px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)', fontSize: 13.5, outline: 'none' }}>
                <option value="">Présentiel ou distanciel</option>
                <option>Présentiel</option>
                <option>Distanciel</option>
              </select>
              <button onClick={() => navigate('catalogue')}
                style={{ background: 'var(--amber)', color: 'var(--navy)', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', marginTop: 4, transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'oklch(0.82 0.18 65)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--amber)'}
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {[
            { val: '7', label: 'Domaines de formation' },
            { val: FORMATIONS.length + '+', label: 'Formations au catalogue' },
            { val: '95%', label: 'Taux de satisfaction' },
            { val: '2 ans', label: 'Durée de certification Qualiopi' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '28px 24px', borderRight: i < 3 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.6px' }}>{s.val}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories */}
      <section style={{ padding: '72px 28px', background: 'var(--bg-alt)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            tag="Nos domaines"
            title="Des formations pour chaque métier"
            sub="Trouvez la formation adaptée à vos besoins parmi nos 7 domaines d'expertise."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 40 }}>
            {CATEGORIES.map(cat => (
              <CategoryCard key={cat.id} cat={cat} navigate={navigate}
                count={FORMATIONS.filter(f => f.category === cat.id).length} />
            ))}
          </div>
        </div>
      </section>

      {/* Formations populaires */}
      <section style={{ padding: '72px 28px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <SectionHeader
              tag="Coups de cœur"
              title="Formations les plus demandées"
            />
            <button onClick={() => navigate('catalogue')}
              style={{ background: 'transparent', border: '1.5px solid var(--border)', color: 'var(--text)', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s', marginBottom: 4 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.color = 'var(--navy)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
            >
              Voir tout le catalogue →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {popular.slice(0, 6).map(f => <FormationCard key={f.id} f={f} navigate={navigate} />)}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section style={{ padding: '72px 28px', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader tag="Pourquoi Ad Cognita" title="La qualité au cœur de notre démarche" sub="Une certification, des formateurs experts, une pédagogie active." light />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 48 }}>
            {[
              { icon: '🏅', title: 'Certifié Qualiopi', desc: "Notre certification Qualiopi garantit la qualité de nos processus de formation et ouvre l'accès aux financements publics et mutualisés." },
              { icon: '🎓', title: 'Formateurs experts', desc: "Des professionnels en activité qui transmettent des compétences opérationnelles directement applicables en situation de travail." },
              { icon: '💡', title: 'Pédagogie active', desc: "Mises en situation, cas pratiques, échanges de pratiques : nos formations s'adaptent à vos réalités métier pour un transfert concret." },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '28px 24px' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 10 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financement */}
      <section style={{ padding: '72px 28px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <SectionHeader tag="Financement" title="Nos formations peuvent être financées" align="left" />
            <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28, marginTop: 16 }}>
              De nombreuses solutions existent pour financer votre formation professionnelle. Nous vous guidons dans vos démarches pour mobiliser les financements auxquels vous avez droit.
            </p>
            {[
              { title: 'Compte Personnel de Formation (CPF)', desc: 'Utilisez votre solde CPF pour financer tout ou partie de votre formation.' },
              { title: 'Prise en charge OPCO', desc: "Votre employeur peut solliciter votre OPCO pour le financement de votre formation." },
              { title: 'Financement employeur (plan de formation)', desc: "Inclure la formation dans le plan de développement des compétences de l'entreprise." },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'oklch(0.93 0.08 145)', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="oklch(0.35 0.12 145)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{item.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('contact')}
              style={{ marginTop: 10, background: 'var(--navy)', color: 'white', padding: '11px 22px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-mid)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}
            >
              Parler à un conseiller →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'CPF', sub: 'Compte Personnel de Formation', color: 'oklch(0.93 0.08 145)', textColor: 'oklch(0.3 0.14 145)' },
              { label: 'OPCO', sub: 'Financement employeur', color: 'oklch(0.92 0.06 220)', textColor: 'oklch(0.3 0.1 220)' },
              { label: 'Plan', sub: 'Plan de développement', color: 'oklch(0.93 0.07 65)', textColor: 'oklch(0.4 0.12 65)' },
              { label: 'AIF', sub: 'Aide individuelle Pôle Emploi', color: 'oklch(0.93 0.05 310)', textColor: 'oklch(0.35 0.1 310)' },
            ].map((b, i) => (
              <div key={i} style={{ background: b.color, borderRadius: 12, padding: '24px 20px' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: b.textColor, letterSpacing: '-0.5px' }}>{b.label}</div>
                <div style={{ fontSize: 12.5, color: b.textColor, opacity: 0.7, marginTop: 6, lineHeight: 1.4 }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 28px', background: 'linear-gradient(135deg, var(--amber) 0%, oklch(0.72 0.2 55) 100%)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--navy)', margin: '0 0 14px', letterSpacing: '-0.6px' }}>Prêt à développer vos compétences ?</h2>
          <p style={{ fontSize: 15.5, color: 'oklch(0.3 0.12 245)', marginBottom: 32, lineHeight: 1.55 }}>
            Contactez-nous pour un accompagnement personnalisé. Nous construisons ensemble votre parcours de formation.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button onClick={() => navigate('catalogue')}
              style={{ background: 'var(--navy)', color: 'white', padding: '13px 28px', borderRadius: 9, fontWeight: 700, fontSize: 14.5, border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'oklch(0.18 0.09 255)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}
            >
              Voir le catalogue
            </button>
            <button onClick={() => navigate('contact')}
              style={{ background: 'white', color: 'var(--navy)', padding: '13px 28px', borderRadius: 9, fontWeight: 700, fontSize: 14.5, border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'oklch(0.97 0.01 255)'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
