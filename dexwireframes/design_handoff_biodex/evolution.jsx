// Evolution tree component — horizontal chain with arrows + condition labels.

function EvolutionTree({ currentId, onSelect, compact = false }) {
  const chain = getEvolutionChain(currentId);
  if (chain.length < 2) {
    return (
      <div style={{ padding: 18, background: '#faf7f1', borderRadius: 12, color: '#8a8278', fontSize: 12, textAlign: 'center' }}>
        This creature does not evolve.
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 8 : 14, overflow: 'auto', padding: '6px 4px' }}>
      {chain.map((c, i) => (
        <React.Fragment key={c.id}>
          {i > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#8a8278', flexShrink: 0 }}>
              <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M2 6h20M16 2l5 4-5 4" />
              </svg>
              <div style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', color: '#8a8278', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                {typeof c.evolvesAt === 'number' ? `LV ${c.evolvesAt}` : c.evolvesAt || '—'}
              </div>
            </div>
          )}
          <button onClick={() => onSelect && onSelect(c.id)}
            style={{
              border: 'none', cursor: onSelect ? 'pointer' : 'default',
              background: c.id === currentId ? TYPES[c.types[0]].bg : '#fff',
              boxShadow: c.id === currentId ? `0 0 0 2px ${TYPES[c.types[0]].fg}` : '0 1px 3px rgba(0,0,0,.05)',
              borderRadius: 12, padding: compact ? '8px 10px' : '10px 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontFamily: 'inherit', color: '#1a1410', flexShrink: 0,
              transition: 'all .15s',
            }}>
            <Sprite c={c} size={compact ? 52 : 64} />
            <div style={{ fontSize: 8, fontFamily: 'ui-monospace, monospace', color: '#8a8278' }}>{formatId(c.id)}</div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>{c.name}</div>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

Object.assign(window, { EvolutionTree });
