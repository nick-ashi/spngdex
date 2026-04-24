// Full-page Compare view — side-by-side stats with delta highlights,
// radar overlay, drop zones for adding more creatures.

function CompareView({ initial, onBack, onAdd }) {
  const [picks, setPicks] = React.useState(initial || []);
  const stats = ['hp','atk','def','spa','spd','spe'];

  // Find max per stat for delta visualization
  const maxs = {};
  for (const k of stats) maxs[k] = Math.max(...picks.map((c) => c[k] || 0), 0);

  const remove = (id) => setPicks((p) => p.filter((c) => c.id !== id));

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'auto',
      background: '#faf7f1', color: '#1a1410',
      fontFamily: 'Manrope, system-ui, sans-serif',
      animation: 'dFade 260ms cubic-bezier(.2,.8,.2,1)',
    }}>
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0ebe3' }}>
        <button onClick={onBack} style={{
          border: 'none', cursor: 'pointer', background: '#f4efe6', color: '#1a1410',
          padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
        }}>← Back</button>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278' }}>Side-by-side comparison · {picks.length} selected</div>
      </div>

      {picks.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#8a8278' }}>No creatures selected. Go back and drag some into the compare tray.</div>
        </div>
      ) : (
        <section style={{ padding: 24 }}>
          {/* Radar overlay */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278' }}>Stat overlay</h3>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', height: 280 }}>
              <OverlayRadar creatures={picks} size={260} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
              {picks.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: overlayColor(i) }} />
                  <span style={{ fontWeight: 700 }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side-by-side cards with delta */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${picks.length}, 1fr)`, gap: 14 }}>
            {picks.map((c, i) => {
              const t = TYPES[c.types[0]];
              const total = stats.reduce((s, k) => s + c[k], 0);
              const maxTotal = Math.max(...picks.map((x) => stats.reduce((s, k) => s + x[k], 0)));
              return (
                <div key={c.id} style={{ background: '#fff', borderRadius: 16, padding: 16, position: 'relative' }}>
                  <button onClick={() => remove(c.id)} style={{
                    position: 'absolute', top: 10, right: 10, border: 'none', cursor: 'pointer',
                    background: '#f4efe6', width: 22, height: 22, borderRadius: 11,
                    fontSize: 12, color: '#8a8278', lineHeight: 1, padding: 0,
                  }}>×</button>
                  <div style={{ background: t.bg, borderRadius: 12, padding: 12, display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                    <Sprite c={c} size={80} />
                  </div>
                  <div style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', color: '#8a8278' }}>{formatId(c.id)}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                    {c.types.map((tt) => <TypePill key={tt} t={tt} size="sm" />)}
                  </div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {stats.map((k) => {
                      const isMax = c[k] === maxs[k] && picks.length > 1;
                      return (
                        <div key={k} style={{
                          display: 'grid', gridTemplateColumns: '40px 28px 1fr', alignItems: 'center', gap: 8, fontSize: 10,
                          padding: '4px 6px', borderRadius: 6,
                          background: isMax ? '#f4efe6' : 'transparent',
                        }}>
                          <span style={{ color: '#8a8278', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>{STAT_LABELS[k]}</span>
                          <span style={{ fontWeight: 800, fontFamily: 'ui-monospace, monospace' }}>{c[k]}</span>
                          <span style={{ height: 5, background: '#f0ebe3', borderRadius: 999, overflow: 'hidden' }}>
                            <span style={{ display: 'block', height: '100%', width: `${(c[k] / MAX_STAT) * 100}%`, background: isMax ? t.dot : '#6a6158', borderRadius: 999, transition: 'width .8s cubic-bezier(.2,.8,.2,1)' }} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: '#8a8278', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700, fontSize: 9 }}>Total</span>
                    <span style={{ fontWeight: 800, fontFamily: 'ui-monospace, monospace', color: total === maxTotal && picks.length > 1 ? t.dot : '#1a1410' }}>{total}</span>
                  </div>
                </div>
              );
            })}
            {picks.length < 4 && (
              <button onClick={onAdd} style={{
                border: '2px dashed #d4cbc0', cursor: 'pointer', background: 'transparent',
                borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6,
                color: '#8a8278', fontFamily: 'inherit', minHeight: 200,
              }}>
                <span style={{ fontSize: 24, fontWeight: 300, lineHeight: 1 }}>+</span>
                <span style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>Add creature</span>
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function overlayColor(i) {
  const palette = ['#e8663a', '#3d82c4', '#57a55a', '#a064cc'];
  return palette[i % palette.length];
}

function OverlayRadar({ creatures, size }) {
  const stats = ['hp', 'atk', 'def', 'spe', 'spd', 'spa'];
  const cx = size / 2, cy = size / 2, maxR = size * 0.38;
  const rings = [0.25, 0.5, 0.75, 1].map((f) => {
    const p = Array.from({ length: 6 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
      return [cx + Math.cos(a) * maxR * f, cy + Math.sin(a) * maxR * f];
    });
    return p.map((q, i) => (i === 0 ? `M ${q[0]} ${q[1]}` : `L ${q[0]} ${q[1]}`)).join(' ') + ' Z';
  });
  const labelPts = stats.map((k, i) => {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
    return [cx + Math.cos(a) * (maxR + 16), cy + Math.sin(a) * (maxR + 16), k];
  });
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {rings.map((d, i) => <path key={i} d={d} fill="none" stroke="#e6dfd3" strokeWidth={1} />)}
      {creatures.map((c, ci) => {
        const color = overlayColor(ci);
        const pts = stats.map((k, i) => {
          const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
          const r = maxR * (c[k] / MAX_STAT);
          return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
        });
        const poly = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ') + ' Z';
        return (
          <g key={c.id}>
            <path d={poly} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill={color} />)}
          </g>
        );
      })}
      {labelPts.map(([x, y, k]) => (
        <text key={k} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 10, fontWeight: 700, fill: '#8a8278', letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>
          {STAT_LABELS[k]}
        </text>
      ))}
    </svg>
  );
}

Object.assign(window, { CompareView, OverlayRadar });
