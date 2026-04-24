// Team Builder — 6 slots, pick from roster, role analysis (type coverage, role mix).

function TeamBuilder({ initial, onBack }) {
  const [team, setTeam] = React.useState(() => {
    const t = initial || [];
    return [...t, ...Array(Math.max(0, 6 - t.length)).fill(null)].slice(0, 6);
  });
  const [pickerIdx, setPickerIdx] = React.useState(null);
  const [query, setQuery] = React.useState('');

  const setSlot = (i, c) => setTeam((t) => t.map((x, j) => (j === i ? c : x)));

  const filled = team.filter(Boolean);
  const typeCoverage = {};
  for (const c of filled) for (const t of c.types) typeCoverage[t] = (typeCoverage[t] || 0) + 1;
  const coverageEntries = Object.entries(typeCoverage).sort((a, b) => b[1] - a[1]);
  const avgTotal = filled.length ? Math.round(filled.reduce((s, c) => s + c.hp + c.atk + c.def + c.spa + c.spd + c.spe, 0) / filled.length) : 0;
  const roles = filled.map((c) => {
    if (c.spe >= 95) return 'Skirmisher';
    if (c.def >= 100 || c.spd >= 100) return 'Anchor';
    if (c.spa >= 100) return 'Caster';
    if (c.atk >= 100) return 'Bruiser';
    return 'Utility';
  });
  const roleCounts = {};
  for (const r of roles) roleCounts[r] = (roleCounts[r] || 0) + 1;

  const list = CREATURES.filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background: '#faf7f1', color: '#1a1410',
      fontFamily: 'Manrope, system-ui, sans-serif',
      animation: 'dFade 260ms cubic-bezier(.2,.8,.2,1)',
      display: 'grid', gridTemplateRows: '56px 1fr',
    }}>
      <div style={{ padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0ebe3' }}>
        <button onClick={onBack} style={{
          border: 'none', cursor: 'pointer', background: '#f4efe6', color: '#1a1410',
          padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
        }}>← Back</button>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>Team Builder</div>
        <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: '#8a8278', letterSpacing: 1 }}>{filled.length} / 6</div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setTeam([null,null,null,null,null,null])} style={{
          border: 'none', cursor: 'pointer', background: 'transparent', color: '#8a8278',
          padding: '6px 10px', fontSize: 11, fontFamily: 'inherit',
        }}>Clear</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', overflow: 'hidden' }}>
        {/* Slots */}
        <main style={{ overflow: 'auto', padding: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {team.map((c, i) => <TeamSlot key={i} idx={i} c={c} onClick={() => setPickerIdx(i)} onClear={() => setSlot(i, null)} />)}
          </div>

          {/* Analysis */}
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278', marginBottom: 10 }}>Type coverage</div>
              {coverageEntries.length === 0 ? (
                <div style={{ fontSize: 11, color: '#8a8278' }}>Pick a creature to begin.</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {coverageEntries.map(([t, n]) => (
                    <span key={t} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: TYPES[t].bg, color: TYPES[t].fg,
                      padding: '3px 9px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                      letterSpacing: 0.4, textTransform: 'uppercase',
                    }}>
                      {TYPES[t].label}
                      <span style={{ background: TYPES[t].dot, color: '#fff', borderRadius: 8, padding: '1px 5px', fontSize: 9 }}>{n}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278', marginBottom: 10 }}>Role mix</div>
              {Object.keys(roleCounts).length === 0 ? (
                <div style={{ fontSize: 11, color: '#8a8278' }}>—</div>
              ) : (
                <div style={{ display: 'grid', gap: 6 }}>
                  {Object.entries(roleCounts).map(([r, n]) => (
                    <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, flex: 1 }}>{r}</div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <div key={j} style={{ width: 9, height: 9, borderRadius: 2, background: j < n ? '#1a1410' : '#f0ebe3' }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278', marginBottom: 10 }}>Team average</div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'ui-monospace, monospace', lineHeight: 1 }}>{avgTotal}</div>
              <div style={{ fontSize: 10, color: '#8a8278', marginTop: 2 }}>Base stat total</div>
            </div>
          </div>
        </main>

        {/* Picker */}
        <aside style={{ borderLeft: '1px solid #f0ebe3', background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0ebe3' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278', marginBottom: 8 }}>
              {pickerIdx !== null ? `Pick for slot ${pickerIdx + 1}` : 'Roster — click a slot, then pick'}
            </div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
              style={{ width: '100%', border: 'none', background: '#f4efe6', padding: '7px 10px', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
            {list.map((c) => {
              const already = team.findIndex((x) => x && x.id === c.id);
              return (
                <button key={c.id} disabled={pickerIdx === null || already >= 0}
                  onClick={() => { setSlot(pickerIdx, c); setPickerIdx(null); }}
                  style={{
                    width: '100%', border: 'none',
                    cursor: pickerIdx !== null && already < 0 ? 'pointer' : 'default',
                    background: 'transparent', padding: '6px 8px', borderRadius: 8,
                    display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: 10,
                    fontFamily: 'inherit', textAlign: 'left', opacity: already >= 0 ? 0.4 : 1,
                    transition: 'background .12s',
                  }}
                  onMouseEnter={(e) => { if (pickerIdx !== null && already < 0) e.currentTarget.style.background = '#faf7f1'; }}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <Sprite c={c} size={30} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 9, color: '#8a8278', fontFamily: 'ui-monospace, monospace' }}>{formatId(c.id)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {c.types.map((tt) => <span key={tt} style={{ width: 6, height: 6, borderRadius: '50%', background: TYPES[tt].dot }} />)}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

function TeamSlot({ idx, c, onClick, onClear }) {
  if (!c) {
    return (
      <button onClick={onClick} style={{
        border: '2px dashed #d4cbc0', cursor: 'pointer', background: 'transparent',
        borderRadius: 14, padding: 16, minHeight: 150,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
        color: '#8a8278', fontFamily: 'inherit',
      }}>
        <span style={{ fontSize: 24, fontWeight: 300, lineHeight: 1 }}>+</span>
        <span style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>Slot {idx + 1}</span>
      </button>
    );
  }
  const t = TYPES[c.types[0]];
  const total = c.hp+c.atk+c.def+c.spa+c.spd+c.spe;
  return (
    <div onClick={onClick} style={{
      background: t.bg, borderRadius: 14, padding: 14, position: 'relative', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <button onClick={(e) => { e.stopPropagation(); onClear(); }} style={{
        position: 'absolute', top: 8, right: 8, border: 'none', cursor: 'pointer',
        background: 'rgba(255,255,255,.6)', width: 22, height: 22, borderRadius: 11,
        fontSize: 12, color: t.fg, lineHeight: 1, padding: 0,
      }}>×</button>
      <div style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', color: t.fg, opacity: 0.7 }}>Slot {idx+1} · {formatId(c.id)}</div>
      <Sprite c={c} size={64} />
      <div style={{ fontSize: 13, fontWeight: 800, color: t.fg }}>{c.name}</div>
      <div style={{ display: 'flex', gap: 3 }}>{c.types.map((tt) => <TypePill key={tt} t={tt} size="sm" />)}</div>
      <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: t.fg, opacity: 0.7, marginTop: 2 }}>Σ {total}</div>
    </div>
  );
}

Object.assign(window, { TeamBuilder });
