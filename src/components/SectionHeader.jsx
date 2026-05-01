export default function SectionHeader({ tag, title, sub, light, align = 'center' }) {
  return (
    <div style={{ textAlign: align }}>
      {tag && (
        <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--amber)', marginBottom: 10 }}>
          {tag}
        </div>
      )}
      <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: light ? 'white' : 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 14.5, color: light ? 'rgba(255,255,255,0.55)' : 'var(--muted)', marginTop: 12, lineHeight: 1.6,
          maxWidth: align === 'center' ? 560 : '100%',
          margin: align === 'center' ? '12px auto 0' : '12px 0 0'
        }}>{sub}</p>
      )}
    </div>
  );
}
