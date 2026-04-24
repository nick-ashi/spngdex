// App shell for the Soft Grid + Spec Sheet + Compare + Team Builder flow.
// Handles the routing between views within a single artboard.

function SoftGridApp() {
  const [view, setView] = React.useState({ kind: 'catalog' });
  // carry tray selection across views so Compare remembers them
  const openCompare = (tray) => setView({ kind: 'compare', picks: tray });
  const openTeam = (seed = []) => setView({ kind: 'team', seed });
  const openDetail = (c) => setView({ kind: 'detail', c });
  const backToCatalog = () => setView({ kind: 'catalog' });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Catalog is always mounted underneath so tray state isn't lost when
          briefly opening overlays. */}
      <CatalogA
        onOpenDetail={openDetail}
        onCompare={openCompare}
        onTeamBuilder={() => openTeam()} />

      {view.kind !== 'catalog' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 400,
          animation: 'slideUp 280ms cubic-bezier(.2,.8,.2,1)',
        }}>
          <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
          {view.kind === 'detail' && (
            <DetailSpec c={view.c} onBack={backToCatalog} onSelect={(id) => {
              const next = getCreature(id);
              if (next) setView({ kind: 'detail', c: next });
            }} />
          )}
          {view.kind === 'compare' && (
            <CompareView initial={view.picks} onBack={backToCatalog} onAdd={backToCatalog} />
          )}
          {view.kind === 'team' && (
            <TeamBuilder initial={view.seed} onBack={backToCatalog} />
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SoftGridApp });
