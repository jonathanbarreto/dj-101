# dj-101 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an interactive site at `/Users/jonathanbarreto/Desktop/Projects/dj-101` that teaches the Pioneer DDJ-1000 and the rekordbox 7 UI through pulsing hotspots over real imagery, deployed to Vercel.

**Architecture:** Each *surface* (hardware, software) has exactly **one high-resolution master image**. Sections are normalized rectangles on that master, rendered as CSS crops — so zooming between overview and section is a continuous transform of the same pixels, never a crossfade between different photos. Every control carries **one coordinate pair in master space**; a single pure function maps master coords into whatever crop is on screen. Content lives in typed TypeScript data, validated by tests.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · `@astryxdesign/core` 0.2.0 (StyleX-based, consumed as a prebuilt package — no build plugin) · Vitest + Testing Library · pnpm · Vercel

---

## Context

Jonathan owns a DDJ-1000 and wants to publish an interactive guide. This fills a genuine gap: Pioneer's entire official tutorial output is **6 videos totalling 9m51s** — a launch-feature highlight reel with zero fundamentals. The manual is a parts list with no teaching. Nothing sits in between.

The site covers **two surfaces** — the DDJ-1000 hardware and the rekordbox 7 UI — because a controller is only half a system, and the mapping between hardware and screen is exactly what beginners struggle with. Cross-linking the two is the site's core teaching device.

**v1 scope:** the hardware Deck section at full depth, plus the rekordbox 7 deck panel it drives, deployed end-to-end. That makes v1 a complete story rather than half of one, and proves the cross-surface link while the scope is still small.

**Four features were requested; two ship in v1.** The **SHIFT layer toggle** (Task 7) and **reference tables** (Task 11) are in scope — both are cheap and immediately useful. **Guided lessons** and the **signal flow view** are deliberately deferred: lessons are only worth writing once enough surface is covered to walk through, and signal flow is a mixer story that should follow the mixer section rather than precede it. Both lead the post-v1 roadmap. This is sequencing, not a drop — if either is wanted in v1, it becomes Task 13.

---

## Global Constraints

- **rekordbox 7 only.** No VirtualDJ, no Serato, no software toggle, no hedging language in user-facing copy. Sources: DDJ-1000 quickstart manual (`/Users/jonathanbarreto/Downloads/DDJ-1000_DRH1656B_quickstart-manual.pdf`) and rekordbox 7.214 manual (`cdn.rekordbox.com/files/20260409151936/rekordbox7.214_manual_EN.pdf`).
- **VirtualDJ's manual may be used only for control numbering**, never for behavior. `source: 'virtualdj'` must never appear in shipped content — this is test-enforced.
- **Pin exact dependency versions.** `@astryxdesign/core@^0.2.0` and `@astryxdesign/theme-neutral@^0.2.0` from npm. Never copy the `"*"` workspace protocol out of `astryx-main/apps/example-nextjs/package.json` — it will not resolve.
- `/Users/jonathanbarreto/Desktop/Projects/astryx-main` is a **read-only reference** (Meta's Astryx, v0.1.6 locally — *older* than npm's 0.2.0). Never modify it, never depend on it by path.
- **No animation libraries.** Astryx ships none; all motion is CSS keyframes/transitions using Astryx duration and easing tokens.
- **Reduced motion is mandatory** on every animation, inline in the style object: `animationName: {default: X, '@media (prefers-reduced-motion: reduce)': 'none'}`.
- **Hotspot hit targets ≥44×44px** regardless of visible dot size.
- **One master image per surface.** Section views are CSS crops of it. Never introduce a second base image for a surface.
- All interactive components need `'use client'`.
- Commit after every task.

---

## rekordbox 7 Image Sources

Gathered and verified from **deejayplaza.com** (`/en/articles/rekordbox-performance-mode-tutorial`), all live and downloaded to scratchpad at `rb7img/` during research.

**The software master image — clean and unannotated:**

```
https://www.deejayplaza.com/en/wp-content/uploads/2024/08/rekordbox-performance-mode-screenshot.webp
```
**1200 × 634.** Full Performance mode window, 2-deck horizontal layout, two tracks loaded, dark theme. This is the only clean capture on the page and becomes `SURFACES.software.image`.

**Reference keys — annotated, never use as base images.** Every panel closeup on that site carries burned-in white numbers, red boxes and arrows. They are useless as hotspot bases but *excellent* as authoring checklists, because each number corresponds to a numbered description in the article text:

| Purpose | URL slug (same `/2024/08/` prefix) | Size |
|---|---|---|
| **11-panel layout key** | `rekordbox-performance-mode-layout2.webp` | 1300×688 |
| **Player deck key — 29 elements** | `rekordbox-performance-mode-player-deck.webp` | 1500×448 |
| Waveforms | `rekordbox-performance-mode-waveforms-left.webp` | 1600×191 |
| FX / SFX1 | `rekordbox-performance-mode-sfx1-panel.webp` | 1616×118 |
| CFX | `rekordbox-performance-mode-cfx-panel-2048x69.webp` | 2048×69 |
| Command panel | `rekordbox-performance-mode-command-panel2.webp` | 1500×38 |
| Mixer (horizontal) | `rekordbox-performance-mode-mixer-panel-horizontal2.webp` | 971×77 |
| Mixer (vertical) | `rekordbox-performance-mode-mixer-panel-players2.webp` | 134×513 |
| Sampler | `rekordbox-performance-mode-sampler2.webp` | 1600×110 |
| Track list | `rekordbox-performance-mode-track-list2.webp` | 1200×343 |
| Sources menu | `rekordbox-performance-mode-sources-menu.webp` | 240×642 |
| Recording | `rekordbox-performance-mode-recording-panel.webp` | 725×95 |
| Lighting | `rekordbox-performance-mode-lighting-panel2-2048x38.webp` | 2048×38 |
| Playlist palette | `rekordbox-performance-mode-playlist-palette-2048x48.webp` | 2048×48 |

**Resolution caveat:** 1200×634 is thin for a zoom-to-section architecture — cropping to the player deck leaves roughly 480px of source, too soft to read labels comfortably. It is good enough to build and validate against, but **Jonathan's own 2× capture is the intended replacement** and is the single highest-value software asset. Because the architecture uses one master per surface, swapping it means replacing one file and re-measuring rects.

**Attribution:** these are third-party screenshots of Pioneer's software. Recapturing them from Jonathan's own install removes any question and is the plan of record.

---

## Key Reference Facts

**The four SHIFT pad modes on the DDJ-1000 under rekordbox** are Keyboard, Pad FX 2, Beat Loop, Key Shift. (VirtualDJ's are Cue Loop, Pad FX 2, Loop, Key Cue — wrong for this site.)

**rekordbox 7 has 10 pad modes**; the DDJ-1000's four buttons reach only 8. Slicer, Sequence Call, Active Censor and Memory Cue require Pad Editor remapping. This gap is post-v1 content and a genuine differentiator.

**Hardware control numbering** (from VirtualDJ's manual, structure only): 1–31 mixer & FX, 32–55 deck, 71–85 front/rear.

**Common gotchas worth teaching:** no VINYL button (it's SHIFT+SLIP); no LOAD buttons (press the rotary); no crossfader-curve knob (software setting); 44.1kHz only — the "32-bit" figure is the D/A converter; channel strips run 3·1·2·4; CH3/CH4 are the phono-capable pair.

---

## File Structure

```
dj-101/                            ← repo root (already contains superpowers/plans/)
├── package.json, tsconfig.json, next.config.mjs, vitest.config.ts
├── public/images/
│   ├── ddj1000-master.avif        3129×1652 — hardware master
│   └── rekordbox-master.avif      rekordbox 7 Performance mode — software master
├── scripts/optimize-images.mjs    PNG → AVIF/WebP
└── src/
    ├── app/
    │   ├── layout.tsx, providers.tsx, globals.css
    │   ├── page.tsx                       home — surface picker
    │   ├── controller/page.tsx            hardware overview
    │   ├── controller/[section]/page.tsx  hardware section view
    │   ├── rekordbox/page.tsx             software overview
    │   ├── rekordbox/[section]/page.tsx   software section view
    │   ├── reference/[topic]/page.tsx     beat-fx, sound-color-fx, specs, shortcuts
    │   └── dev/coords/page.tsx            dev-only coordinate picker
    ├── components/
    │   ├── Stage.tsx              crop viewport + zoom transitions
    │   ├── Hotspot.tsx            marker + Popover wiring
    │   ├── HotspotMarker.tsx      the pulsing dot, ≥44px target
    │   ├── ControlPopover.tsx     renders a Behavior
    │   ├── ShiftToggle.tsx        + ShiftContext.tsx
    │   └── CounterpartLink.tsx    cross-surface jump
    ├── lib/
    │   ├── geometry.ts            master↔viewport coordinate math
    │   └── content.ts             lookup/query helpers
    └── content/
        ├── types.ts
        ├── surfaces.ts            master image metadata + section rects
        ├── hardware/{deck,jog-display,pad-modes}.ts
        ├── rekordbox/deck.ts
        ├── reference/{beat-fx,sound-color-fx,specs}.ts
        └── __tests__/integrity.test.ts
```

---

### Task 1: Scaffold and deploy skeleton

Prove the whole pipeline — Astryx from npm, Next build, Vercel deploy — before writing any feature code. Astryx is beta; find out now if it installs cleanly.

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitignore`
- Create: `src/app/{layout.tsx,providers.tsx,globals.css,page.tsx}`

**Interfaces:**
- Produces: `<Providers>` wrapping the app in Astryx `<Theme>`; the `@astryxdesign/core` import surface available to all later tasks.

- [ ] **Step 1: Initialize the project**

The directory already exists and contains `superpowers/plans/` — these planning documents. Do not delete or relocate them; the app scaffolds *alongside* them.

```bash
cd /Users/jonathanbarreto/Desktop/Projects/dj-101
git init
```

- [ ] **Step 2: Write `package.json` with pinned versions**

Do **not** use `"*"` — that is a workspace protocol and will not resolve outside the astryx monorepo.

```json
{
  "name": "dj-101",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@astryxdesign/core": "^0.2.0",
    "@astryxdesign/theme-neutral": "^0.2.0",
    "next": "^15.5.16",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "typescript": "^6.0.3",
    "vitest": "^4.0.0"
  }
}
```

- [ ] **Step 3: Write config files**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.mjs` — deliberately empty. Astryx ships prebuilt CSS; **no StyleX Babel plugin is needed**:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

`.gitignore`:
```
node_modules
.next
out
.env*.local
.vercel
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 4: Write the app shell**

`src/app/globals.css` — the three Astryx stylesheets, in this order:
```css
@import "@astryxdesign/core/reset.css";
@import "@astryxdesign/core/astryx.css";
@import "@astryxdesign/theme-neutral/theme.css";

html, body { max-width: 100%; overflow-x: hidden; }
```

`src/app/providers.tsx`:
```tsx
'use client';

import Link from 'next/link';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={Link}>{children}</LinkProvider>
    </Theme>
  );
}
```

`src/app/layout.tsx`:
```tsx
import type {Metadata} from 'next';
import './globals.css';
import {Providers} from './providers';

export const metadata: Metadata = {
  title: 'dj-101 — DDJ-1000 & rekordbox 7',
  description:
    'An interactive guide to the Pioneer DDJ-1000 and rekordbox 7 — what every control does and when to reach for it.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

`src/app/page.tsx`:
```tsx
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';

export default function Home() {
  return (
    <Stack direction="column" gap={4} xstyle={undefined}>
      <Text as="h1" type="heading-1">dj-101</Text>
      <Text>DDJ-1000 and rekordbox 7, explained.</Text>
    </Stack>
  );
}
```

> If `Text` or `Stack` import paths differ in 0.2.0, check the real export map: `npm view @astryxdesign/core exports`. Correct the imports rather than working around them.

- [ ] **Step 5: Install and verify the build**

```bash
cd /Users/jonathanbarreto/Desktop/Projects/dj-101
pnpm install
pnpm build
```
Expected: build succeeds. If `@astryxdesign/theme-neutral/built` fails to resolve, inspect `node_modules/@astryxdesign/theme-neutral/package.json` exports and use the correct subpath.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next 15 app on Astryx design system"
```

- [ ] **Step 7: Deploy and verify live**

```bash
pnpm dlx vercel@latest deploy
```
Open the preview URL and confirm the heading renders with Astryx typography. **Do not proceed until a deployed URL works** — pipeline problems are far cheaper to fix now than after ten tasks of content.

---

### Task 2: Content types and integrity tests

The data model is the spine. Build it test-first: content bugs (a dangling `counterpart`, a duplicate id, coordinates outside the image) are the most likely defect class and the cheapest to catch.

**Files:**
- Create: `src/content/types.ts`, `src/content/surfaces.ts`, `src/content/index.ts`
- Create: `src/content/__tests__/integrity.test.ts`, `vitest.config.ts`

**Interfaces:**
- Produces: `Surface`, `SectionId`, `Rect`, `Point`, `Behavior`, `Control`, `SurfaceSpec`; `ALL_CONTROLS: Control[]`, `SURFACES: Record<Surface, SurfaceSpec>`, `SECTIONS: Record<SectionId, SectionSpec>`.

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {environment: 'jsdom', globals: true},
  resolve: {alias: {'@': resolve(__dirname, './src')}},
});
```

- [ ] **Step 2: Write `src/content/types.ts`**

```ts
export type Surface = 'hardware' | 'software';

export type SectionId =
  // hardware — DDJ-1000
  | 'deck-left' | 'deck-right' | 'mixer' | 'fx' | 'browser' | 'rear' | 'front'
  // software — rekordbox 7 Performance mode
  | 'rb-command' | 'rb-fx' | 'rb-waveform' | 'rb-deck' | 'rb-mixer'
  | 'rb-record' | 'rb-sampler' | 'rb-lighting' | 'rb-palette'
  | 'rb-sources' | 'rb-tracklist';

/** Source of a behavioral claim. 'virtualdj' is banned in shipped content. */
export type SourceTag = 'manual' | 'rekordbox7' | 'virtualdj' | 'community';

/** Normalized point in master-image space. Both axes 0..1. */
export interface Point { x: number; y: number; }

/** Normalized rectangle in master-image space. */
export interface Rect { x: number; y: number; w: number; h: number; }

export interface Behavior {
  /** One line. Popover header. No trailing period. */
  summary: string;
  /** What it does, mechanically. Markdown. */
  detail: string;
  /** When and why you'd reach for it. Markdown. The point of this site. */
  why: string;
  tips?: string[];
  /** A misconception this control commonly causes. */
  gotcha?: string;
  source: SourceTag;
  /** rekordbox 7 plan gating, where it applies. */
  tier?: 'free' | 'subscription';
}

export type ControlKind =
  | 'button' | 'knob' | 'fader' | 'jog' | 'pad' | 'switch'
  | 'display' | 'jack' | 'panel' | 'field' | 'menu';

export interface Control {
  /** Stable, URL-addressable. Convention: `<section>-<slug>`. */
  id: string;
  /** VirtualDJ manual reference number. Structure only — never cite its behavior. */
  ref?: number;
  surface: Surface;
  section: SectionId;
  /** As printed on the unit, or as labelled in rekordbox. */
  label: string;
  /** The grey silk-screened SHIFT legend, where present. */
  shiftLegend?: string;
  kind: ControlKind;
  /** Position in master-image space. */
  at: Point;
  primary: Behavior;
  shift?: Behavior;
  related?: string[];
  /** Cross-surface link: hardware ⇄ software control ids. */
  counterpart?: string[];
}

export interface SurfaceSpec {
  id: Surface;
  /** Path under /public. */
  image: string;
  /** Intrinsic pixel size of the master image. */
  naturalWidth: number;
  naturalHeight: number;
  label: string;
  credit?: string;
}

export interface SectionSpec {
  id: SectionId;
  surface: Surface;
  label: string;
  /** Crop rect on the surface's master image. */
  rect: Rect;
  /** Where the section's marker sits on the overview. */
  marker: Point;
}
```

- [ ] **Step 3: Write `src/content/surfaces.ts` with placeholder rects**

Rect values get corrected in Task 4 using the coordinate picker. Ship structure now.

```ts
import type {SurfaceSpec, SectionSpec, Surface, SectionId} from './types';

export const SURFACES: Record<Surface, SurfaceSpec> = {
  hardware: {
    id: 'hardware',
    image: '/images/ddj1000-master.avif',
    naturalWidth: 3129,
    naturalHeight: 1652,
    label: 'Pioneer DJ DDJ-1000',
    credit:
      'Product image © AlphaTheta Corporation / Pioneer DJ, used for educational identification.',
  },
  software: {
    id: 'software',
    image: '/images/rekordbox-master.avif',
    naturalWidth: 2880,
    naturalHeight: 1800,
    label: 'rekordbox 7 — Performance mode',
  },
};

export const SECTIONS: Record<SectionId, SectionSpec> = {
  'deck-left':  {id:'deck-left',  surface:'hardware', label:'Left deck',  rect:{x:0,    y:0,    w:0.30, h:1},    marker:{x:0.15, y:0.5}},
  'deck-right': {id:'deck-right', surface:'hardware', label:'Right deck', rect:{x:0.70, y:0,    w:0.30, h:1},    marker:{x:0.85, y:0.5}},
  'mixer':      {id:'mixer',      surface:'hardware', label:'Mixer',      rect:{x:0.30, y:0,    w:0.40, h:1},    marker:{x:0.50, y:0.5}},
  'fx':         {id:'fx',         surface:'hardware', label:'Beat FX',    rect:{x:0.56, y:0.25, w:0.14, h:0.6},  marker:{x:0.63, y:0.55}},
  'browser':    {id:'browser',    surface:'hardware', label:'Browser',    rect:{x:0.22, y:0,    w:0.14, h:0.3},  marker:{x:0.29, y:0.15}},
  'rear':       {id:'rear',       surface:'hardware', label:'Rear panel', rect:{x:0,    y:0,    w:1,    h:1},    marker:{x:0.5,  y:0.05}},
  'front':      {id:'front',      surface:'hardware', label:'Front panel',rect:{x:0,    y:0,    w:1,    h:1},    marker:{x:0.5,  y:0.95}},

  // Measured off rekordbox-performance-mode-screenshot.webp (1200×634).
  // Panel order confirmed against the annotated 11-panel layout key.
  'rb-command':   {id:'rb-command',   surface:'software', label:'Command panel',    rect:{x:0,    y:0,     w:1,    h:0.047}, marker:{x:0.5,  y:0.024}},
  'rb-fx':        {id:'rb-fx',        surface:'software', label:'FX panel',         rect:{x:0,    y:0.047, w:1,    h:0.082}, marker:{x:0.5,  y:0.088}},
  'rb-waveform':  {id:'rb-waveform',  surface:'software', label:'Waveforms',        rect:{x:0,    y:0.129, w:1,    h:0.139}, marker:{x:0.5,  y:0.198}},
  'rb-deck':      {id:'rb-deck',      surface:'software', label:'Player deck',      rect:{x:0,    y:0.268, w:0.48, h:0.265}, marker:{x:0.24, y:0.40}},
  'rb-mixer':     {id:'rb-mixer',     surface:'software', label:'Mixer',            rect:{x:0.48, y:0.268, w:0.07, h:0.308}, marker:{x:0.515,y:0.42}},
  'rb-record':    {id:'rb-record',    surface:'software', label:'Record panel',     rect:{x:0.79, y:0.533, w:0.21, h:0.043}, marker:{x:0.89, y:0.555}},
  'rb-sampler':   {id:'rb-sampler',   surface:'software', label:'Sampler',          rect:{x:0,    y:0.576, w:1,    h:0.105}, marker:{x:0.5,  y:0.628}},
  'rb-lighting':  {id:'rb-lighting',  surface:'software', label:'Lighting',         rect:{x:0,    y:0.681, w:1,    h:0.048}, marker:{x:0.5,  y:0.705}},
  'rb-palette':   {id:'rb-palette',   surface:'software', label:'Playlist palette', rect:{x:0,    y:0.729, w:1,    h:0.025}, marker:{x:0.5,  y:0.741}},
  'rb-sources':   {id:'rb-sources',   surface:'software', label:'Sources',          rect:{x:0,    y:0.754, w:0.13, h:0.246}, marker:{x:0.065,y:0.877}},
  'rb-tracklist': {id:'rb-tracklist', surface:'software', label:'Track list',       rect:{x:0.13, y:0.754, w:0.87, h:0.246}, marker:{x:0.56, y:0.877}},
};
```

> These `rb-*` values are **measured**, not invented — read off the clean screenshot and checked against the annotated layout key. The hardware rects above them are still estimates and get corrected with the picker in Task 4. Note the right-hand deck (`rb-deck` mirrored at x 0.55–1.0) is deliberately omitted from v1: it's the same panel, and documenting it twice would duplicate content for no teaching gain.

- [ ] **Step 4: Write `src/content/index.ts`**

```ts
import type {Control} from './types';

// Content modules register here as they are authored.
const modules: Control[][] = [];

export const ALL_CONTROLS: Control[] = modules.flat();

export function getControl(id: string): Control | undefined {
  return ALL_CONTROLS.find((c) => c.id === id);
}

export function controlsInSection(section: string): Control[] {
  return ALL_CONTROLS.filter((c) => c.section === section);
}

export * from './types';
export * from './surfaces';
```

- [ ] **Step 5: Write the failing integrity tests**

`src/content/__tests__/integrity.test.ts`:
```ts
import {describe, it, expect} from 'vitest';
import {ALL_CONTROLS, SECTIONS, SURFACES} from '../index';

describe('content integrity', () => {
  it('has no duplicate control ids', () => {
    const ids = ALL_CONTROLS.map((c) => c.id);
    expect(ids).toHaveLength(new Set(ids).size);
  });

  it('places every control inside the unit square', () => {
    for (const c of ALL_CONTROLS) {
      expect(c.at.x, `${c.id}.x`).toBeGreaterThanOrEqual(0);
      expect(c.at.x, `${c.id}.x`).toBeLessThanOrEqual(1);
      expect(c.at.y, `${c.id}.y`).toBeGreaterThanOrEqual(0);
      expect(c.at.y, `${c.id}.y`).toBeLessThanOrEqual(1);
    }
  });

  it('assigns every control to a section on its own surface', () => {
    for (const c of ALL_CONTROLS) {
      const section = SECTIONS[c.section];
      expect(section, `${c.id} → unknown section ${c.section}`).toBeDefined();
      expect(section.surface, `${c.id} surface mismatch`).toBe(c.surface);
    }
  });

  it('places every control within its section rect', () => {
    for (const c of ALL_CONTROLS) {
      const {rect} = SECTIONS[c.section];
      expect(c.at.x, `${c.id} left of section`).toBeGreaterThanOrEqual(rect.x);
      expect(c.at.x, `${c.id} right of section`).toBeLessThanOrEqual(rect.x + rect.w);
      expect(c.at.y, `${c.id} above section`).toBeGreaterThanOrEqual(rect.y);
      expect(c.at.y, `${c.id} below section`).toBeLessThanOrEqual(rect.y + rect.h);
    }
  });

  it('resolves every related and counterpart id', () => {
    const ids = new Set(ALL_CONTROLS.map((c) => c.id));
    for (const c of ALL_CONTROLS) {
      for (const r of c.related ?? []) {
        expect(ids.has(r), `${c.id} → missing related ${r}`).toBe(true);
      }
      for (const cp of c.counterpart ?? []) {
        expect(ids.has(cp), `${c.id} → missing counterpart ${cp}`).toBe(true);
      }
    }
  });

  it('links counterparts across surfaces, not within one', () => {
    for (const c of ALL_CONTROLS) {
      for (const cp of c.counterpart ?? []) {
        const other = ALL_CONTROLS.find((x) => x.id === cp)!;
        expect(other.surface, `${c.id} ⇄ ${cp} same surface`).not.toBe(c.surface);
      }
    }
  });

  it('never cites VirtualDJ for behavior', () => {
    for (const c of ALL_CONTROLS) {
      expect(c.primary.source, `${c.id}.primary`).not.toBe('virtualdj');
      if (c.shift) expect(c.shift.source, `${c.id}.shift`).not.toBe('virtualdj');
    }
  });

  it('requires non-empty summary, detail and why on every behavior', () => {
    for (const c of ALL_CONTROLS) {
      for (const [name, b] of [['primary', c.primary], ['shift', c.shift]] as const) {
        if (!b) continue;
        expect(b.summary.length, `${c.id}.${name}.summary`).toBeGreaterThan(0);
        expect(b.detail.length, `${c.id}.${name}.detail`).toBeGreaterThan(20);
        expect(b.why.length, `${c.id}.${name}.why`).toBeGreaterThan(20);
      }
    }
  });

  it('gives a shift behavior to every control with a shift legend', () => {
    for (const c of ALL_CONTROLS.filter((x) => x.shiftLegend)) {
      expect(c.shift, `${c.id} has legend but no shift behavior`).toBeDefined();
    }
  });

  it('keeps every section rect inside its master image', () => {
    for (const s of Object.values(SECTIONS)) {
      expect(s.rect.x + s.rect.w, `${s.id} width overflow`).toBeLessThanOrEqual(1.0001);
      expect(s.rect.y + s.rect.h, `${s.id} height overflow`).toBeLessThanOrEqual(1.0001);
      expect(SURFACES[s.surface], `${s.id} unknown surface`).toBeDefined();
    }
  });
});
```

- [ ] **Step 6: Run the tests**

Run: `pnpm test`
Expected: PASS. `ALL_CONTROLS` is empty, so the per-control suites pass vacuously — the section-rect and surface tests do real work now, and the rest arm themselves as content lands. This is intentional: the suite must be green from the start so any later failure is a genuine regression.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: content model and integrity test suite"
```

---

### Task 3: Coordinate geometry

One pure function converts master-space coordinates into position within whatever crop is on screen. Everything visual depends on it, and it is trivially testable — so test it properly before anything renders.

**Files:**
- Create: `src/lib/geometry.ts`, `src/lib/__tests__/geometry.test.ts`

**Interfaces:**
- Produces: `toViewport(point: Point, rect: Rect): Point` — percentage position (0..1) within the cropped viewport; `cropStyle(rect, surface)` — inline styles positioning the master image inside a crop container; `isVisible(point, rect): boolean`.

- [ ] **Step 1: Write the failing tests**

`src/lib/__tests__/geometry.test.ts`:
```ts
import {describe, it, expect} from 'vitest';
import {toViewport, isVisible, cropStyle} from '../geometry';

const FULL = {x: 0, y: 0, w: 1, h: 1};
const RIGHT_HALF = {x: 0.5, y: 0, w: 0.5, h: 1};

describe('toViewport', () => {
  it('is the identity for a full-image crop', () => {
    expect(toViewport({x: 0.25, y: 0.75}, FULL)).toEqual({x: 0.25, y: 0.75});
  });

  it('maps a crop-relative point into viewport space', () => {
    // x=0.75 is the midpoint of the right half → 0.5 of the viewport
    expect(toViewport({x: 0.75, y: 0.5}, RIGHT_HALF)).toEqual({x: 0.5, y: 0.5});
  });

  it('maps the crop origin to the viewport origin', () => {
    expect(toViewport({x: 0.5, y: 0}, RIGHT_HALF)).toEqual({x: 0, y: 0});
  });

  it('returns values outside 0..1 for points outside the crop', () => {
    expect(toViewport({x: 0.25, y: 0.5}, RIGHT_HALF).x).toBeLessThan(0);
  });
});

describe('isVisible', () => {
  it('accepts a point inside the crop', () => {
    expect(isVisible({x: 0.75, y: 0.5}, RIGHT_HALF)).toBe(true);
  });
  it('rejects a point outside the crop', () => {
    expect(isVisible({x: 0.25, y: 0.5}, RIGHT_HALF)).toBe(false);
  });
  it('accepts a point exactly on the boundary', () => {
    expect(isVisible({x: 0.5, y: 0}, RIGHT_HALF)).toBe(true);
  });
});

describe('cropStyle', () => {
  it('scales the image so the crop fills the viewport', () => {
    // half-width crop → image must be 200% wide
    expect(cropStyle(RIGHT_HALF).width).toBe('200%');
    expect(cropStyle(RIGHT_HALF).height).toBe('100%');
  });

  it('offsets the image so the crop origin sits at the viewport origin', () => {
    // shift left by one viewport width
    expect(cropStyle(RIGHT_HALF).left).toBe('-100%');
    expect(cropStyle(RIGHT_HALF).top).toBe('0%');
  });

  it('is a no-op for a full crop', () => {
    const s = cropStyle(FULL);
    expect(s.width).toBe('100%');
    expect(s.left).toBe('-0%');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test geometry`
Expected: FAIL — `Failed to resolve import "../geometry"`.

- [ ] **Step 3: Implement `src/lib/geometry.ts`**

```ts
import type {Point, Rect} from '@/content/types';

/**
 * Convert a point in master-image space into fractional position within a
 * cropped viewport. Returns values outside 0..1 when the point falls outside
 * the crop — callers use `isVisible` to filter.
 */
export function toViewport(point: Point, rect: Rect): Point {
  return {
    x: (point.x - rect.x) / rect.w,
    y: (point.y - rect.y) / rect.h,
  };
}

export function isVisible(point: Point, rect: Rect): boolean {
  const v = toViewport(point, rect);
  return v.x >= 0 && v.x <= 1 && v.y >= 0 && v.y <= 1;
}

/**
 * Inline styles that position an absolutely-positioned master image inside a
 * relatively-positioned crop container, so `rect` exactly fills the container.
 */
export function cropStyle(rect: Rect): {
  width: string; height: string; left: string; top: string;
} {
  return {
    width: `${100 / rect.w}%`,
    height: `${100 / rect.h}%`,
    left: `${(-rect.x * 100) / rect.w}%`,
    top: `${(-rect.y * 100) / rect.h}%`,
  };
}

/** Aspect ratio of a crop, for reserving layout space. */
export function cropAspectRatio(
  rect: Rect,
  naturalWidth: number,
  naturalHeight: number,
): number {
  return (rect.w * naturalWidth) / (rect.h * naturalHeight);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test geometry`
Expected: PASS, all 10 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: master-to-viewport coordinate geometry"
```

---

### Task 4: Image pipeline and the coordinate picker

The picker must exist **before** content authoring — hand-guessing ~215 coordinate pairs is the single largest time sink in this project, and the picker reduces it to clicking.

**Files:**
- Create: `scripts/optimize-images.mjs`, `src/app/dev/coords/page.tsx`, `src/app/dev/coords/CoordPicker.tsx`
- Create: `public/images/ddj1000-master.avif` (+ `.webp`)

**Interfaces:**
- Consumes: `SURFACES`, `cropStyle`, `toViewport`.
- Produces: a dev-only UI that prints `{x, y}` master coordinates on click.

- [ ] **Step 1: Fetch and optimize the master image**

The Pioneer render is a 3.4MB PNG. Shipping it raw would badly damage LCP.

```bash
cd /Users/jonathanbarreto/Desktop/Projects/dj-101
mkdir -p public/images
curl -sL -o /tmp/ddj1000.png \
  "https://www.pioneerdj.com/product-images/1778/799393b2-2208-4e88-b7d2-d6406c154354/ddj-1000_1.png"
pnpm dlx sharp-cli -i /tmp/ddj1000.png -o public/images/ddj1000-master.avif -f avif -q 70
pnpm dlx sharp-cli -i /tmp/ddj1000.png -o public/images/ddj1000-master.webp -f webp -q 82
ls -lh public/images/
```
Expected: AVIF well under 500KB. If `sharp-cli` is unavailable, use `sips`/ImageMagick or `pnpm add -D sharp` and script it.

> **Licensing:** this image is © AlphaTheta, all rights reserved. It is a placeholder. Jonathan's own overhead photograph is the intended replacement and resolves the question entirely — see "Asset requests" below. Because everything derives from one master, swapping it later means replacing two files and re-running the picker for any section whose framing changed.

- [ ] **Step 2: Write the picker component**

`src/app/dev/coords/CoordPicker.tsx`:
```tsx
'use client';

import {useState} from 'react';
import {SURFACES, SECTIONS} from '@/content';
import {cropStyle} from '@/lib/geometry';
import type {Rect, Surface} from '@/content/types';

const FULL: Rect = {x: 0, y: 0, w: 1, h: 1};

export function CoordPicker() {
  const [surface, setSurface] = useState<Surface>('hardware');
  const [rect, setRect] = useState<Rect>(FULL);
  const [picks, setPicks] = useState<string[]>([]);
  const spec = SURFACES[surface];

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    // viewport fraction → master space
    const vx = (e.clientX - box.left) / box.width;
    const vy = (e.clientY - box.top) / box.height;
    const x = rect.x + vx * rect.w;
    const y = rect.y + vy * rect.h;
    setPicks((p) => [`at: {x: ${x.toFixed(4)}, y: ${y.toFixed(4)}},`, ...p]);
  }

  return (
    <div style={{padding: 16, fontFamily: 'monospace'}}>
      <div style={{display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap'}}>
        <select value={surface} onChange={(e) => {
          setSurface(e.target.value as Surface);
          setRect(FULL);
        }}>
          <option value="hardware">hardware</option>
          <option value="software">software</option>
        </select>
        <button onClick={() => setRect(FULL)}>full</button>
        {Object.values(SECTIONS)
          .filter((s) => s.surface === surface)
          .map((s) => (
            <button key={s.id} onClick={() => setRect(s.rect)}>{s.id}</button>
          ))}
        <button onClick={() => setPicks([])}>clear</button>
      </div>

      <div
        onClick={handleClick}
        style={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'crosshair',
          width: '100%',
          aspectRatio: `${rect.w * spec.naturalWidth} / ${rect.h * spec.naturalHeight}`,
          border: '1px solid #888',
        }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spec.image}
          alt=""
          style={{position: 'absolute', maxWidth: 'none', ...cropStyle(rect)}}
        />
      </div>

      <pre style={{marginTop: 12, maxHeight: 240, overflow: 'auto'}}>
        {picks.join('\n')}
      </pre>
    </div>
  );
}
```

`src/app/dev/coords/page.tsx`:
```tsx
import {notFound} from 'next/navigation';
import {CoordPicker} from './CoordPicker';

export default function CoordsPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <CoordPicker />;
}
```

- [ ] **Step 3: Verify the picker round-trips**

```bash
pnpm dev
```
Open `http://localhost:3000/dev/coords`. Click the exact centre of the image; the printed value must be approximately `{x: 0.5000, y: 0.5000}`. Then click a section button and click within the crop — coordinates must still be reported in **master** space, so the same physical control yields the same numbers at both zoom levels. **This round-trip is the correctness check for the whole geometry layer** — if it fails, fix it now.

- [ ] **Step 4: Correct the hardware section rects**

Using `full` view, click the corners of each hardware section and replace the placeholder rects in `src/content/surfaces.ts` with measured values. Get `deck-left` right first — it is the v1 target.

- [ ] **Step 5: Run tests and commit**

Run: `pnpm test`
Expected: PASS (section-rect bounds tests validate the new values).

```bash
git add -A
git commit -m "feat: image pipeline and dev coordinate picker"
```

---

### Task 5: Stage component

**Files:**
- Create: `src/components/Stage.tsx`, `src/components/__tests__/Stage.test.tsx`

**Interfaces:**
- Consumes: `cropStyle`, `cropAspectRatio`, `SURFACES`.
- Produces: `<Stage surface rect children />` — a crop viewport that animates between rects; children are absolutely positioned in viewport space.

- [ ] **Step 1: Write the failing test**

`src/components/__tests__/Stage.test.tsx`:
```tsx
import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {Stage} from '../Stage';

describe('Stage', () => {
  it('renders the master image for the surface', () => {
    render(<Stage surface="hardware" rect={{x: 0, y: 0, w: 1, h: 1}} />);
    const img = screen.getByRole('img', {name: /DDJ-1000/i});
    expect(img).toBeDefined();
  });

  it('scales the image to fill the viewport for a half-width crop', () => {
    render(<Stage surface="hardware" rect={{x: 0.5, y: 0, w: 0.5, h: 1}} />);
    const img = screen.getByRole('img', {name: /DDJ-1000/i}) as HTMLImageElement;
    expect(img.style.width).toBe('200%');
    expect(img.style.left).toBe('-100%');
  });

  it('renders children above the image', () => {
    render(
      <Stage surface="hardware" rect={{x: 0, y: 0, w: 1, h: 1}}>
        <span data-testid="marker" />
      </Stage>,
    );
    expect(screen.getByTestId('marker')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test Stage`
Expected: FAIL — cannot resolve `../Stage`.

- [ ] **Step 3: Implement `src/components/Stage.tsx`**

```tsx
'use client';

import Image from 'next/image';
import {SURFACES} from '@/content';
import {cropStyle, cropAspectRatio} from '@/lib/geometry';
import type {Rect, Surface} from '@/content/types';

export interface StageProps {
  surface: Surface;
  rect: Rect;
  children?: React.ReactNode;
}

export function Stage({surface, rect, children}: StageProps) {
  const spec = SURFACES[surface];
  const crop = cropStyle(rect);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        aspectRatio: String(
          cropAspectRatio(rect, spec.naturalWidth, spec.naturalHeight),
        ),
        borderRadius: 'var(--radius-container)',
        // Animate zoom between sections. Reduced motion handled below.
        transition: 'aspect-ratio var(--duration-medium) var(--ease-standard)',
      }}>
      <Image
        src={spec.image}
        alt={spec.label}
        width={spec.naturalWidth}
        height={spec.naturalHeight}
        priority
        sizes="100vw"
        style={{
          position: 'absolute',
          maxWidth: 'none',
          ...crop,
          transition:
            'width var(--duration-medium) var(--ease-standard), ' +
            'height var(--duration-medium) var(--ease-standard), ' +
            'left var(--duration-medium) var(--ease-standard), ' +
            'top var(--duration-medium) var(--ease-standard)',
        }}
      />
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Add the reduced-motion guard**

Append to `src/app/globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test Stage`
Expected: PASS.

> If `next/image` proves awkward under jsdom, assert on a `data-testid` instead of `role="img"`. Do not remove `next/image` — the LCP optimization matters more than test convenience.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Stage crop viewport with animated zoom"
```

---

### Task 6: Hotspot, marker, and popover

**Files:**
- Create: `src/components/HotspotMarker.tsx`, `src/components/Hotspot.tsx`, `src/components/ControlPopover.tsx`
- Create: `src/components/__tests__/Hotspot.test.tsx`

**Interfaces:**
- Consumes: `toViewport`, `isVisible`, `Control`, `Behavior`; Astryx `Popover` (render-prop mode) and `Markdown`.
- Produces: `<Hotspot control rect isShiftActive />`, `<ControlPopover control isShiftActive />`.

Astryx's `Popover` render-prop mode gives us `{ref, onClick, 'aria-haspopup', 'aria-expanded', 'aria-controls'}` to spread onto a custom trigger — exactly what a photo marker needs. `Markdown` takes markdown as `children: string`.

- [ ] **Step 1: Write the failing tests**

`src/components/__tests__/Hotspot.test.tsx`:
```tsx
import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Hotspot} from '../Hotspot';
import type {Control} from '@/content/types';

const control: Control = {
  id: 'deck-left-slip',
  surface: 'hardware',
  section: 'deck-left',
  label: 'SLIP',
  shiftLegend: 'VINYL',
  kind: 'button',
  at: {x: 0.1, y: 0.2},
  primary: {
    summary: 'Keeps the track playing underneath your performance',
    detail: 'Slip mode detail text long enough to pass validation.',
    why: 'Reach for it when you want to go wild and land back on the grid.',
    source: 'manual',
  },
  shift: {
    summary: 'Toggles vinyl mode on and off',
    detail: 'Vinyl mode detail text long enough to pass validation.',
    why: 'Turn it on when you want the jog top to scratch rather than bend.',
    source: 'manual',
  },
};

const FULL = {x: 0, y: 0, w: 1, h: 1};

describe('Hotspot', () => {
  it('labels the trigger with the control label', () => {
    render(<Hotspot control={control} rect={FULL} isShiftActive={false} />);
    expect(screen.getByRole('button', {name: /SLIP/})).toBeDefined();
  });

  it('positions itself using master-to-viewport mapping', () => {
    render(<Hotspot control={control} rect={{x: 0, y: 0, w: 0.5, h: 1}} isShiftActive={false} />);
    const btn = screen.getByRole('button', {name: /SLIP/});
    // x 0.1 within a half-width crop → 20%
    expect(btn.parentElement!.style.left).toBe('20%');
  });

  it('renders nothing when the control lies outside the crop', () => {
    const {container} = render(
      <Hotspot control={control} rect={{x: 0.5, y: 0, w: 0.5, h: 1}} isShiftActive={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows the shift legend as the label when shift is active', () => {
    render(<Hotspot control={control} rect={FULL} isShiftActive />);
    expect(screen.getByRole('button', {name: /VINYL/})).toBeDefined();
  });

  it('opens a popover with the primary summary on click', async () => {
    const user = userEvent.setup();
    render(<Hotspot control={control} rect={FULL} isShiftActive={false} />);
    await user.click(screen.getByRole('button', {name: /SLIP/}));
    expect(
      await screen.findByText(/Keeps the track playing underneath/),
    ).toBeDefined();
  });

  it('opens the shift behavior when shift is active', async () => {
    const user = userEvent.setup();
    render(<Hotspot control={control} rect={FULL} isShiftActive />);
    await user.click(screen.getByRole('button', {name: /VINYL/}));
    expect(await screen.findByText(/Toggles vinyl mode/)).toBeDefined();
  });
});
```

Add `@testing-library/user-event@^14.5.2` to devDependencies and install.

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test Hotspot`
Expected: FAIL — cannot resolve `../Hotspot`.

- [ ] **Step 3: Implement `src/components/HotspotMarker.tsx`**

Visible dot ~14px; hit target 44px via transparent padding. Ring-expand pulse rather than opacity-only, so it reads over busy photography.

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';

const ring = stylex.keyframes({
  '0%':   {transform: 'scale(1)',   opacity: 0.7},
  '70%':  {transform: 'scale(2.6)', opacity: 0},
  '100%': {transform: 'scale(2.6)', opacity: 0},
});

const styles = stylex.create({
  button: {
    position: 'absolute',
    top: 0, left: 0,
    transform: 'translate(-50%, -50%)',
    width: '44px', height: '44px',
    display: 'grid', placeItems: 'center',
    background: 'none', border: 'none', padding: 0,
    cursor: 'pointer',
    borderRadius: '50%',
  },
  dot: {
    position: 'relative',
    width: '14px', height: '14px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-accent)',
    boxShadow: '0 0 0 2px rgba(255,255,255,0.85)',
  },
  ring: {
    position: 'absolute', inset: 0,
    borderRadius: '50%',
    backgroundColor: 'var(--color-accent)',
    animationName: {
      default: ring,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationDuration: '2.4s',
    animationTimingFunction: 'ease-out',
    animationIterationCount: 'infinite',
    pointerEvents: 'none',
  },
  open: {backgroundColor: 'var(--color-text-primary)'},
});

export interface HotspotMarkerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  markerRef?: (el: HTMLElement | null) => void;
}

export function HotspotMarker({isOpen, markerRef, ...rest}: HotspotMarkerProps) {
  return (
    <button ref={markerRef} {...stylex.props(styles.button)} {...rest}>
      <span {...stylex.props(styles.dot, isOpen && styles.open)}>
        <span {...stylex.props(styles.ring)} aria-hidden="true" />
      </span>
    </button>
  );
}
```

> `@stylexjs/stylex` is a transitive dependency of `@astryxdesign/core`. If it does not resolve, add `"@stylexjs/stylex": "^0.19.0"` to dependencies. If StyleX turns out to require a build plugin for *our own* `stylex.create` calls (Astryx's own styles are prebuilt and unaffected), fall back to a plain CSS Module — `HotspotMarker.module.css` — with identical rules. Do **not** add a StyleX Babel plugin to `next.config.mjs`; the CSS Module route is simpler and the styling here is trivial.

- [ ] **Step 4: Implement `src/components/ControlPopover.tsx`**

```tsx
'use client';

import {Markdown} from '@astryxdesign/core/Markdown';
import {Text} from '@astryxdesign/core/Text';
import {Badge} from '@astryxdesign/core/Badge';
import {Stack} from '@astryxdesign/core/Stack';
import type {Control} from '@/content/types';
import {CounterpartLink} from './CounterpartLink';

export function ControlPopover({
  control, isShiftActive,
}: {control: Control; isShiftActive: boolean}) {
  const behavior = (isShiftActive && control.shift) || control.primary;
  const label = isShiftActive && control.shiftLegend
    ? control.shiftLegend
    : control.label;

  return (
    <Stack direction="column" gap={3}>
      <Stack direction="row" gap={2}>
        <Text type="heading-5">{label}</Text>
        {isShiftActive && control.shift ? <Badge label="SHIFT" /> : null}
        {behavior.tier === 'subscription' ? (
          <Badge label="Subscription" variant="warning" />
        ) : null}
      </Stack>

      <Text type="body">{behavior.summary}</Text>
      <Markdown headingLevelStart={6}>{behavior.detail}</Markdown>

      <Text type="label">When to use it</Text>
      <Markdown headingLevelStart={6}>{behavior.why}</Markdown>

      {behavior.gotcha ? (
        <Text type="supporting">⚠︎ {behavior.gotcha}</Text>
      ) : null}

      {behavior.tips?.length ? (
        <Markdown headingLevelStart={6}>
          {behavior.tips.map((t) => `- ${t}`).join('\n')}
        </Markdown>
      ) : null}

      {control.counterpart?.length ? (
        <CounterpartLink ids={control.counterpart} />
      ) : null}
    </Stack>
  );
}
```

- [ ] **Step 5: Implement `src/components/CounterpartLink.tsx`**

```tsx
'use client';

import Link from 'next/link';
import {getControl} from '@/content';

export function CounterpartLink({ids}: {ids: string[]}) {
  const targets = ids.map(getControl).filter(Boolean);
  if (targets.length === 0) return null;

  return (
    <>
      {targets.map((t) => {
        const base = t!.surface === 'software' ? '/rekordbox' : '/controller';
        return (
          <Link key={t!.id} href={`${base}/${t!.section}#${t!.id}`}>
            See {t!.label} on {t!.surface === 'software' ? 'screen' : 'the controller'} →
          </Link>
        );
      })}
    </>
  );
}
```

- [ ] **Step 6: Implement `src/components/Hotspot.tsx`**

```tsx
'use client';

import {useState} from 'react';
import {Popover} from '@astryxdesign/core/Popover';
import {toViewport, isVisible} from '@/lib/geometry';
import type {Control, Rect} from '@/content/types';
import {HotspotMarker} from './HotspotMarker';
import {ControlPopover} from './ControlPopover';

export interface HotspotProps {
  control: Control;
  rect: Rect;
  isShiftActive: boolean;
}

export function Hotspot({control, rect, isShiftActive}: HotspotProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (!isVisible(control.at, rect)) return null;

  const pos = toViewport(control.at, rect);
  const label = isShiftActive && control.shiftLegend
    ? control.shiftLegend
    : control.label;

  return (
    <div
      id={control.id}
      style={{
        position: 'absolute',
        left: `${pos.x * 100}%`,
        top: `${pos.y * 100}%`,
      }}>
      <Popover
        label={label}
        placement="below"
        width={340}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        content={
          <ControlPopover control={control} isShiftActive={isShiftActive} />
        }>
        {(triggerProps) => (
          <HotspotMarker
            markerRef={triggerProps.ref}
            onClick={triggerProps.onClick}
            aria-haspopup={triggerProps['aria-haspopup']}
            aria-expanded={triggerProps['aria-expanded']}
            aria-controls={triggerProps['aria-controls']}
            aria-label={label}
            isOpen={isOpen}
          />
        )}
      </Popover>
    </div>
  );
}
```

- [ ] **Step 7: Run to verify pass**

Run: `pnpm test Hotspot`
Expected: PASS, all 6 tests.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: hotspot marker, popover, and cross-surface links"
```

---

### Task 7: SHIFT context and toggle

**Files:**
- Create: `src/components/ShiftContext.tsx`, `src/components/ShiftToggle.tsx`
- Create: `src/components/__tests__/ShiftToggle.test.tsx`

**Interfaces:**
- Produces: `<ShiftProvider>`, `useShift(): {isShiftActive, setShiftActive}`, `<ShiftToggle />`.

The physical SHIFT button is the least-discovered feature on the unit — the legends are silk-screened in grey and most owners never notice them. Mirroring it in software is high teaching value for low cost. Holding the physical <kbd>Shift</kbd> key should also work.

- [ ] **Step 1: Write the failing test**

`src/components/__tests__/ShiftToggle.test.tsx`:
```tsx
import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ShiftProvider, useShift} from '../ShiftContext';
import {ShiftToggle} from '../ShiftToggle';

function Readout() {
  const {isShiftActive} = useShift();
  return <span data-testid="state">{isShiftActive ? 'on' : 'off'}</span>;
}

describe('ShiftToggle', () => {
  it('defaults to off', () => {
    render(<ShiftProvider><Readout /></ShiftProvider>);
    expect(screen.getByTestId('state').textContent).toBe('off');
  });

  it('turns on when the toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<ShiftProvider><ShiftToggle /><Readout /></ShiftProvider>);
    await user.click(screen.getByRole('switch', {name: /shift/i}));
    expect(screen.getByTestId('state').textContent).toBe('on');
  });

  it('turns back off on a second click', async () => {
    const user = userEvent.setup();
    render(<ShiftProvider><ShiftToggle /><Readout /></ShiftProvider>);
    const toggle = screen.getByRole('switch', {name: /shift/i});
    await user.click(toggle);
    await user.click(toggle);
    expect(screen.getByTestId('state').textContent).toBe('off');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test ShiftToggle`
Expected: FAIL — cannot resolve `../ShiftContext`.

- [ ] **Step 3: Implement `src/components/ShiftContext.tsx`**

```tsx
'use client';

import {createContext, useContext, useEffect, useState} from 'react';

interface ShiftValue {
  isShiftActive: boolean;
  setShiftActive: (v: boolean) => void;
}

const ShiftCtx = createContext<ShiftValue>({
  isShiftActive: false,
  setShiftActive: () => {},
});

export function ShiftProvider({children}: {children: React.ReactNode}) {
  const [isShiftActive, setShiftActive] = useState(false);

  // Holding the physical Shift key mirrors the hardware button.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftActive(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftActive(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return (
    <ShiftCtx.Provider value={{isShiftActive, setShiftActive}}>
      {children}
    </ShiftCtx.Provider>
  );
}

export const useShift = () => useContext(ShiftCtx);
```

- [ ] **Step 4: Implement `src/components/ShiftToggle.tsx`**

```tsx
'use client';

import {Switch} from '@astryxdesign/core/Switch';
import {useShift} from './ShiftContext';

export function ShiftToggle() {
  const {isShiftActive, setShiftActive} = useShift();
  return (
    <Switch
      label="SHIFT"
      isSelected={isShiftActive}
      onChange={setShiftActive}
    />
  );
}
```

> Verify `Switch`'s real prop names against `astryx-main/packages/core/src/Switch/Switch.tsx` — it must expose `role="switch"` for the test to find it. Adjust prop names to match; do not change the test's `role` query.

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test ShiftToggle`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: SHIFT layer context, toggle, and physical key binding"
```

---

### Task 8: Section and overview pages

Wire the pieces into real routes. After this task the site is functional; everything remaining is content.

**Files:**
- Create: `src/components/SurfaceView.tsx`
- Create: `src/app/controller/page.tsx`, `src/app/controller/[section]/page.tsx`
- Create: `src/app/rekordbox/page.tsx`, `src/app/rekordbox/[section]/page.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Stage`, `Hotspot`, `ShiftProvider`, `ShiftToggle`, `SECTIONS`, `controlsInSection`.
- Produces: `<SurfaceView surface sectionId? />`.

- [ ] **Step 1: Implement `src/components/SurfaceView.tsx`**

```tsx
'use client';

import Link from 'next/link';
import {SECTIONS, controlsInSection} from '@/content';
import type {SectionId, Surface} from '@/content/types';
import {Stage} from './Stage';
import {Hotspot} from './Hotspot';
import {ShiftProvider, useShift} from './ShiftContext';
import {ShiftToggle} from './ShiftToggle';

const FULL = {x: 0, y: 0, w: 1, h: 1};

function Inner({surface, sectionId}: {surface: Surface; sectionId?: SectionId}) {
  const {isShiftActive} = useShift();
  const section = sectionId ? SECTIONS[sectionId] : undefined;
  const rect = section?.rect ?? FULL;
  const base = surface === 'software' ? '/rekordbox' : '/controller';

  return (
    <>
      {surface === 'hardware' ? <ShiftToggle /> : null}

      <Stage surface={surface} rect={rect}>
        {section
          ? controlsInSection(section.id).map((c) => (
              <Hotspot
                key={c.id}
                control={c}
                rect={rect}
                isShiftActive={isShiftActive}
              />
            ))
          : Object.values(SECTIONS)
              .filter((s) => s.surface === surface)
              .map((s) => (
                <Link
                  key={s.id}
                  href={`${base}/${s.id}`}
                  style={{
                    position: 'absolute',
                    left: `${s.marker.x * 100}%`,
                    top: `${s.marker.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}>
                  {s.label}
                </Link>
              ))}
      </Stage>
    </>
  );
}

export function SurfaceView(props: {surface: Surface; sectionId?: SectionId}) {
  return (
    <ShiftProvider>
      <Inner {...props} />
    </ShiftProvider>
  );
}
```

- [ ] **Step 2: Implement the four routes**

`src/app/controller/page.tsx`:
```tsx
import {SurfaceView} from '@/components/SurfaceView';

export const metadata = {title: 'DDJ-1000 — dj-101'};

export default function ControllerPage() {
  return <SurfaceView surface="hardware" />;
}
```

`src/app/controller/[section]/page.tsx`:
```tsx
import {notFound} from 'next/navigation';
import {SECTIONS} from '@/content';
import type {SectionId} from '@/content/types';
import {SurfaceView} from '@/components/SurfaceView';

export function generateStaticParams() {
  return Object.values(SECTIONS)
    .filter((s) => s.surface === 'hardware')
    .map((s) => ({section: s.id}));
}

export default async function Section({
  params,
}: {params: Promise<{section: string}>}) {
  const {section} = await params;
  const spec = SECTIONS[section as SectionId];
  if (!spec || spec.surface !== 'hardware') notFound();
  return <SurfaceView surface="hardware" sectionId={spec.id} />;
}
```

`src/app/rekordbox/page.tsx` and `src/app/rekordbox/[section]/page.tsx` are identical with `surface="software"` and the `'software'` filter.

- [ ] **Step 3: Update the home page**

```tsx
import Link from 'next/link';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';

export default function Home() {
  return (
    <Stack direction="column" gap={4}>
      <Text as="h1" type="heading-1">dj-101</Text>
      <Text>
        An interactive guide to the Pioneer DDJ-1000 and rekordbox 7 — what
        every control does, and when to reach for it.
      </Text>
      <Link href="/controller">The controller →</Link>
      <Link href="/rekordbox">rekordbox 7 →</Link>
    </Stack>
  );
}
```

- [ ] **Step 4: Verify in the browser**

```bash
pnpm dev
```
Visit `/controller` — zone links render over the image. Click one — it navigates to the section and the view is cropped to it. No hotspots yet (no content). Confirm no horizontal body scroll at 375px width.

- [ ] **Step 5: Run tests and commit**

Run: `pnpm test && pnpm build`
Expected: both PASS.

```bash
git add -A
git commit -m "feat: surface overview and section routes"
```

---

### Task 9: Deck content — the writing

**This task is the product.** Everything before it was scaffolding. Budget real time here and resist the urge to rush: a beautiful interaction over thin content is a failed project.

**Files:**
- Create: `src/content/hardware/deck.ts`
- Modify: `src/content/index.ts` (register the module)

**Interfaces:**
- Consumes: `Control`, `Behavior`.
- Produces: `deckControls: Control[]` — 24 controls, refs 32–55, section `deck-left`.

**Quality bar — every `Behavior` must satisfy all four:**

1. `summary` — one line, no trailing period, states the function in plain language. Not the label restated.
2. `detail` — mechanically accurate, sourced from the Pioneer manual or the rekordbox 7 manual. Names what actually happens.
3. `why` — **the differentiator.** A concrete situation in which you'd reach for this. Names a musical or practical circumstance. If it could be pasted under any other control, it is not good enough.
4. `source` — `'manual'` or `'rekordbox7'`. Never `'virtualdj'`.

**Worked exemplar — match this depth for all 24:**

```ts
{
  id: 'deck-left-slip',
  ref: 42,
  surface: 'hardware',
  section: 'deck-left',
  label: 'SLIP',
  shiftLegend: 'VINYL',
  kind: 'button',
  at: {x: 0.0000, y: 0.0000}, // ← measure with /dev/coords
  primary: {
    summary: 'Keeps the track running underneath whatever you do on top',
    detail:
      'With slip on, the track carries on playing silently in the background while you scratch, loop, reverse or trigger hot cues. Release the control and playback jumps to where the track *would* have been — as if you had never touched it.',
    why:
      "Slip is what lets you take a risk in the middle of a phrase without wrecking the mix. Scratch through four bars of an intro, let go, and you land exactly on the downbeat. Without it you'd have to nudge your way back on beat, live, with the crowd listening.",
    tips: [
      'Pair it with SLIP REVERSE for a reverse burst that returns cleanly to the grid.',
      'The jog display background turns red while slip is engaged — a quick way to confirm it at a glance.',
    ],
    source: 'manual',
  },
  shift: {
    summary: 'Toggles vinyl mode for the jog top surface',
    detail:
      'With vinyl mode on, touching the top of the jog stops playback and scratches, exactly like a hand on a record. With it off, the top behaves like the outer ring and only bends pitch.',
    why:
      "Turn vinyl mode off when you're mixing long blends and keep catching the platter by accident — every brush of the top would otherwise stop the music. Turn it on the moment you want to scratch or do a spin-back.",
    gotcha:
      'There is no dedicated VINYL button on the DDJ-1000 — this is the only way to reach it, and the legend is printed in grey under SLIP.',
    source: 'manual',
  },
  counterpart: ['rb-deck-slip'],
}
```

- [ ] **Step 1: Measure all 24 deck coordinates**

```bash
pnpm dev
```
At `/dev/coords`, select the `deck-left` section and click each control in the order below, pasting results as you go. Controls 32–55: PLAY/PAUSE, CUE, SEARCH ◄◄, SEARCH ►►, MEMORY, DECK SELECT, SLIP REVERSE, LOOP IN, LOOP OUT, 4 BEAT LOOP/EXIT, QUANTIZE, SLIP, jog dial, JOG FEELING ADJUST, BEAT SYNC, TEMPO slider, MASTER TEMPO, KEY SYNC, KEY RESET, the four PAD MODE buttons, PAGE ◄►, the pad grid, rotary selector, BACK, VIEW.

- [ ] **Step 2: Write `src/content/hardware/deck.ts`**

Author all 24 controls at the exemplar's depth. Every control with a grey legend gets a `shift` behavior — the integrity suite enforces this. Reference facts for the SHIFT layer:

| Control | SHIFT does |
|---|---|
| SLIP | Vinyl mode on/off |
| QUANTIZE | WAKE UP (exit auto-standby) |
| BEAT SYNC | Set this deck as master |
| MASTER TEMPO | Cycle tempo range: ±6 / ±10 / ±16 / WIDE |
| HOT CUE | Keyboard mode |
| PAD FX1 | Pad FX 2 |
| BEAT JUMP | Beat Loop |
| SAMPLER | Key Shift |
| PAGE ◄► | Sampler bank |
| SEARCH ◄◄►► | Cue/loop call |
| MEMORY | Delete stored cue/loop |
| LOOP IN | In adjust (fine-tune with jog) |
| LOOP OUT | Out adjust / reloop |
| 4 BEAT LOOP/EXIT | Active loop toggle |
| SLIP REVERSE | Reverse (latched) |
| Jog top | Beat grid BPM adjust |
| Jog outer | Slide the whole beat grid |
| Rotary selector | Enlarge/reduce the waveform display |
| BACK | Show/hide playlist palette |
| VIEW | Jump to Related Tracks |

- [ ] **Step 3: Register the module**

In `src/content/index.ts`:
```ts
import {deckControls} from './hardware/deck';

const modules: Control[][] = [deckControls];
```

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: PASS. The integrity suite now does real work — it will fail on any control placed outside the `deck-left` rect, any missing shift behavior where a legend exists, any dangling counterpart, or any `why` under 20 characters. **Fix content, not tests.**

> `counterpart: ['rb-deck-slip']` will fail until Task 10 creates that control. Either write Task 10 first, or omit `counterpart` here and add it in Task 10. Do not weaken the test.

- [ ] **Step 5: Verify in the browser**

Visit `/controller/deck-left`. All 24 dots pulse in the right places over the photo. Click through every one. Toggle SHIFT and confirm the labels and content flip. Hold the physical Shift key — same effect.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: deck section content, controls 32-55"
```

---

### Task 10: rekordbox 7 deck panel

Completes the v1 story: the hardware deck plus the on-screen panel it drives.

**Files:**
- Create: `src/content/rekordbox/deck.ts`
- Add: `public/images/rekordbox-master.avif`
- Modify: `src/content/index.ts`, `src/content/hardware/deck.ts` (counterpart links)

**Interfaces:**
- Produces: `rbDeckControls: Control[]` — ~28 controls, section `rb-deck`, ids prefixed `rb-deck-`.

**Not blocked** — the clean 1200×634 master is available (see "rekordbox 7 Image Sources"). Jonathan's 2× recapture is a later drop-in upgrade, not a prerequisite.

- [ ] **Step 1: Fetch and optimize the software master**

```bash
cd /Users/jonathanbarreto/Desktop/Projects/dj-101
curl -sL -A "Mozilla/5.0" -o /tmp/rb7.webp \
  "https://www.deejayplaza.com/en/wp-content/uploads/2024/08/rekordbox-performance-mode-screenshot.webp"
pnpm dlx sharp-cli -i /tmp/rb7.webp -o public/images/rekordbox-master.avif -f avif -q 75
cp /tmp/rb7.webp public/images/rekordbox-master.webp
```

`SURFACES.software.naturalWidth/Height` are already `1200 / 634` — correct for this file. Verify the `rb-*` rects visually at `/dev/coords`; they were measured off this exact image but confirm before authoring.

- [ ] **Step 2: Write `src/content/rekordbox/deck.ts`**

The annotated player-deck reference key enumerates **29 elements**. Author these, ids prefixed `rb-deck-`:

| # | Element | Notes |
|---|---|---|
| 1 | Artwork | |
| 2 | Track title / artist / BPM / key | |
| 3–5 | Memory cue markers on the waveform | A/B/C/D/E lettered |
| 6 | Remaining time | |
| 7 | Elapsed time | |
| 8 | KEY SYNC | counterpart: hardware KEY SYNC |
| 9 | Key display and ±semitone | |
| 10 | BEAT SYNC | counterpart: hardware BEAT SYNC |
| 11 | MASTER | counterpart: SHIFT+BEAT SYNC |
| 12 | Enlarged waveform | |
| 13 | Playhead | |
| 14 | Phrase / stem view strip | |
| 15 | MUTE · DRUMS · VOCAL · INST | stems — `tier: 'subscription'` |
| 16 | Pad grid toggle | |
| 17 | Waveform view toggle | |
| 18 | Hot cue list (A–H) | counterpart: hardware pads in HOT CUE mode |
| 19 | Beat count | |
| 20 | ◄ ► beat halve/double | counterpart: LOOP IN 1/2X, LOOP OUT 2X |
| 21 | AU / MA — auto vs manual loop | counterpart: 4 BEAT LOOP/EXIT |
| 22 | INT — tempo range | counterpart: SHIFT+MASTER TEMPO |
| 23 | CUE | counterpart: hardware CUE |
| 24 | Play / pause | counterpart: hardware PLAY/PAUSE |
| 25 | BPM and pitch display | counterpart: TEMPO slider |
| 26 | SLIP | counterpart: hardware SLIP |
| 27 | Q — quantize | counterpart: hardware QUANTIZE |
| 28 | MT — master tempo / key lock | counterpart: hardware MASTER TEMPO |
| 29 | HOT CUE pad-mode selector | counterpart: the four PAD MODE buttons |

Same quality bar as Task 9. The `why` for a software element should explain **what it tells you or lets you do that the hardware doesn't** — otherwise it's a duplicate of the hardware entry and adds nothing.

- [ ] **Step 3: Add counterpart links on the hardware side**

Add `counterpart` arrays to the matching entries in `src/content/hardware/deck.ts` — SLIP, QUANTIZE, BEAT SYNC, KEY SYNC, MASTER TEMPO, the pad-mode buttons, loop controls.

- [ ] **Step 4: Register and test**

```ts
const modules: Control[][] = [deckControls, rbDeckControls];
```

Run: `pnpm test`
Expected: PASS — including `links counterparts across surfaces`, which now has real data to check.

- [ ] **Step 5: Verify both directions in the browser**

From `/controller/deck-left`, open SLIP and follow "See … on screen →". It must land on `/rekordbox/rb-deck#rb-deck-slip`. Follow the return link back.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: rekordbox 7 deck panel and cross-surface links"
```

---

### Task 11: Reference tables

Content is already gathered verbatim, so this is fast and high-value — it is the most searchable material on the site.

**Files:**
- Create: `src/content/reference/{beat-fx,sound-color-fx,specs}.ts`
- Create: `src/app/reference/[topic]/page.tsx`

**Where the source data lives** — you will not have prior research context, so read these first:
- **Beat FX and Sound Color FX descriptions:** DDJ-1000 Operating Instructions, `manualslib.com/manual/1436395/Pioneer-Dj-Ddj-1000.html?page=N` — Beat FX types on pages **22–23**, Sound Color FX on page **24**. Each entry gives Pioneer's own wording plus what LEVEL/DEPTH does.
- **Specifications:** `/Users/jonathanbarreto/Downloads/DDJ-1000_DRH1656B_quickstart-manual.pdf`, pages **15–16**. Extract with `pdftotext -layout`.

- [ ] **Step 1: Write the Beat FX data**

All 14 in the order printed around the selector knob: ENIGMA JET, TRANS, REVERB, SPIRAL, MT DELAY, ECHO, LOW CUT ECHO, FLANGER, PHASER, PITCH, SLIP ROLL, ROLL, MOBIUS (SAW), MOBIUS (TRI). Each needs what LEVEL/DEPTH actually controls — the part every other resource omits, and it differs per effect (for ECHO it is wet/dry balance; for TRANS it is duty ratio *and* balance; for MT DELAY it is the volume of odd- vs even-numbered delays either side of centre).

Mark the four DDJ-1000 exclusives: **Enigma Jet, Mobius Saw, Mobius Triangle, Low Cut Echo**. Worth explaining in the `description`: Mobius Saw/Tri are Shepard-tone oscillators that seem to rise or fall forever and work even with the track stopped; SLIP ROLL differs from ROLL in that playback continues underneath, so you land back on the grid.

```ts
export interface BeatFx {
  name: string;
  description: string;
  /** What the LEVEL/DEPTH knob changes for this specific effect. */
  levelDepth: string;
  isExclusive?: boolean;
}

export const beatFx: BeatFx[] = [
  {
    name: 'LOW CUT ECHO',
    description:
      'A delayed sound with the low frequency range reduced is output several times and gradually attenuated according to the beat fraction set.',
    levelDepth: 'Balance between the original sound and the echo',
    isExclusive: true,
  },
  // … ECHO, MULTI TAP DELAY, SPIRAL, REVERB, TRANS, ENIGMA JET, FLANGER,
  //   PHASER, PITCH, SLIP ROLL, ROLL, MOBIUS (SAW), MOBIUS (TRI)
];
```

- [ ] **Step 2: Write Sound Color FX and specs**

Four Sound Color FX (Dub Echo, Pitch, Noise, Filter) with what turning left vs right does. Specs: 708 × 73.4 × 361.4 mm, 6.0 kg, 44.1 kHz sampling, 32-bit D/A, 24-bit A/D, channel EQ −26 to +6 dB, full I/O list.

- [ ] **Step 3: Write the reference route**

Render each topic with Astryx `Table`. Include the correction that the 32-bit figure is the D/A converter, not the streaming bit depth.

- [ ] **Step 4: Test, build, commit**

Run: `pnpm test && pnpm build`

```bash
git add -A
git commit -m "feat: Beat FX, Sound Color FX, and specification reference"
```

---

### Task 12: Ship v1

**Files:**
- Create: `src/app/not-found.tsx`, `src/components/SiteFooter.tsx`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Add the attribution footer**

Required while any Pioneer imagery is in use:

> Product images © AlphaTheta Corporation / Pioneer DJ, used for educational identification. Pioneer DJ and DDJ-1000 are trademarks of AlphaTheta Corporation. This site is not affiliated with or endorsed by AlphaTheta.

- [ ] **Step 2: Add metadata and Open Graph tags**

- [ ] **Step 3: Run the full verification pass**

```bash
pnpm test && pnpm build
```

Then manually, in a browser:
- [ ] `/controller` → click each zone → correct section, smooth zoom
- [ ] Every deck hotspot opens with correct content
- [ ] SHIFT toggle flips all 24; physical Shift key does too
- [ ] Tab reaches every hotspot; Enter/Space opens; Escape closes; focus returns to the trigger
- [ ] DevTools → Rendering → `prefers-reduced-motion: reduce` → pulses and zooms stop, site stays fully usable
- [ ] `/controller/deck-left#deck-left-slip` deep-links correctly
- [ ] 375px / 768px / 1440px — no horizontal body scroll; hit targets stay ≥44px
- [ ] Counterpart links work in both directions
- [ ] `grep -rn "virtualdj" src/content/` → **no matches**

- [ ] **Step 4: Deploy to production**

```bash
pnpm dlx vercel@latest deploy --prod
```

- [ ] **Step 5: Verify on the deployed URL**

Test on a real phone — touch targets and pinch behavior do not survive desktop-only testing. Run Lighthouse and check LCP; if the hero image is the bottleneck, add responsive `sizes` and a lower-resolution source for small viewports.

- [ ] **Step 6: Commit and tag**

```bash
git add -A
git commit -m "feat: v1 — deck section, rekordbox deck panel, reference"
git tag v1.0.0
```

---

## Asset requests for Jonathan

**rekordbox 7 screenshot** — *not blocking; this is a quality upgrade.* A usable 1200×634 master is already sourced. One capture supersedes it:

1. **Full Performance mode window at 2× (retina)**, 2-deck horizontal layout, two tracks loaded and playing, dark theme, window maximized.

That single image replaces the entire software master. At 2400×1268 it makes the player-deck crop genuinely readable, where the current 1200px source is soft. Because sections are crops of one master, no other software screenshots are needed — capture the whole window once, well.

Avoid capturing identifying details (personal playlist names, file paths) if the site goes public.

**Photographs** — optional but they resolve the licensing question permanently:
1. **Full overhead of the unit** — tripod, straight down, even diffuse light. This one replaces the Pioneer render as the master image and makes the whole site originally-sourced. Highest value by a wide margin.
2. Pads and PAD MODE row, straight down, pads lit
3. Jog display with a real track loaded
4. Rear panel, full width, straight on
5. Front panel (headphone jacks)

Straight-down angle matters more than resolution — perspective distortion breaks hotspot accuracy. No direct flash; the brushed top plate and glossy pads both blow out.

---

## Post-v1 roadmap

Hardware mixer and FX sections → matching rekordbox mixer/FX/waveform panels → signal flow view (input select → trim → EQ → Color FX → fader → crossfader assign → master/booth, plus dual-USB changeover) → guided lessons spanning both surfaces → rear panel and connections → remaining rekordbox panels → **"Your DDJ-1000 on rekordbox 7"**: Pad Editor remapping to reach Slicer, Active Censor, Sequence Call and Memory Cue, and driving stems from the pads. That last one is the site's strongest differentiator — no other DDJ-1000 resource covers 2018 hardware against 2026 software.

---

## Risks

| Risk | Mitigation |
|---|---|
| Astryx 0.2.0 is beta; APIs may differ from the local 0.1.6 reference | Task 1 deploys before any feature work. Verify prop names against `astryx-main` source, but trust npm's package as the source of truth |
| Our own `stylex.create` calls may need a build plugin | Fall back to CSS Modules for `HotspotMarker` — noted inline in Task 6. Do not add a Babel plugin |
| ~215 coordinates is real manual labor | Picker built in Task 4, before authoring. Author strictly per-section, only for what ships |
| Content ends up thin | Task 9 carries an explicit quality bar and a worked exemplar; the `why` field is test-enforced for length and reviewed for specificity |
| Pioneer image licensing | Attribution footer for v1; Jonathan's own overhead photo is the intended resolution. Single-master architecture makes the swap cheap |
| Software master is only 1200×634 — player-deck crop will be soft | Build and validate against it; Jonathan's single 2× window capture is a drop-in replacement requiring one file swap and a rect re-check |
| Every third-party rekordbox panel image is annotated with burned-in numbers | Only `rekordbox-performance-mode-screenshot.webp` is clean and it is the only one used as a base. The annotated panels are authoring checklists only — never commit one to `public/images/` |
| 3129px hero hurts LCP | AVIF/WebP conversion in Task 4; `next/image` with `priority` and `sizes`; Lighthouse check in Task 12 |
