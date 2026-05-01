import { useState } from 'react';

function Field({ label, type, value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13.5, color: 'var(--text)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
    </div>
  );
}

export default function ContactPage({ navigate }) {
  const [form, setForm] = useState({ nom: '', email: '', tel: '', organisation: '', sujet: '', message: '', rgpd: false });
  const [sent, setSent] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '48px 28px 56px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('home')}>Accueil</span>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: 'white' }}>Contact</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,3vw,40px)', fontWeight: 800, color: 'white', margin: '0 0 14px', letterSpacing: '-0.6px' }}>Contactez-nous</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
            Un projet de formation ? Une question sur nos programmes ? Notre équipe vous répond sous 24h.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 28px 72px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>
        {/* Form */}
        <div>
          {sent ? (
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 16, padding: '56px 40px', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'oklch(0.93 0.08 145)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l7 7L23 7" stroke="oklch(0.35 0.12 145)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Message envoyé !</div>
              <div style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.65, maxWidth: 380, margin: '0 auto 28px' }}>
                Merci pour votre message. Notre équipe reviendra vers vous dans les meilleurs délais, sous 24h ouvrées.
              </div>
              <button onClick={() => { setSent(false); setForm({ nom: '', email: '', tel: '', organisation: '', sujet: '', message: '', rgpd: false }); }}
                style={{ background: 'var(--navy)', color: 'white', padding: '11px 24px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, border: 'none', cursor: 'pointer' }}>
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 32px' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 28 }}>Votre demande</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Field label="Nom & Prénom *" type="text" value={form.nom} onChange={v => update('nom', v)} placeholder="Jean Dupont" required />
                <Field label="Email *" type="email" value={form.email} onChange={v => update('email', v)} placeholder="jean@example.com" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Field label="Téléphone" type="tel" value={form.tel} onChange={v => update('tel', v)} placeholder="06 12 34 56 78" />
                <Field label="Organisation" type="text" value={form.organisation} onChange={v => update('organisation', v)} placeholder="Nom de votre entreprise" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>Objet de votre demande</label>
                <select value={form.sujet} onChange={e => update('sujet', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13.5, color: form.sujet ? 'var(--text)' : 'var(--muted)', outline: 'none', background: 'white' }}>
                  <option value="">Choisissez un objet...</option>
                  <option>Inscription à une formation</option>
                  <option>Demande de devis</option>
                  <option>Formation intra-entreprise</option>
                  <option>Financement CPF / OPCO</option>
                  <option>Information sur un programme</option>
                  <option>Partenariat formateur</option>
                  <option>Autre</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>Votre message *</label>
                <textarea value={form.message} onChange={e => update('message', e.target.value)} required rows={5}
                  placeholder="Décrivez votre projet, vos besoins, vos questions..."
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13.5, color: 'var(--text)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: 1.55 }} />
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 24 }}>
                <input type="checkbox" checked={form.rgpd} onChange={e => update('rgpd', e.target.checked)} required
                  style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--navy)', flexShrink: 0, cursor: 'pointer' }} />
                <span style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                  J'accepte que mes données soient traitées par Ad Cognita dans le cadre de ma demande de contact, conformément à notre politique de confidentialité et au RGPD. *
                </span>
              </label>

              <button type="submit"
                style={{ background: 'var(--navy)', color: 'white', padding: '13px 32px', borderRadius: 9, fontWeight: 700, fontSize: 14.5, border: 'none', cursor: 'pointer', width: '100%', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-mid)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}
              >
                Envoyer ma demande →
              </button>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 22px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Nos coordonnées</div>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.88 12 19.79 19.79 0 0 1 1.85 3.4 2 2 0 0 1 3.83 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.99-.99a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>, label: 'Téléphone', val: '01 23 45 67 89' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, label: 'Email', val: 'contact@adcognita.fr' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>, label: 'Adresse', val: '12 rue de la Formation, 75008 Paris' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, background: 'var(--bg-alt)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 500, marginTop: 2 }}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 22px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Horaires d'accueil</div>
            {[
              { j: 'Lundi — Vendredi', h: '9h00 – 18h00' },
              { j: 'Samedi', h: 'Sur rendez-vous' },
              { j: 'Dimanche', h: 'Fermé' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', fontSize: 13, color: 'var(--text)' }}>
                <span>{row.j}</span>
                <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{row.h}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--navy)', borderRadius: 12, padding: '22px 22px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'white', marginBottom: 10 }}>Financement de votre formation</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 16 }}>
              CPF, OPCO, plan de formation… Nous vous accompagnons dans le montage de votre dossier de financement.
            </div>
            <button onClick={() => navigate('catalogue')}
              style={{ width: '100%', background: 'var(--amber)', color: 'var(--navy)', padding: '10px', borderRadius: 7, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
              Voir nos formations CPF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
