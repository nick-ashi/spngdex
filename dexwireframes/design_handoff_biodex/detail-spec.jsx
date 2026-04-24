// Enhanced Spec Sheet detail — paired with Soft Grid.
// Adds evolution tree + richer profile. Dark aesthetic kept, but with softer
// warm background to feel less clinical and mesh with the Soft Grid catalog.

function DetailSpec({ c, onBack, onSelect }) {
  const t = TYPES[c.types[0]];
  const total = c.hp+c.atk+c.def+c.spa+c.spd+c.spe;
  const chain = getEvolutionChain(c.id);
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'auto',
      background: '#1f1814', color: '#f4efe6',
      fontFamily: 'Manrope, system-ui, sans-serif',
      animation: 'dFade 260ms cubic-bezier(.2,.8,.2,1)',
    }}>
      <style>{`@keyframes dFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
      <div style={{ padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #322a24' }}>
        <button onClick={onBack} style={{
          border: 'none', cursor: 'pointer', background: '#322a24', color: '#f4efe6',
          padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
        }}>← Index</button>
        <div style={{ fontSize: 10, color: '#8a8278', fontFamily: 'ui-monospace, monospace', letterSpacing: 1.5 }}>SPEC · {formatId(c.id)}</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 10, color: '#8a8278', fontFamily: 'ui-monospace, monospace' }}>REV 04.23.2026</div>
      </div>

      <section style={{ padding: 22, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 22 }}>
        <div>
          <div style={{ background: t.bg, borderRadius: 10, padding: 18, display: 'flex', justifyContent: 'center' }}>
            <Sprite c={c} size={170} />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: '#8a8278', letterSpacing: 1 }}>{formatId(c.id)} · GEN {c.gen}</div>
            <h1 style={{ margin: '4px 0 10px', fontSize: 30, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1 }}>{c.name}</h1>
            <div style={{ display: 'flex', gap: 4 }}>
              {c.types.map((tt) => <TypePill key={tt} t={tt} size="md" />)}
            </div>
          </div>
          <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
            {[
              ['Height', (c.ht || 0) + ' m'],
              ['Weight', (c.wt || 0) + ' kg'],
              ['Catch rate', 45 + (c.id % 55)],
              ['Exp. yield', 140 + (c.id % 80)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px dashed #322a24', fontSize: 11 }}>
                <span style={{ color: '#8a8278', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700, fontSize: 10 }}>{k}</span>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#2a221d', borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a8278' }}>Stat distribution</h3>
              <div style={{ fontSize: 10, color: '#8a8278', fontFamily: 'ui-monospace, monospace' }}>Σ {total} / 960 MAX</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Radar creature={c} size={210} accent="#f4efe6" />
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <StatBar label="HP"  value={c.hp}  accent="#f4efe6" delay={0} />
                <StatBar label="ATK" value={c.atk} accent="#f4efe6" delay={60} />
                <StatBar label="DEF" value={c.def} accent="#f4efe6" delay={120} />
                <StatBar label="SPA" value={c.spa} accent="#f4efe6" delay={180} />
                <StatBar label="SPD" value={c.spd} accent="#f4efe6" delay={240} />
                <StatBar label="SPE" value={c.spe} accent="#f4efe6" delay={300} />
              </div>
            </div>
          </div>

          <div style={{ background: '#2a221d', borderRadius: 12, padding: 18 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a8278' }}>Evolution line</h3>
            {chain.length >= 2 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'auto' }}>
                {chain.map((cr, i) => (
                  <React.Fragment key={cr.id}>
                    {i > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#8a8278', flexShrink: 0 }}>
                        <svg width="22" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                          <path d="M2 6h20M16 2l5 4-5 4" />
                        </svg>
                        <div style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                          {typeof cr.evolvesAt === 'number' ? `LV ${cr.evolvesAt}` : cr.evolvesAt || '—'}
                        </div>
                      </div>
                    )}
                    <button onClick={() => onSelect && cr.id !== c.id && onSelect(cr.id)}
                      style={{
                        border: 'none', cursor: onSelect && cr.id !== c.id ? 'pointer' : 'default',
                        background: cr.id === c.id ? TYPES[cr.types[0]].bg : '#322a24',
                        boxShadow: cr.id === c.id ? `0 0 0 2px ${TYPES[cr.types[0]].dot}` : 'none',
                        borderRadius: 10, padding: '10px 12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        fontFamily: 'inherit', color: cr.id === c.id ? '#1a1410' : '#f4efe6', flexShrink: 0,
                        transition: 'all .15s',
                      }}>
                      <Sprite c={cr} size={60} />
                      <div style={{ fontSize: 8, fontFamily: 'ui-monospace, monospace', opacity: .65 }}>{formatId(cr.id)}</div>
                      <div style={{ fontSize: 11, fontWeight: 700 }}>{cr.name}</div>
                    </button>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#8a8278', padding: '8px 0' }}>Single-stage specimen. No known evolutionary line.</div>
            )}
          </div>

          <div style={{ padding: 14, background: '#2a221d', borderRadius: 12, fontSize: 12, lineHeight: 1.55, color: '#c4bdb2' }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a8278', fontWeight: 700, marginBottom: 6 }}>Synopsis</div>
            A {c.types.map((tt) => TYPES[tt].label.toLowerCase()).join('/')}-type specimen. Baseline metrics suggest a {c.spe >= 90 ? 'rapid skirmisher' : c.def >= 90 ? 'defensive anchor' : c.spa >= 100 ? 'ranged caster' : 'balanced operator'} profile.
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { DetailSpec });
