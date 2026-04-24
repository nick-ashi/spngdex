// Original creature taxonomy — avoids trademarked names/types.
// Drop-in replacement: the Angular app can hydrate the same shape from PokeAPI.

const TYPES = {
  ember:   { label: 'Ember',   bg: '#ffd7c4', fg: '#8a3816', dot: '#e8663a' },
  tide:    { label: 'Tide',    bg: '#c8e0f4', fg: '#1f4e7a', dot: '#3d82c4' },
  verdant: { label: 'Verdant', bg: '#cfeac6', fg: '#275a2c', dot: '#57a55a' },
  volt:    { label: 'Volt',    bg: '#ffeeb3', fg: '#7a5608', dot: '#e8b320' },
  psyche:  { label: 'Psyche',  bg: '#e9d4f3', fg: '#5c2b7a', dot: '#a064cc' },
  geode:   { label: 'Geode',   bg: '#e3d9cc', fg: '#5c4a33', dot: '#a48663' },
  shadow:  { label: 'Shadow',  bg: '#d9d4e3', fg: '#39335c', dot: '#5c548a' },
  frost:   { label: 'Frost',   bg: '#d4ecef', fg: '#2a5a66', dot: '#4aa0b0' },
  aether:  { label: 'Aether',  bg: '#ffe5ea', fg: '#8a2a42', dot: '#d96a82' },
  tough:   { label: 'Tough',   bg: '#dcdcdc', fg: '#3a3a3a', dot: '#7a7a7a' },
};

// A compact seed set. Each entry mirrors the fields PokeAPI exposes.
const CREATURES = [
  { id: 1,   name: 'Sprigling', types: ['verdant'],           gen: 1, ht: 0.7, wt: 6.9,   hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45, hue: 132 },
  { id: 4,   name: 'Emberpup',  types: ['ember'],             gen: 1, ht: 0.6, wt: 8.5,   hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65, hue: 18  },
  { id: 7,   name: 'Driplet',   types: ['tide'],              gen: 1, ht: 0.5, wt: 9.0,   hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43, hue: 208 },
  { id: 25,  name: 'Zaplet',    types: ['volt'],              gen: 1, ht: 0.4, wt: 6.0,   hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90, hue: 48  },
  { id: 63,  name: 'Noggin',    types: ['psyche'],            gen: 1, ht: 0.9, wt: 19.5,  hp: 25, atk: 20, def: 15, spa: 105,spd: 55, spe: 90, hue: 290 },
  { id: 74,  name: 'Pebblor',   types: ['geode'],             gen: 1, ht: 0.4, wt: 20.0,  hp: 40, atk: 80, def: 100,spa: 30, spd: 30, spe: 20, hue: 28  },
  { id: 92,  name: 'Wraithling',types: ['shadow'],            gen: 1, ht: 1.3, wt: 0.1,   hp: 30, atk: 35, def: 30, spa: 100,spd: 35, spe: 80, hue: 265 },
  { id: 124, name: 'Glacielle', types: ['frost','psyche'],    gen: 1, ht: 1.4, wt: 40.6,  hp: 65, atk: 50, def: 35, spa: 115,spd: 95, spe: 95, hue: 192 },
  { id: 133, name: 'Tumbly',    types: ['aether'],            gen: 1, ht: 0.3, wt: 6.5,   hp: 55, atk: 55, def: 50, spa: 45, spd: 65, spe: 55, hue: 340 },
  { id: 149, name: 'Skysinew',  types: ['tide','aether'],     gen: 1, ht: 2.2, wt: 210.0, hp: 91, atk: 134,def: 95, spa: 100,spd: 100,spe: 80, hue: 225 },
  { id: 196, name: 'Solarie',   types: ['psyche'],            gen: 2, ht: 0.9, wt: 28.5,  hp: 65, atk: 65, def: 60, spa: 130,spd: 95, spe: 110,hue: 42  },
  { id: 197, name: 'Lunarie',   types: ['shadow'],            gen: 2, ht: 1.0, wt: 27.0,  hp: 95, atk: 65, def: 110,spa: 60, spd: 130,spe: 65, hue: 250 },
  { id: 212, name: 'Mantrix',   types: ['geode','tough'],     gen: 2, ht: 1.8, wt: 118.0, hp: 70, atk: 130,def: 100,spa: 55, spd: 80, spe: 65, hue: 15  },
  { id: 248, name: 'Tyraneon',  types: ['geode','shadow'],    gen: 2, ht: 2.0, wt: 202.0, hp: 100,atk: 134,def: 110,spa: 95, spd: 100,spe: 61, hue: 280 },
  { id: 282, name: 'Florai',    types: ['psyche','verdant'],  gen: 3, ht: 0.4, wt: 14.5,  hp: 70, atk: 55, def: 55, spa: 95, spd: 95, spe: 110,hue: 310 },
  { id: 302, name: 'Nyxine',    types: ['shadow','aether'],   gen: 3, ht: 0.5, wt: 11.0,  hp: 50, atk: 75, def: 75, spa: 65, spd: 65, spe: 50, hue: 295 },
  { id: 385, name: 'Solstara',  types: ['volt','psyche'],     gen: 3, ht: 0.3, wt: 2.2,   hp: 100,atk: 100,def: 100,spa: 100,spd: 100,spe: 100,hue: 58  },
  { id: 448, name: 'Roncor',    types: ['tough','psyche'],    gen: 4, ht: 1.2, wt: 54.0,  hp: 70, atk: 110,def: 70, spa: 115,spd: 70, spe: 90, hue: 200 },
  { id: 470, name: 'Veridian',  types: ['verdant'],           gen: 4, ht: 1.0, wt: 25.5,  hp: 65, atk: 110,def: 130,spa: 60, spd: 65, spe: 95, hue: 118 },
  { id: 491, name: 'Umbrial',   types: ['shadow'],            gen: 4, ht: 1.4, wt: 50.5,  hp: 70, atk: 70, def: 70, spa: 150,spd: 90, spe: 90, hue: 275 },
  { id: 555, name: 'Pyrefox',   types: ['ember'],             gen: 5, ht: 1.4, wt: 28.0,  hp: 75, atk: 105,def: 75, spa: 105,spd: 75, spe: 115,hue: 8   },
  { id: 609, name: 'Candelum',  types: ['ember','shadow'],    gen: 5, ht: 1.0, wt: 34.5,  hp: 60, atk: 55, def: 90, spa: 145,spd: 90, spe: 80, hue: 330 },
  { id: 700, name: 'Zephera',   types: ['aether'],            gen: 6, ht: 1.0, wt: 9.0,   hp: 95, atk: 65, def: 65, spa: 110,spd: 130,spe: 60, hue: 350 },
  { id: 778, name: 'Minimask',  types: ['shadow'],            gen: 7, ht: 0.2, wt: 0.7,   hp: 55, atk: 90, def: 80, spa: 50, spd: 105,spe: 50, hue: 258 },
];

const MAX_STAT = 160;
const STAT_LABELS = { hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SP.A', spd: 'SP.D', spe: 'SPE' };

// Deterministic silhouette "sprite" — a colored blob on a soft gradient disc.
// Placeholder for the real artwork; swap the <Sprite /> call site for <img>
// sourced from PokeAPI in the Angular build.
function Sprite({ c, size = 128 }) {
  const hue = c.hue;
  const t = TYPES[c.types[0]];
  const seed = c.id;
  // Simple pseudo-random blob path from seed
  const pts = [];
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 36 + ((seed * (i + 3)) % 11) - 5;
    pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]);
  }
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ') + ' Z';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`g${c.id}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={`oklch(0.92 0.12 ${hue})`} />
          <stop offset="100%" stopColor={`oklch(0.78 0.16 ${hue})`} />
        </radialGradient>
        <radialGradient id={`s${c.id}`} cx="35%" cy="35%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <path d={path} fill={`url(#g${c.id})`} />
      <path d={path} fill={`url(#s${c.id})`} />
      {/* eyes */}
      <circle cx="42" cy="46" r="3.2" fill="#1a1410" />
      <circle cx="58" cy="46" r="3.2" fill="#1a1410" />
      <circle cx="43" cy="45" r="1" fill="#fff" />
      <circle cx="59" cy="45" r="1" fill="#fff" />
    </svg>
  );
}

function TypePill({ t, size = 'md' }) {
  const type = TYPES[t];
  const s = size === 'sm' ? { fontSize: 10, padding: '2px 7px', gap: 4, dot: 4 }
          : size === 'lg' ? { fontSize: 13, padding: '5px 12px', gap: 6, dot: 6 }
          : { fontSize: 11, padding: '3px 9px', gap: 5, dot: 5 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      background: type.bg, color: type.fg,
      fontSize: s.fontSize, padding: s.padding, borderRadius: 999,
      fontWeight: 600, letterSpacing: 0.2, textTransform: 'uppercase',
      fontFamily: 'inherit',
    }}>
      <span style={{ width: s.dot, height: s.dot, borderRadius: '50%', background: type.dot }} />
      {type.label}
    </span>
  );
}

function formatId(n) { return '#' + String(n).padStart(4, '0'); }

// Evolution lines — creature id → { from?, to?, at? (level) }
// Small authored set; unseen creatures are treated as single-stage.
const EVOLUTIONS = {
  // Sprigling line (fabricated)
  1:   { to: 1001, at: 16 },
  1001:{ from: 1,  to: 1002, at: 32 },
  1002:{ from: 1001 },
  // Emberpup line
  4:   { to: 1004, at: 16 },
  1004:{ from: 4, to: 1005, at: 36 },
  1005:{ from: 1004 },
  // Driplet line
  7:   { to: 1007, at: 16 },
  1007:{ from: 7,  to: 1008, at: 36 },
  1008:{ from: 1007 },
  // Zaplet → single evo
  25:  { to: 1025, at: 'Thunder Shard' },
  1025:{ from: 25 },
  // Noggin line
  63:  { to: 1063, at: 16 },
  1063:{ from: 63, to: 1064, at: 'Trade' },
  1064:{ from: 1063 },
  // Pebblor line
  74:  { to: 1074, at: 25 },
  1074:{ from: 74, to: 1075, at: 'Trade' },
  1075:{ from: 1074 },
  // Wraithling line
  92:  { to: 1092, at: 25 },
  1092:{ from: 92, to: 1093, at: 'Trade' },
  1093:{ from: 1092 },
  // Tyraneon line
  248: { from: 1248 },
  1248:{ to: 248, at: 55, from: 1247 },
  1247:{ to: 1248, at: 30 },
};

// Fill in stand-in stage entries so previews render
const EVO_STAGES = {
  1001: { id: 1001, name: 'Sprigrove', types: ['verdant'], hue: 132 },
  1002: { id: 1002, name: 'Arborex',   types: ['verdant'], hue: 124 },
  1004: { id: 1004, name: 'Emberwolf', types: ['ember'],   hue: 14  },
  1005: { id: 1005, name: 'Inferox',   types: ['ember'],   hue: 8   },
  1007: { id: 1007, name: 'Streamlet', types: ['tide'],    hue: 212 },
  1008: { id: 1008, name: 'Torrentaur',types: ['tide'],    hue: 216 },
  1025: { id: 1025, name: 'Zapros',    types: ['volt'],    hue: 48  },
  1063: { id: 1063, name: 'Noggle',    types: ['psyche'],  hue: 286 },
  1064: { id: 1064, name: 'Cerebrium', types: ['psyche'],  hue: 282 },
  1074: { id: 1074, name: 'Pebblord',  types: ['geode'],   hue: 28  },
  1075: { id: 1075, name: 'Graniton',  types: ['geode','tough'], hue: 32 },
  1092: { id: 1092, name: 'Wraithus',  types: ['shadow'],  hue: 268 },
  1093: { id: 1093, name: 'Gloomere',  types: ['shadow'],  hue: 272 },
  1247: { id: 1247, name: 'Larrox',    types: ['geode'],   hue: 30  },
};

function getCreature(id) {
  return CREATURES.find((c) => c.id === id) || EVO_STAGES[id] || null;
}

// Return ordered array of creature objects along the evolution chain that
// includes `id`. Walks backward to the root, then forward. Each entry also
// carries `.at` — the condition to evolve INTO it (undefined for root).
function getEvolutionChain(id) {
  let root = id;
  const seen = new Set([root]);
  while (EVOLUTIONS[root] && EVOLUTIONS[root].from && !seen.has(EVOLUTIONS[root].from)) {
    root = EVOLUTIONS[root].from;
    seen.add(root);
  }
  const chain = [];
  let cur = root;
  const visited = new Set();
  while (cur && !visited.has(cur)) {
    visited.add(cur);
    const entry = getCreature(cur);
    if (!entry) break;
    const evoInto = EVOLUTIONS[cur];
    chain.push({
      ...entry,
      evolvesAt: chain.length === 0 ? null : (EVOLUTIONS[cur]?.evolvesAt ?? null),
    });
    cur = evoInto && evoInto.to;
  }
  // Fix up 'at' — it lives on the SOURCE's `to`, but we want it on the TARGET.
  for (let i = 1; i < chain.length; i++) {
    const prevId = chain[i - 1].id;
    chain[i].evolvesAt = EVOLUTIONS[prevId]?.at ?? null;
  }
  return chain;
}

Object.assign(window, { TYPES, CREATURES, MAX_STAT, STAT_LABELS, Sprite, TypePill, formatId, EVOLUTIONS, EVO_STAGES, getCreature, getEvolutionChain });
