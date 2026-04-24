// Catalog variations — each is a self-contained app shown in a DCArtboard.
// All use the same data but explore different layouts, densities, and visual metaphors.

// ─── Shared filter panel (medium power: type + gen + stats range) ───
function FilterPanel({ filters, setFilters, compact = false }) {
  const toggle = (k, v) => {
    const cur = new Set(filters[k]);
    if (cur.has(v)) cur.delete(v); else cur.add(v);
    setFilters({ ...filters, [k]: [...cur] });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 14 : 20, fontSize: 12 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278', marginBottom: 8 }}>Type</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.keys(TYPES).map((t) => {
            const on = filters.types.includes(t);
            return (
              <button key={t} onClick={() => toggle('types', t)}
                style={{
                  border: 'none', cursor: 'pointer',
                  background: on ? TYPES[t].fg : TYPES[t].bg,
                  color: on ? '#fff' : TYPES[t].fg,
                  padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                  letterSpacing: 0.4, textTransform: 'uppercase', fontFamily: 'inherit',
                  transition: 'all .15s',
                }}>
                {TYPES[t].label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278', marginBottom: 8 }}>Generation</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,2,3,4,5,6,7].map((g) => {
            const on = filters.gens.includes(g);
            return (
              <button key={g} onClick={() => toggle('gens', g)}
                style={{
                  border: 'none', cursor: 'pointer',
                  background: on ? '#1a1410' : '#f0ebe3',
                  color: on ? '#fff' : '#6a6158',
                  width: 28, height: 28, borderRadius: 6, fontSize: 11, fontWeight: 700,
                  fontFamily: 'inherit', transition: 'all .15s',
                }}>{g}</button>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278' }}>Min Total</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1410', fontFamily: 'ui-monospace, monospace' }}>{filters.minTotal}</div>
        </div>
        <input type="range" min={0} max={720} step={20} value={filters.minTotal}
          onChange={(e) => setFilters({ ...filters, minTotal: +e.target.value })}
          style={{ width: '100%', accentColor: '#1a1410' }} />
      </div>
    </div>
  );
}

function applyFilters(list, filters, query) {
  return list.filter((c) => {
    if (filters.types.length && !c.types.some((t) => filters.types.includes(t))) return false;
    if (filters.gens.length && !filters.gens.includes(c.gen)) return false;
    const total = c.hp + c.atk + c.def + c.spa + c.spd + c.spe;
    if (total < filters.minTotal) return false;
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !String(c.id).includes(query)) return false;
    return true;
  });
}

// ─── Hover preview card (shared) ───
function HoverPreview({ c, rect }) {
  if (!c || !rect) return null;
  const t = TYPES[c.types[0]];
  const total = c.hp + c.atk + c.def + c.spa + c.spd + c.spe;
  // Position above and to the right of the hovered card
  const style = {
    position: 'fixed', left: rect.right + 12, top: rect.top,
    width: 220, background: '#fff', borderRadius: 14, padding: 14,
    boxShadow: '0 12px 40px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.04)',
    zIndex: 200, pointerEvents: 'none',
    fontFamily: 'Manrope, system-ui, sans-serif',
    animation: 'hpFade .15s ease-out',
  };
  return ReactDOM.createPortal(
    <div style={style}>
      <style>{`@keyframes hpFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
      <div style={{ fontSize: 10, color: '#8a8278', fontFamily: 'ui-monospace, monospace', letterSpacing: 0.5 }}>{formatId(c.id)} · GEN {c.gen}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1410', marginTop: 2, marginBottom: 8 }}>{c.name}</div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {c.types.map((t) => <TypePill key={t} t={t} size="sm" />)}
      </div>
      <div style={{ display: 'grid', gap: 4 }}>
        <StatBar label="HP"  value={c.hp}  compact />
        <StatBar label="ATK" value={c.atk} compact />
        <StatBar label="DEF" value={c.def} compact />
        <StatBar label="SPA" value={c.spa} compact />
        <StatBar label="SPD" value={c.spd} compact />
        <StatBar label="SPE" value={c.spe} compact />
      </div>
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6a6158' }}>
        <span>HT {c.ht}m · WT {c.wt}kg</span>
        <span style={{ fontWeight: 700, color: '#1a1410', fontFamily: 'ui-monospace, monospace' }}>Σ {total}</span>
      </div>
    </div>,
    document.body,
  );
}

// ─── Compare tray (shared) ───
function CompareTray({ tray, drag, onRemove, onClear, onCompare }) {
  const active = drag || tray.length > 0;
  return (
    <div data-compare-tray
      style={{
        position: 'absolute', left: 16, right: 16, bottom: 16,
        background: drag?.over ? '#1a1410' : '#fff',
        color: drag?.over ? '#fff' : '#1a1410',
        borderRadius: 16, padding: '12px 14px',
        boxShadow: active ? '0 10px 30px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.05)' : '0 4px 12px rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.04)',
        transform: active ? 'translateY(0)' : 'translateY(0)',
        transition: 'background .15s, box-shadow .2s, color .15s',
        zIndex: 50, display: 'flex', alignItems: 'center', gap: 10, minHeight: 48,
        fontFamily: 'inherit',
      }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', opacity: .65 }}>
        {drag?.over ? 'Release to add' : tray.length === 0 ? 'Compare tray' : `${tray.length}/4 selected`}
      </div>
      <div style={{ flex: 1, display: 'flex', gap: 8 }}>
        {tray.map((c) => (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#f4efe6', color: '#1a1410',
            padding: '4px 4px 4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          }}>
            {c.name}
            <button onClick={() => onRemove(c.id)} style={{
              border: 'none', background: '#1a1410', color: '#fff', width: 18, height: 18, borderRadius: '50%',
              fontSize: 11, cursor: 'pointer', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
          </div>
        ))}
        {tray.length === 0 && !drag && (
          <div style={{ fontSize: 11, color: '#8a8278' }}>Drag creatures here to compare them.</div>
        )}
      </div>
      {tray.length >= 2 && (
        <button onClick={onCompare} style={{
          border: 'none', cursor: 'pointer', background: '#1a1410', color: '#fff',
          padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700,
          letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: 'inherit',
        }}>Compare →</button>
      )}
      {tray.length > 0 && (
        <button onClick={onClear} style={{
          border: 'none', cursor: 'pointer', background: 'transparent', color: 'inherit',
          padding: '6px 8px', fontSize: 11, opacity: .6, fontFamily: 'inherit',
        }}>Clear</button>
      )}
    </div>
  );
}

// ─── Compare modal (shared across catalogs) ───
function CompareModal({ tray, onClose }) {
  if (!tray.length) return null;
  const stats = ['hp','atk','def','spa','spd','spe'];
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(26,20,16,.4)', backdropFilter: 'blur(8px)',
      zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 20, padding: 24, maxWidth: 900, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1410' }}>Side-by-side</div>
          <button onClick={onClose} style={{
            border: 'none', background: '#f0ebe3', width: 28, height: 28, borderRadius: 14,
            cursor: 'pointer', fontSize: 16, lineHeight: 1, color: '#1a1410',
          }}>×</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tray.length}, 1fr)`, gap: 16 }}>
          {tray.map((c) => (
            <div key={c.id} style={{ background: '#faf7f1', borderRadius: 14, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <Sprite c={c} size={80} />
              </div>
              <div style={{ textAlign: 'center', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: '#8a8278' }}>{formatId(c.id)}</div>
              <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#1a1410', marginBottom: 6 }}>{c.name}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 10 }}>
                {c.types.map((t) => <TypePill key={t} t={t} size="sm" />)}
              </div>
              <div style={{ display: 'grid', gap: 4 }}>
                {stats.map((k) => <StatBar key={k} label={STAT_LABELS[k]} value={c[k]} compact />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FilterPanel, applyFilters, HoverPreview, CompareTray, CompareModal });
