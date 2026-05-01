export function ModeBadge({ label }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5,
      background: 'var(--bg-alt)', color: 'var(--muted)', border: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

export function CPFBadge() {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 5,
      background: 'oklch(0.93 0.08 145)', color: 'oklch(0.35 0.12 145)', border: '1px solid oklch(0.82 0.1 145)', whiteSpace: 'nowrap' }}>
      CPF
    </span>
  );
}

export function QualiopiBadge() {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'white' }}>Certifié Qualiopi</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Actions de formation</div>
      </div>
    </div>
  );
}
