# Handoff: Biodex — Modern Creature Catalog (Spring Boot + Angular)

## Overview

Biodex is a modern, PokeAPI-backed creature catalog web app. This handoff bundles interactive HTML design references for the chosen visual direction ("Soft Grid") plus four connected flows: **Catalog / Index**, **Detail page**, **Compare view**, and **Team Builder**.

The target stack is **Angular (front end) + Spring Boot (back end, proxying / caching PokeAPI)**.

## About the Design Files

The HTML files in this bundle are **design references**. They're React prototypes built for iteration speed — they illustrate the intended visual language, layout, spacing, color, typography, interaction patterns, and state flows.

**The task is to recreate these designs in Angular** using the project's established component and styling conventions (SCSS modules, Angular Material or a custom design system, RxJS for async flows, etc.). Do not copy the React code. Use the HTML files as the source of truth for *what it should look like and how it should behave*; choose idiomatic Angular patterns for *how it's built*.

Back-end: create Spring Boot endpoints that proxy / shape PokeAPI responses into the JSON shape the UI expects (documented below).

## Fidelity

**High-fidelity.** Colors, typography, spacing, component sizing, and interactions are intended to be matched closely. Sprites are abstract placeholders (SVG blobs); in production, use PokeAPI's `sprites.other["official-artwork"].front_default` URL for the image. Creature names and type names in the mock are original placeholders to avoid IP — in production, use real PokeAPI data (names, types, stats, evolution chains).

## Design Tokens

### Colors

**Neutrals (Soft Grid light surface):**
- `--bg`: `#faf7f1` — page background, warm off-white
- `--surface`: `#ffffff` — card surface
- `--surface-2`: `#f4efe6` — pressed / secondary surface, input background
- `--divider`: `#f0ebe3` — subtle dividers
- `--border`: `#d4cbc0` — dashed borders, disabled
- `--ink`: `#1a1410` — primary text, high-contrast accent
- `--ink-2`: `#3a3530` — body text
- `--ink-3`: `#6a6158` — secondary text
- `--ink-4`: `#8a8278` — tertiary / labels

**Dark surface (Spec Sheet detail page):**
- `--dark-bg`: `#1f1814`
- `--dark-surface`: `#2a221d`
- `--dark-divider`: `#322a24`
- `--dark-text`: `#f4efe6`
- `--dark-text-2`: `#c4bdb2`
- `--dark-text-3`: `#8a8278`

**Types** — each has `{ label, bg, fg, dot }`. Use the dot color for solid accents, bg for card fills, fg for legible text on bg.

| Slug | Label | bg | fg | dot |
|---|---|---|---|---|
| ember | Ember | #ffd7c4 | #8a3816 | #e8663a |
| tide | Tide | #c8e0f4 | #1f4e7a | #3d82c4 |
| verdant | Verdant | #cfeac6 | #275a2c | #57a55a |
| volt | Volt | #ffeeb3 | #7a5608 | #e8b320 |
| psyche | Psyche | #e9d4f3 | #5c2b7a | #a064cc |
| geode | Geode | #e3d9cc | #5c4a33 | #a48663 |
| shadow | Shadow | #d9d4e3 | #39335c | #5c548a |
| frost | Frost | #d4ecef | #2a5a66 | #4aa0b0 |
| aether | Aether | #ffe5ea | #8a2a42 | #d96a82 |
| tough | Tough | #dcdcdc | #3a3a3a | #7a7a7a |

Map PokeAPI type slugs to these ten. (e.g. `fire→ember`, `water→tide`, `grass→verdant`, `electric→volt`, `psychic→psyche`, `rock/ground→geode`, `ghost/dark→shadow`, `ice→frost`, `fairy/flying→aether`, `fighting/steel→tough`.)

### Typography

- **UI font**: `Manrope` (Google Fonts), weights 400/500/600/700/800.
- **Monospace** (for IDs, numbers, spec-sheet labels): `ui-monospace, "SF Mono", Menlo, monospace`.
- **Type scale**:
  - Page title (hero): 28–72px, 800, letter-spacing −1 to −2.4px, line-height 1–1.05
  - Section title: 18–20px, 700, letter-spacing −0.3px
  - Body: 13px, 400, line-height 1.55
  - UI label: 11–12px, 600/700
  - Micro label (uppercase tracked): 9–11px, 700, letter-spacing 1–1.5px, uppercase, color `--ink-4`
  - Numeric (mono): 10–14px, 700, `font-variant-numeric: tabular-nums`

### Spacing & Radii

- Base unit: 4px. Typical paddings: 10 / 14 / 18 / 20 / 24 / 32.
- Corner radii: `4` (chips small), `6–8` (buttons/inputs), `10–12` (cards), `14–16` (panels), `999` (pills / type badges).
- Shadows:
  - Card rest: `0 1px 3px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.04)`
  - Card hover: `0 10px 24px rgba(0,0,0,.1)` + `translateY(-2px)`
  - Floating panel: `0 12px 40px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.04)`
  - Modal overlay: `0 20px 60px rgba(0,0,0,.3)`

### Motion

- Default ease: `cubic-bezier(.2, .8, .2, 1)`
- Hover / micro: 120–180 ms
- View transition / slide-up: 260–280 ms (opacity 0→1, translateY 16px→0)
- Stat bar fill: 900 ms
- Radar chart morph: 700 ms

## Screens / Views

### 1. Catalog / Index (Soft Grid)

**Purpose**: Browse all creatures; filter, search, toggle density, drag-to-compare, jump to detail or team builder.

**Layout**: `grid-template-columns: 230px 1fr; grid-template-rows: 56px 1fr;`
- **Top bar (56px, spans both columns)**: logo (22×22 rounded-square with gradient `linear-gradient(135deg, #ff8a5c, #e8663a)` + "B"), brand "Biodex", search input (max-width 380, `#f4efe6` bg, 10px radius, search icon), "{n} / {total}" counter (mono), density segmented control (3 icons: ▦ comfortable / ▤ compact / ☰ rows), **Team Builder** primary button (`#1a1410` bg, white text).
- **Sidebar (230px)**: filter panel — scrollable, `20px` padding, three stacked groups:
  - **Type** (10 chips, one per type, toggle; active = `fg` bg + white text, rest = `bg` + `fg` text)
  - **Generation** (7 number buttons 1–7, 28×28, `#f0ebe3` inactive / `#1a1410` white active)
  - **Min Total** (range slider 0–720 step 20, accent `#1a1410`)
- **Main grid**: padding `20px 20px 88px` (bottom padding leaves room for compare tray). In comfortable/compact, `grid-template-columns: repeat(auto-fill, minmax(150px | 108px, 1fr))` with 14px / 10px gap. In rows, a table-like stack with columns: sprite · ID · name · type pills · mini-bars · total.

**Creature card (comfortable)**:
- Background: `linear-gradient(160deg, <type.bg> 0%, #faf7f1 100%)` (single-type) or split diagonal for dual-type
- Padding 14, radius 16, centered column layout
- Contents: ID (mono, 9px, top-left absolute) · 96px blob sprite · name (13px, 700) · type pills (small)
- Hover: `translateY(-2px)`, shadow elevates, fires preview tooltip

**Hover preview** (floating panel, portal'd to body, position fixed to right of card rect):
- 220px wide, white, radius 14, shadow `0 12px 40px rgba(0,0,0,.14)`, 200ms fade-in
- ID + GEN · name · type pills · all 6 stat bars (compact) · `HT / WT / Σ total` footer row

**Drag-to-compare**:
- Pointer-down on card starts a 5px-threshold drag. Past threshold, the card is "picked up" — a floating ghost card follows cursor (portal'd, `position:fixed`, 32px sprite + name + ID).
- Drop on the compare tray (bottom of the catalog) adds creature (max 4).
- If drop is outside tray, cancel.

**Compare tray** (absolute, bottom: 16, left/right: 16):
- White, radius 16, padding `12 14`, shadow floating-panel.
- Shows `{n}/4 selected` (or empty state "Drag creatures here…").
- Each added creature → removable chip (`#f4efe6` bg, × button).
- When ≥2 selected, shows primary **Compare →** button (`#1a1410` bg, white text).
- While dragging over tray → tray bg flips to `#1a1410`, text white, label changes to "Release to add".

### 2. Detail Page (Spec Sheet treatment)

**Purpose**: View one creature's full spec. Dark-mode presentation that feels technical but approachable.

**Layout**: full-bleed dark (`#1f1814`), scrollable. Top bar (borderless, 46px) has Back button, ID breadcrumb "SPEC · #XXXX", revision date (right-aligned mono). Body: `grid-template-columns: 260px 1fr; gap: 22px; padding: 22px`.

**Left column (260px)**:
- Sprite card: `<type.bg>` filled panel, radius 10, 18px padding, 170px sprite centered.
- Below: ID+GEN microlabel, creature name (30px, 800, letter-spacing −0.8), type pills.
- Profile key-value rows (Height, Weight, Catch rate, Exp. yield) — each row: label (uppercase micro, `--ink-4`) left, mono value right, dashed bottom border.

**Right column**:
- **Stat distribution card** (`#2a221d`, radius 12, 18px padding):
  - Header: "Stat distribution" micro-label + "Σ {total} / 960 MAX" mono
  - `grid-template-columns: 220px 1fr; gap: 20px`
  - Left: hexagonal radar chart (210px, 6 axes clockwise from top: HP, ATK, DEF, SPE, SPD, SPA), 4 concentric rings at 25/50/75/100% opacity; polygon fill `rgba(cream, 0.14)` + stroke cream; animates from 0 on mount (700ms ease). Center shows "Total {N}" label.
  - Right: 6 horizontal stat bars (compact), each animates width 0→% on mount with staggered 60ms delay. Bars are cream (`#f4efe6`) on dark track (`#322a24`).
- **Evolution line card**: horizontal chain of creature buttons. Arrow between stages with condition label below ("LV 16" / "Trade" / "Thunder Shard" / etc.). Current stage is highlighted (type bg + 2px ring). Clicking a sibling pivots the page to that creature.
- **Synopsis card**: plain text, auto-generated from stats ("A fire/shadow-type specimen. Baseline metrics suggest a rapid skirmisher profile.")

### 3. Compare View (full page)

**Purpose**: Side-by-side comparison of 2–4 creatures.

**Layout**: white page (`#faf7f1`). Top bar with Back + "Side-by-side comparison · {n} selected" label.
- **Overlay radar card** (white panel, top): hexagonal radar with all creatures overlaid in distinct colors (cycle: `#e8663a`, `#3d82c4`, `#57a55a`, `#a064cc`). Legend row under chart.
- **Side-by-side grid**: `grid-template-columns: repeat({n}, 1fr); gap: 14px`.
  - Each card: white, radius 16, padding 16, × button top-right.
  - Inside: type-bg sprite panel · ID · name · type pills · stat rows with `grid-template-columns: 40px 28px 1fr`.
  - **Max highlight**: for each stat, the creature with the highest value gets a `#f4efe6` row background and its bar colored in the primary type's `dot`. Others are gray.
  - Footer: Total row (mono, also highlighted if this creature has max total).
- **Add slot**: dashed-border button if `< 4` selected.

### 4. Team Builder

**Purpose**: Assemble a 6-creature team; see type coverage, role mix, BST average.

**Layout**: `grid-template-rows: 56px 1fr; grid-template-columns: 1fr 300px` (right-side roster picker).

**Top bar**: Back · "Team Builder" · `{filled}/6` mono · Clear button.

**Main panel (left)**:
- **Slots grid**: `grid-template-columns: repeat(3, 1fr); gap: 12px`.
  - Empty slot: dashed 2px border, `+` glyph (24px), "Slot N" microlabel.
  - Filled slot: `<type.bg>` card, radius 14, padding 14, ID mono top, 64px sprite, name, type pills, `Σ total` mono. × button top-right to clear.
  - Click a slot → opens roster picker on the right focused on that slot.
- **Analysis row** (3 cards):
  - **Type coverage**: list of type chips with small count badges (`{type.dot}` colored).
  - **Role mix**: rows of `{role}: ▪▪▪▫▫▫` (6 dots, filled to count). Roles derived from stats: `spe ≥ 95 → Skirmisher`, `def/spd ≥ 100 → Anchor`, `spa ≥ 100 → Caster`, `atk ≥ 100 → Bruiser`, else → Utility.
  - **Team average**: big mono number = average BST across filled slots.

**Roster picker (right, 300px)**:
- Search input at top.
- Scrollable list: each row = sprite (30px) + name + ID + 2–3 type dots.
- Rows disabled (40% opacity) if creature already on team.
- Click a row while a slot is targeted → fills slot + closes picker.

## Interactions & Behavior

| Interaction | Trigger | Behavior |
|---|---|---|
| Hover card | pointer-enter | 180ms translate + shadow; 200ms delay shows floating preview panel |
| Click card | pointer-up (no drag) | slide-up transition to detail view (260ms) |
| Drag card | pointer-down + 5px move | ghost follows cursor; drop on tray adds to compare list |
| Compare ≥2 | click "Compare →" | slide-up to full compare view |
| Remove from tray | click × on chip | instant |
| Click evolution stage | click any non-current stage on detail | re-fetches detail for that creature, fade-in |
| Open team builder | click top-bar button | slide-up to team builder |
| Back | back button anywhere | slide-down / fade out (280ms) |
| Density toggle | click segmented control | switches grid layout instantly |

## State Management (Angular)

Recommended structure with NgRx or simple signal-based store:

- `CreatureStore` — holds full creature index (fetched lazily per generation). Signals: `all`, `byId`, `filtered`.
- `FilterStore` — `{ query, types: string[], gens: number[], minTotal: number }`. Drives `filtered`.
- `CompareTray` — `Creature[]` (max 4). Persist to localStorage.
- `Team` — `(Creature | null)[6]`. Persist to localStorage.
- `Route`:
  - `/` → catalog
  - `/creature/:id` → detail
  - `/compare?ids=1,4,25` → compare
  - `/team` → team builder (team from localStorage)

Use RxJS `switchMap` for PokeAPI calls chained through Spring Boot.

## API Shape (Spring Boot endpoints)

Recommend the front end consume this already-shaped JSON so the UI doesn't need to handle PokeAPI's nested format:

```
GET /api/creatures?gen={n}&limit=&offset=
  → { results: [CreatureSummary], total }
GET /api/creatures/{id}
  → CreatureDetail
GET /api/creatures/{id}/evolution
  → EvolutionChain
GET /api/types
  → Type[]

type CreatureSummary = {
  id: number, name: string, types: string[],
  gen: number, sprite: string,
  hp: number, atk: number, def: number, spa: number, spd: number, spe: number
}
type CreatureDetail = CreatureSummary & {
  ht: number, wt: number, catchRate: number, expYield: number,
  flavorText: string, abilities: string[]
}
type EvolutionChain = {
  stages: Array<{ id, name, sprite, types, evolvesAt: number | string | null }>
}
```

Spring Boot should **cache** PokeAPI responses aggressively (Caffeine or Redis) since PokeAPI data is effectively static.

## Files

All prototype source is under this folder:

- `Biodex Prototype.html` — entry point; loads all .jsx files
- `data.jsx` — mock creature data + type palette + sprite primitive + evolution chains
- `primitives.jsx` — StatBar, Radar, MiniStats, useCompareTrayScoped, DragGhost
- `catalog-shared.jsx` — FilterPanel, HoverPreview, CompareTray
- `catalog-a.jsx` — Soft Grid catalog (CatalogA)
- `detail-spec.jsx` — Spec Sheet detail page (with evolution tree)
- `evolution.jsx` — EvolutionTree component
- `compare.jsx` — full-page compare view + OverlayRadar
- `team.jsx` — Team Builder
- `app-softgrid.jsx` — routing shell tying the four views together
- `design-canvas.jsx` — supporting wrapper (for the mock canvas only; not needed in production)

## Assets

- **Creature sprites**: the mock uses SVG blobs (see `Sprite` in `data.jsx`). Replace with `<img src="{pokeapi artwork url}" />` in the Angular build.
- **Fonts**: Manrope (Google Fonts). Add to `index.html`.
- **Icons**: all inline SVG in the prototype — lift shapes as-is or swap for your icon library (`lucide-angular` recommended).

## Open Scope (not yet designed)

- Moves / abilities section on detail page
- Type matchup chart (defense/offense weaknesses)
- Command-K global quick search
