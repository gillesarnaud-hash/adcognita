export default function Logo({ navigate, color }) {
  return (
    <div onClick={() => navigate('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: color === 'white' ? 'rgba(255,255,255,0.15)' : 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="8" r="4" fill={color === 'white' ? 'white' : 'var(--amber)'} />
          <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.4px', color: color === 'white' ? 'white' : 'var(--navy)', lineHeight: 1.1 }}>Ad Cognita</div>
        <div style={{ fontSize: 9.5, color: color === 'white' ? 'rgba(255,255,255,0.6)' : 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 1 }}>Organisme de formation</div>
      </div>
    </div>
  );
}
