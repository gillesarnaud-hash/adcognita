export default function AboutPage({ navigate }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--navy)', padding: '56px 28px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('home')}>Accueil</span>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: 'white' }}>À propos</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: 'white', margin: '0 0 16px', letterSpacing: '-0.7px' }}>À propos d'Ad Cognita</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 580, lineHeight: 1.65, margin: 0 }}>
            Un organisme de formation professionnelle fondé sur l'exigence pédagogique, la proximité avec nos apprenants et la certification Qualiopi.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section style={{ padding: '72px 28px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '1.1px', marginBottom: 12 }}>Notre mission</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', margin: '0 0 20px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Former, transformer, faire progresser
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 20 }}>
              Ad Cognita a été fondée avec une conviction forte : la formation professionnelle doit être utile, concrète et directement applicable dans le quotidien des professionnels.
            </p>
            <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 28 }}>
              Nous travaillons avec des formateurs-praticiens, des professionnels en activité qui transmettent ce qu'ils maîtrisent réellement. Nos formations s'appuient sur des situations de travail réelles, des outils du quotidien et une pédagogie active centrée sur le transfert en situation.
            </p>
            <button onClick={() => navigate('contact')}
              style={{ background: 'var(--navy)', color: 'white', padding: '11px 24px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-mid)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}
            >
              Nous contacter
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { val: '7', label: 'domaines de formation', color: 'var(--navy)', textColor: 'white' },
              { val: '95%', label: 'taux de satisfaction', color: 'var(--amber)', textColor: 'var(--navy)' },
              { val: 'CPF', label: 'financement éligible', color: 'oklch(0.93 0.08 145)', textColor: 'oklch(0.3 0.14 145)' },
              { val: 'Qualiopi', label: 'certifié', color: 'var(--bg-alt)', textColor: 'var(--navy)' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.color, borderRadius: 14, padding: '28px 22px' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.textColor, letterSpacing: '-0.5px' }}>{s.val}</div>
                <div style={{ fontSize: 13, color: s.textColor, opacity: 0.65, marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section style={{ padding: '72px 28px', background: 'var(--bg-alt)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '1.1px', marginBottom: 10 }}>Nos valeurs</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Ce qui nous guide au quotidien</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { title: 'Utilité', desc: 'Chaque formation doit apporter une valeur concrète et immédiatement applicable dans le contexte professionnel de nos apprenants.' },
              { title: 'Exigence', desc: "Nous sélectionnons nos formateurs sur leur expertise terrain, leur pédagogie et leur capacité à s'adapter à leur public." },
              { title: 'Proximité', desc: "Un interlocuteur dédié, un suivi personnalisé avant, pendant et après la formation. Nous ne sommes pas un catalogue anonyme." },
              { title: 'Amélioration continue', desc: "La certification Qualiopi matérialise notre engagement : nous mesurons, nous écoutons, nous améliorons sans cesse nos dispositifs." },
            ].map((v, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 22px' }}>
                <div style={{ width: 36, height: 36, background: 'var(--navy)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--amber)' }}>{i + 1}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualiopi */}
      <section style={{ padding: '72px 28px', background: 'white' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 28px', marginBottom: 36 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 11l6 6L19 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Certifié Qualiopi</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Actions de formation — Certification n° XX XX XXXXX XX</div>
            </div>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', margin: '0 0 18px', letterSpacing: '-0.5px' }}>La qualité, certifiée et vérifiée</h2>
          <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 620, margin: '0 auto 28px' }}>
            La certification Qualiopi atteste de la qualité de nos processus de formation. Elle est obligatoire pour accéder aux financements publics et mutualisés (OPCO, CPF, Pôle Emploi). Elle est délivrée suite à un audit externe réalisé par un organisme accrédité par le COFRAC.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'left' }}>
            {[
              { title: 'Référentiel national', desc: 'Nos processus sont évalués selon les 7 critères du Référentiel National Qualité (RNQ).' },
              { title: 'Audit externe', desc: "Un organisme accrédité vérifie notre conformité lors d'audits réguliers sur sites et à distance." },
              { title: 'Accès aux financements', desc: "La certification ouvre l'accès aux financements CPF, OPCO et fonds publics pour vos formations." },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--bg-alt)', borderRadius: 10, padding: '18px 18px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 7 }}>{item.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section style={{ padding: '72px 28px', background: 'var(--bg-alt)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '1.1px', marginBottom: 10 }}>Notre équipe</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Des experts pour vous accompagner</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { initials: 'SL', name: 'Sophie Laurent', role: 'Directrice pédagogique', domains: 'Management · RH', bio: "15 ans d'expérience en développement des compétences et conduite du changement en grands groupes." },
              { initials: 'TP', name: 'Thomas Petit', role: 'Formateur expert IA & Digital', domains: 'IA · Bureautique · Marketing', bio: "Consultant en transformation digitale, il forme des équipes à l'IA générative et aux outils collaboratifs modernes." },
              { initials: 'MR', name: 'Marie Renard', role: 'Responsable commerciale', domains: 'Droit · Entrepreneuriat', bio: "Juriste de formation, elle accompagne nos clients dans la définition de leurs plans de formation et le financement." },
            ].map((p, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 24px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--navy)', color: 'white', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, letterSpacing: '0.5px' }}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--amber)', fontWeight: 600, marginTop: 3, marginBottom: 4 }}>{p.role}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 10 }}>{p.domains}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>{p.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
