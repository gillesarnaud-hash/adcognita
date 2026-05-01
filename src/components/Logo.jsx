export default function Logo({ navigate, color }) {
  const isWhite = color === 'white';
  const squareColor = isWhite ? 'rgba(255,255,255,0.28)' : 'oklch(0.82 0.04 240)';

  return (
    <div onClick={() => navigate('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3.5, flexShrink: 0 }}>
        <div style={{ width: 14, height: 14, borderRadius: 4, background: squareColor }} />
        <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--amber)' }} />
        <div style={{ width: 14, height: 14, borderRadius: 4, background: squareColor }} />
        <div style={{ width: 14, height: 14, borderRadius: 4, background: squareColor, opacity: 0.6 }} />
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.4px', color: isWhite ? 'white' : 'var(--navy)', lineHeight: 1.1 }}>Ad Cognita</div>
        <div style={{ fontSize: 9.5, color: isWhite ? 'rgba(255,255,255,0.55)' : 'var(--muted)', letterSpacing: '1.2px', textTransform: 'uppercase', marginTop: 2 }}>Organisme de formation</div>
      </div>
    </div>
  );
}
