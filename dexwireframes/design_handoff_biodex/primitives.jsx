// Shared UI primitives: stat bars, radar chart, drag-to-compare tray hook.

// Animated horizontal bar. Grows from 0 on mount.
function StatBar({ label, value, max = MAX_STAT, accent = '#1a1410', compact = false, delay = 0 }) {
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setW((value / max) * 100), 40 + delay);
    return () => clearTimeout(t);
  }, [value, max, delay]);
  const hot = value >= 100 ? accent : value >= 70 ? '#2a2520' : '#6a6158';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: compact ? '38px 28px 1fr' : '52px 32px 1fr', alignItems: 'center', gap: 10, fontSize: compact ? 10 : 11 }}>
      <span style={{ color: '#8a8278', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#1a1410', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>{value}</span>
      <span style={{ display: 'block', height: compact ? 5 : 7, background: '#f0ebe3', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
        <span style={{
          display: 'block', height: '100%', width: `${w}%`, background: hot, borderRadius: 999,
          transition: 'width 900ms cubic-bezier(.2,.8,.2,1)',
        }} />
      </span>
    </div>
  );
}

// Hexagonal radar chart for 6 stats. Animates on mount / when creature changes.
function Radar({ creature, size = 220, accent = '#1a1410' }) {
  const stats = ['hp', 'atk', 'def', 'spe', 'spd', 'spa']; // clockwise from top
  const [prog, setProg] = React.useState(0);
  const prevId = React.useRef(creature.id);
  React.useEffect(() => {
    setProg(0);
    const id = requestAnimationFrame(() => setProg(1));
    prevId.current = creature.id;
    return () => cancelAnimationFrame(id);
  }, [creature.id]);

  const cx = size / 2, cy = size / 2;
  const maxR = size * 0.38;
  const pts = stats.map((k, i) => {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
    const v = creature[k] / MAX_STAT;
    const r = maxR * v * prog;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const labelPts = stats.map((k, i) => {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
    return [cx + Math.cos(a) * (maxR + 18), cy + Math.sin(a) * (maxR + 18), k, i];
  });

  const rings = [0.25, 0.5, 0.75, 1].map((f) => {
    const p = Array.from({ length: 6 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
      return [cx + Math.cos(a) * maxR * f, cy + Math.sin(a) * maxR * f];
    });
    return p.map((q, i) => (i === 0 ? `M ${q[0]} ${q[1]}` : `L ${q[0]} ${q[1]}`)).join(' ') + ' Z';
  });

  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
    return [cx, cy, cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR];
  });

  const poly = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ') + ' Z';
  const total = creature.hp + creature.atk + creature.def + creature.spa + creature.spd + creature.spe;

  return (
    <svg width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#e6dfd3" strokeWidth={1} />
      ))}
      {spokes.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e6dfd3" strokeWidth={1} />
      ))}
      <path d={poly} fill={accent} fillOpacity={0.14} stroke={accent} strokeWidth={1.5} strokeLinejoin="round" style={{ transition: 'all 700ms cubic-bezier(.2,.8,.2,1)' }} />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={accent} style={{ transition: 'all 700ms cubic-bezier(.2,.8,.2,1)' }} />
      ))}
      {labelPts.map(([x, y, k, i]) => (
        <g key={k}>
          <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 10, fontWeight: 700, fill: '#8a8278', letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'inherit' }}>
            {STAT_LABELS[k]}
          </text>
          <text x={x} y={y + 11} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 10, fontWeight: 700, fill: '#1a1410', fontVariantNumeric: 'tabular-nums', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
            {creature[k]}
          </text>
        </g>
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: 9, fill: '#8a8278', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'inherit', fontWeight: 600 }}>Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: 14, fontWeight: 700, fill: '#1a1410', fontVariantNumeric: 'tabular-nums' }}>{total}</text>
    </svg>
  );
}

// Tiny sparkline stat preview for hover cards.
function MiniStats({ c }) {
  const ks = ['hp','atk','def','spa','spd','spe'];
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 24 }}>
      {ks.map((k) => (
        <span key={k} title={`${STAT_LABELS[k]} ${c[k]}`} style={{
          width: 6, height: `${(c[k] / MAX_STAT) * 100}%`,
          background: c[k] >= 100 ? '#1a1410' : '#9a9287', borderRadius: 2,
        }} />
      ))}
    </div>
  );
}

// Scoped drag-to-compare — works WITHIN one artboard only. Caller passes an
// `artboardRef` pointing at the scrollable root of that artboard; the tray
// and the drop-detection use that node's bounding box. Multiple artboards
// can each have their own independent tray.
function useCompareTrayScoped(artboardRef) {
  const [tray, setTray] = React.useState([]); // array of creature objects
  const [drag, setDrag] = React.useState(null); // { c, x, y, over }

  const startDrag = (c, e) => {
    e.preventDefault();
    setDrag({ c, x: e.clientX, y: e.clientY, over: false });
    const move = (ev) => {
      const root = artboardRef.current;
      if (!root) return;
      const r = root.getBoundingClientRect();
      const inside = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
      if (!inside) { setDrag((d) => d && { ...d, x: ev.clientX, y: ev.clientY, over: false }); return; }
      const trayEl = root.querySelector('[data-compare-tray]');
      const overTray = trayEl && (() => {
        const tr = trayEl.getBoundingClientRect();
        return ev.clientX >= tr.left && ev.clientX <= tr.right && ev.clientY >= tr.top && ev.clientY <= tr.bottom;
      })();
      setDrag((d) => d && { ...d, x: ev.clientX, y: ev.clientY, over: !!overTray });
    };
    const up = (ev) => {
      const root = artboardRef.current;
      const trayEl = root && root.querySelector('[data-compare-tray]');
      let dropped = false;
      if (trayEl) {
        const tr = trayEl.getBoundingClientRect();
        if (ev.clientX >= tr.left && ev.clientX <= tr.right && ev.clientY >= tr.top && ev.clientY <= tr.bottom) dropped = true;
      }
      if (dropped) {
        setTray((t) => t.find((x) => x.id === c.id) ? t : [...t, c].slice(0, 4));
      }
      setDrag(null);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };

  const removeFromTray = (id) => setTray((t) => t.filter((c) => c.id !== id));
  const clearTray = () => setTray([]);

  return { tray, drag, startDrag, removeFromTray, clearTray };
}

// Floating ghost card that follows the cursor during drag-to-compare.
function DragGhost({ drag }) {
  if (!drag) return null;
  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed', left: drag.x + 14, top: drag.y + 14,
      pointerEvents: 'none', zIndex: 9999,
      background: '#fff', borderRadius: 12, padding: '8px 12px',
      boxShadow: '0 8px 28px rgba(0,0,0,.18), 0 0 0 2px ' + (drag.over ? '#1a1410' : 'rgba(0,0,0,0)'),
      display: 'flex', alignItems: 'center', gap: 10,
      transition: 'box-shadow .12s',
      fontFamily: 'Manrope, system-ui, sans-serif',
    }}>
      <div style={{ width: 32, height: 32 }}><Sprite c={drag.c} size={32} /></div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1410' }}>{drag.c.name}</div>
        <div style={{ fontSize: 9, color: '#8a8278', fontFamily: 'ui-monospace, monospace' }}>{formatId(drag.c.id)}</div>
      </div>
    </div>,
    document.body,
  );
}

Object.assign(window, { StatBar, Radar, MiniStats, useCompareTrayScoped, DragGhost });
