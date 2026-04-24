// Catalog A — "Soft Grid": large rounded cards with colored type-gradient backgrounds,
// density toggle (comfortable vs. compact), classic filter sidebar.

function CatalogA({ onOpenDetail, onCompare, onTeamBuilder }) {
  const artboardRef = React.useRef(null);
  const [density, setDensity] = React.useState('comfortable'); // 'comfortable' | 'compact' | 'rows'
  const [query, setQuery] = React.useState('');
  const [filters, setFilters] = React.useState({ types: [], gens: [], minTotal: 0 });
  const [hover, setHover] = React.useState(null); // { c, rect }
  const { tray, drag, startDrag, removeFromTray, clearTray } = useCompareTrayScoped(artboardRef);

  const list = applyFilters(CREATURES, filters, query);

  const cardSize = density === 'comfortable' ? 150 : density === 'compact' ? 108 : 0;

  return (
    <div ref={artboardRef} style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: '#faf7f1', fontFamily: 'Manrope, system-ui, sans-serif', color: '#1a1410',
      display: 'grid', gridTemplateColumns: '230px 1fr', gridTemplateRows: '56px 1fr',
    }}>
      {/* Top bar */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #f0ebe3', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 15, letterSpacing: -0.3 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#ff8a5c,#e8663a)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 12, fontWeight: 900 }}>B</div>
          Biodex
        </div>
        <div style={{ flex: 1, position: 'relative', maxWidth: 380, marginLeft: 8 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or ID…"
            style={{
              width: '100%', border: 'none', background: '#f4efe6', color: '#1a1410',
              padding: '8px 12px 8px 32px', borderRadius: 10, fontSize: 12, fontFamily: 'inherit',
              outline: 'none',
            }} />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#8a8278" strokeWidth="1.8"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="6" cy="6" r="4.5" /><path d="M9.5 9.5L13 13" strokeLinecap="round" /></svg>
        </div>
        <div style={{ fontSize: 11, color: '#8a8278', fontFamily: 'ui-monospace, monospace' }}>{list.length} / {CREATURES.length}</div>
        {onTeamBuilder && (
          <button onClick={onTeamBuilder} style={{
            border: 'none', cursor: 'pointer', background: '#1a1410', color: '#fff',
            padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
            letterSpacing: 0.5, fontFamily: 'inherit',
          }}>Team Builder</button>
        )}
        <div style={{ display: 'flex', background: '#f4efe6', borderRadius: 8, padding: 2 }}>
          {[['comfortable','▦'],['compact','▤'],['rows','☰']].map(([k, icon]) => (
            <button key={k} onClick={() => setDensity(k)} title={k}
              style={{
                border: 'none', cursor: 'pointer',
                background: density === k ? '#fff' : 'transparent',
                color: density === k ? '#1a1410' : '#8a8278',
                padding: '5px 10px', borderRadius: 6, fontSize: 13,
                boxShadow: density === k ? '0 1px 3px rgba(0,0,0,.06)' : 'none',
                fontFamily: 'inherit',
              }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside style={{ borderRight: '1px solid #f0ebe3', padding: 20, overflow: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8278', marginBottom: 14 }}>Filter</div>
        <FilterPanel filters={filters} setFilters={setFilters} />
      </aside>

      {/* Grid */}
      <main style={{ overflow: 'auto', padding: '20px 20px 88px' }}>
        {density === 'rows' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#f0ebe3', borderRadius: 12, overflow: 'hidden' }}>
            {list.map((c) => (
              <CreatureRow key={c.id} c={c}
                onHover={(r) => setHover(r ? { c, rect: r } : null)}
                onDragStart={(e) => startDrag(c, e)}
                onClick={() => onOpenDetail(c)} />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${cardSize}px, 1fr))`,
            gap: density === 'comfortable' ? 14 : 10,
          }}>
            {list.map((c) => (
              <CreatureCardA key={c.id} c={c} compact={density === 'compact'}
                onHover={(r) => setHover(r ? { c, rect: r } : null)}
                onDragStart={(e) => startDrag(c, e)}
                onClick={() => onOpenDetail(c)} />
            ))}
          </div>
        )}
      </main>

      {hover && !drag && <HoverPreview c={hover.c} rect={hover.rect} />}
      <DragGhost drag={drag} />
      <CompareTray tray={tray} drag={drag} onRemove={removeFromTray} onClear={clearTray} onCompare={() => onCompare && onCompare(tray)} />
    </div>
  );
}

function CreatureCardA({ c, compact, onHover, onDragStart, onClick }) {
  const ref = React.useRef(null);
  const t = TYPES[c.types[0]];
  const t2 = c.types[1] && TYPES[c.types[1]];
  const bg = t2
    ? `linear-gradient(135deg, ${t.bg} 0%, ${t.bg} 50%, ${t2.bg} 50%, ${t2.bg} 100%)`
    : `linear-gradient(160deg, ${t.bg} 0%, #faf7f1 100%)`;
  const [hovered, setH] = React.useState(false);
  return (
    <button
      ref={ref}
      onMouseEnter={() => { setH(true); onHover(ref.current.getBoundingClientRect()); }}
      onMouseLeave={() => { setH(false); onHover(null); }}
      onClick={onClick}
      onPointerDown={(e) => {
        // Only start drag on primary button; let the click fire if no movement
        if (e.button !== 0) return;
        const startX = e.clientX, startY = e.clientY;
        const move = (ev) => {
          if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 5) {
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', up);
            onDragStart(ev);
          }
        };
        const up = () => {
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerup', up);
        };
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
      }}
      style={{
        border: 'none', cursor: 'pointer', background: bg,
        padding: compact ? 10 : 14, borderRadius: compact ? 12 : 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 4 : 8,
        transition: 'transform .18s cubic-bezier(.2,.8,.2,1), box-shadow .18s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 10px 24px rgba(0,0,0,.1)' : '0 1px 2px rgba(0,0,0,.04)',
        fontFamily: 'inherit', color: '#1a1410',
        position: 'relative',
      }}>
      <div style={{ position: 'absolute', top: compact ? 6 : 10, left: compact ? 8 : 12, fontSize: 9, fontFamily: 'ui-monospace, monospace', color: '#6a6158', letterSpacing: 0.5 }}>{formatId(c.id)}</div>
      <Sprite c={c} size={compact ? 72 : 96} />
      <div style={{ fontWeight: 700, fontSize: compact ? 11 : 13, marginTop: 2 }}>{c.name}</div>
      <div style={{ display: 'flex', gap: 3 }}>
        {c.types.map((tt) => <TypePill key={tt} t={tt} size="sm" />)}
      </div>
    </button>
  );
}

function CreatureRow({ c, onHover, onDragStart, onClick }) {
  const ref = React.useRef(null);
  const total = c.hp + c.atk + c.def + c.spa + c.spd + c.spe;
  return (
    <div ref={ref}
      onMouseEnter={() => onHover(ref.current.getBoundingClientRect())}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        const sx = e.clientX, sy = e.clientY;
        const move = (ev) => {
          if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 5) {
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', up);
            onDragStart(ev);
          }
        };
        const up = () => {
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerup', up);
        };
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
      }}
      style={{
        background: '#fff', padding: '10px 14px', display: 'grid',
        gridTemplateColumns: '50px 60px 1fr 160px 140px 60px', alignItems: 'center', gap: 12,
        cursor: 'pointer', fontSize: 12,
      }}>
      <div style={{ width: 38, height: 38 }}><Sprite c={c} size={38} /></div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#8a8278' }}>{formatId(c.id)}</div>
      <div style={{ fontWeight: 700 }}>{c.name}</div>
      <div style={{ display: 'flex', gap: 4 }}>{c.types.map((tt) => <TypePill key={tt} t={tt} size="sm" />)}</div>
      <MiniStats c={c} />
      <div style={{ textAlign: 'right', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{total}</div>
    </div>
  );
}

Object.assign(window, { CatalogA });
