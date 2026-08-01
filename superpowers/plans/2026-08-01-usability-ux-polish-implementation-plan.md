# dj-101 Usability and UX Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn dj-101 into a polished, viewport-safe learning workspace with a visual home dashboard, predictable map/zoom navigation, concise hotspot previews, and complete Astryx Dialog lessons.

**Architecture:** Keep `SiteShell` as the sole application shell and make `PageFrame` the one page-level Astryx `Layout` adapter. Split the current `SurfaceView` monolith into controlled presentation components while retaining it as the canonical section/region/control state coordinator. Continue using one master image per surface; render each crop in a stable, letterboxed stage canvas so zoom changes never distort the image or move the page.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Astryx Core/Neutral 0.2.x, CSS Modules with Astryx tokens, Vitest, Testing Library, agent-browser.

**Design contract:** The audience ranges from first-time DJs to experienced DJs learning this controller. `AppShell` + `Layout` provide the frame; `ClickableCard`, `List`, `TabList`/`TabMenu`, `Popover`, and `Dialog` provide interaction. The signature interaction is the same photographed controller smoothly reframing from map to section to region while orientation remains visible. Mobile opens lessons directly; tablet/desktop use a concise preview before the full lesson. All states must remain usable with keyboard, touch, dark/light themes, and reduced motion.

---

### Task 1: Shared Dialog Test Environment and Astryx Page Frame

**Files:**
- Create: `src/test/setup.ts`
- Modify: `vitest.config.ts`
- Modify: `src/components/PageFrame.tsx`
- Modify: `src/components/PageFrame.module.css`
- Create: `src/components/__tests__/PageFrame.test.tsx`

- [ ] **Step 1: Write failing PageFrame tests**

Create a test that renders `PageFrame`, asserts exactly one element with `data-testid="page-frame"`, verifies the content remains reachable, and verifies that the frame does not add a second `main` landmark when `role` is omitted.

```tsx
it('uses one auto-height Astryx page layout without adding a second main landmark', () => {
  render(<PageFrame><p>Lesson content</p></PageFrame>);
  expect(screen.getByTestId('page-frame')).toHaveAttribute('data-layout-height', 'auto');
  expect(screen.getByText('Lesson content')).toBeVisible();
  expect(screen.queryByRole('main')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm exec vitest run src/components/__tests__/PageFrame.test.tsx --pool=threads --maxWorkers=1`

Expected: FAIL because `PageFrame` is still a CSS-only `div` and has no layout-height contract.

- [ ] **Step 3: Add a shared native Dialog shim**

Move reusable `HTMLDialogElement.showModal`/`close` behavior from local tests into `src/test/setup.ts`, preserving `open`, `returnValue`, and `close` event behavior. Configure:

```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test/setup.ts'],
}
```

Do not add production-only methods or mock Astryx components.

- [ ] **Step 4: Implement PageFrame with documented Astryx 0.2.0 APIs**

Use imports from `@astryxdesign/core/Layout` and this composition:

```tsx
<Layout
  height="auto"
  contentWidth="1440px"
  content={
    <LayoutContent isScrollable={false} role={role} padding={0}>
      <div className={styles.frame} data-testid="page-frame" data-layout-height="auto">
        {children}
      </div>
    </LayoutContent>
  }
/>
```

Expose optional `role?: AriaRole`; default it to `undefined` so `SiteShell` remains the only primary landmark. Keep all width/padding in `PageFrame.module.css` using Astryx tokens.

- [ ] **Step 5: Verify GREEN and commit**

Run:

```bash
pnpm exec vitest run src/components/__tests__/PageFrame.test.tsx src/components/__tests__/SiteShell.test.tsx --pool=threads --maxWorkers=1
pnpm typecheck
git add vitest.config.ts src/test/setup.ts src/components/PageFrame.tsx src/components/PageFrame.module.css src/components/__tests__/PageFrame.test.tsx
git commit -m "refactor: compose pages with Astryx layout"
```

Expected: focused tests and typecheck pass.

### Task 2: Visual Learning Dashboard

**Files:**
- Create: `src/components/LearningDashboard.tsx`
- Create: `src/components/LearningDashboard.module.css`
- Create: `src/components/__tests__/LearningDashboard.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/__tests__/routes.test.tsx`

- [ ] **Step 1: Write failing dashboard tests**

Test the product outcomes instead of implementation internals:

```tsx
it('offers two visual learning paths and a quieter three-link reference library', () => {
  render(<LearningDashboard />);
  expect(screen.getByRole('link', {name: /Learn the controller/})).toHaveAttribute('href', '/controller');
  expect(screen.getByRole('link', {name: /Learn rekordbox 7/})).toHaveAttribute('href', '/rekordbox');
  expect(screen.getAllByRole('img')).toHaveLength(2);
  expect(screen.getByRole('link', {name: /Beat FX/})).toHaveAttribute('href', '/reference/beat-fx');
  expect(screen.getByRole('link', {name: /Sound Color FX/})).toHaveAttribute('href', '/reference/sound-color-fx');
  expect(screen.getByRole('link', {name: /Specifications/})).toHaveAttribute('href', '/reference/specs');
});
```

Also assert image sources equal `SURFACES.hardware.image` and `SURFACES.software.image`; no new base image is allowed.

- [ ] **Step 2: Run the tests and verify RED**

Run: `pnpm exec vitest run src/components/__tests__/LearningDashboard.test.tsx src/app/__tests__/routes.test.tsx --pool=threads --maxWorkers=1`

Expected: FAIL because `LearningDashboard` does not exist and Home is still a full-width `List`.

- [ ] **Step 3: Implement the dashboard**

Build a concise hero, then a two-card `Grid`. Each `ClickableCard` receives a real `href`, accessible `label`, existing master-image crop, outcome statement, and one plain action label. Use `Heading`, `Text`, `Stack`, `Grid`, `ClickableCard`, `List`, and `ListItem`; do not add decorative badges, nested cards, gradients, or raw interactive elements.

The controller card is first and visually primary through grid span/size, not status color. Below it, render one `List` titled “Reference library” with exactly the three routes above.

- [ ] **Step 4: Replace the Home implementation and verify GREEN**

Make `src/app/page.tsx` render `<LearningDashboard />` inside `<PageFrame>`. Run:

```bash
pnpm exec vitest run src/components/__tests__/LearningDashboard.test.tsx src/app/__tests__/routes.test.tsx --pool=threads --maxWorkers=1
pnpm typecheck
git add src/components/LearningDashboard.tsx src/components/LearningDashboard.module.css src/components/__tests__/LearningDashboard.test.tsx src/app/page.tsx src/app/__tests__/routes.test.tsx
git commit -m "feat: add visual learning dashboard"
```

Expected: tests and typecheck pass; public routes are unchanged.

### Task 3: Split Concise Preview from Complete Dialog Lesson

**Files:**
- Create: `src/components/ControlLesson.tsx`
- Create: `src/components/ControlPreview.tsx`
- Create: `src/components/ControlLessonDialog.tsx`
- Create: `src/components/ControlLessonDialog.module.css`
- Create: `src/components/__tests__/ControlLesson.test.tsx`
- Create: `src/components/__tests__/ControlPreview.test.tsx`
- Create: `src/components/__tests__/ControlLessonDialog.test.tsx`
- Delete: `src/components/ControlPopover.tsx`
- Delete: `src/components/__tests__/ControlPopover.test.tsx`

- [ ] **Step 1: Write failing renderer and preview tests**

`ControlLesson` must render label, Shift/subscription badges, summary, detail Markdown, why, gotcha, every tip, counterpart, references, and a readable source label (`manual` → “DDJ-1000 manual”, `rekordbox7` → “rekordbox 7 documentation”, `community` → “Community-verified workflow”).

`ControlPreview` has this controlled API:

```ts
interface ControlPreviewProps {
  control: Control;
  isShiftActive: boolean;
  onReadLesson: () => void;
  onClose: () => void;
}
```

Assert it contains label, Shift badge where applicable, summary, a “Physical action” sentence, `Read full lesson`, and `Close`; assert it does not contain why, gotcha, tips, counterpart, sources, or reference links.

The physical action is a deterministic, content-preserving preview: strip Markdown syntax from the first non-heading sentence of `behavior.detail`, stop at the first sentence boundary, and cap display with CSS line clamping rather than mutating source copy.

- [ ] **Step 2: Run renderer/preview tests and verify RED**

Run: `pnpm exec vitest run src/components/__tests__/ControlLesson.test.tsx src/components/__tests__/ControlPreview.test.tsx --pool=threads --maxWorkers=1`

Expected: FAIL because the split components do not exist.

- [ ] **Step 3: Implement the two renderers**

Move the complete lesson behavior from `ControlPopover` to `ControlLesson`, add the source row, and keep heading levels compatible with a Dialog header (`ControlLesson` body Markdown starts at level 3 and does not own the dialog title). Implement `ControlPreview` only with Astryx `Stack`, `Heading`, `Text`, `Badge`, and `Button`.

- [ ] **Step 4: Write failing Dialog tests**

Use this API:

```ts
interface ControlLessonDialogProps {
  control: Control | null;
  isShiftActive: boolean;
  isOpen: boolean;
  isFullscreen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
```

Assert one Astryx Dialog, visible `DialogHeader`, `purpose="info"`, standard/fullscreen variant selection, one `data-testid="lesson-scroll-container"`, complete lesson content, explicit Close, and `onOpenChange(false)` for Escape/native close. Re-rendering with another control must replace content without adding a second dialog.

- [ ] **Step 5: Implement Dialog with one scroll owner**

Use `Dialog` + `DialogHeader` from `@astryxdesign/core/Dialog` and `Layout` + `LayoutContent` from `@astryxdesign/core/Layout`. The Dialog child is one `Layout` with its `header` slot set to `<DialogHeader title={label} onOpenChange={onOpenChange} />` and its `content` slot set to the lesson-bearing `LayoutContent`. Set `width="min(720px, calc(100vw - 2 * var(--spacing-4)))"`, `maxHeight="calc(100dvh - 2 * var(--spacing-4))"`, `variant={isFullscreen ? 'fullscreen' : 'standard'}`, and `purpose="info"`. `LayoutContent` is the only scrollable body; CSS keeps header/close visible and adds no second overflow container.

- [ ] **Step 6: Verify GREEN and commit**

Run:

```bash
pnpm exec vitest run src/components/__tests__/ControlLesson.test.tsx src/components/__tests__/ControlPreview.test.tsx src/components/__tests__/ControlLessonDialog.test.tsx --pool=threads --maxWorkers=1
pnpm typecheck
git add src/components/ControlLesson.tsx src/components/ControlPreview.tsx src/components/ControlLessonDialog.tsx src/components/ControlLessonDialog.module.css src/components/__tests__/ControlLesson.test.tsx src/components/__tests__/ControlPreview.test.tsx src/components/__tests__/ControlLessonDialog.test.tsx src/components/ControlPopover.tsx src/components/__tests__/ControlPopover.test.tsx
git commit -m "feat: move complete lessons into Astryx dialogs"
```

Expected: all focused tests and typecheck pass.

### Task 4: Resume State and Surface Navigation

**Files:**
- Create: `src/lib/resume-state.ts`
- Create: `src/lib/__tests__/resume-state.test.ts`
- Create: `src/components/SurfaceNavigator.tsx`
- Create: `src/components/SurfaceNavigator.module.css`
- Create: `src/components/__tests__/SurfaceNavigator.test.tsx`

- [ ] **Step 1: Write failing resume-state tests**

Define the public contract:

```ts
export interface ResumeTarget {
  surface: Surface;
  sectionId: SectionId;
  controlId?: string;
}
export function saveResumeTarget(target: ResumeTarget): void;
export function readResumeTarget(surface: Surface): ResumeTarget | null;
export function resumeHref(target: ResumeTarget): string;
```

Tests must cover valid save/read, server/no-storage fallback, malformed JSON, stale section, wrong surface, unknown control, control/section mismatch, and URL encoding. Invalid stored data is removed. Region is inferred from the control owner and is not duplicated in storage.

- [ ] **Step 2: Run and verify RED, then implement minimal validation**

Run: `pnpm exec vitest run src/lib/__tests__/resume-state.test.ts --pool=threads --maxWorkers=1`

Expected: FAIL because the module does not exist. Implement against `SECTIONS` and `getControl`, under one versioned session key such as `dj101:resume:v1`.

- [ ] **Step 3: Write failing SurfaceNavigator tests**

Use one controlled API containing `surface`, `section`, `activeRegionId`, `regions`, `onRegionChange`, and optional `resumeTarget`. Assert:

- hierarchy text follows `Full controller map / Section / Region / Control` without adding a second global breadcrumb;
- `View map` targets `/controller` or `/rekordbox`;
- Resume uses `resumeHref`;
- deck and rekordbox show all fitting `Tab` values;
- mixer shows direct tabs for Signal path, CH3, CH1, CH2, CH4 and one `TabMenu` containing Color FX, Outputs, Headphones + sampler, and Mic;
- selecting any direct or overflow value calls `onRegionChange` and selected overflow text is visible.

- [ ] **Step 4: Implement navigation using Astryx components**

Use `PageBreadcrumbs` for the orientation path, `Button` or `Link` for View map/Resume, and `TabList`/`Tab`/`TabMenu` for regions. Do not horizontally scroll the mixer region list. Every region remains keyboard reachable through Astryx’s roving focus/menu behavior.

- [ ] **Step 5: Verify GREEN and commit**

Run:

```bash
pnpm exec vitest run src/lib/__tests__/resume-state.test.ts src/components/__tests__/SurfaceNavigator.test.tsx --pool=threads --maxWorkers=1
pnpm typecheck
git add src/lib/resume-state.ts src/lib/__tests__/resume-state.test.ts src/components/SurfaceNavigator.tsx src/components/SurfaceNavigator.module.css src/components/__tests__/SurfaceNavigator.test.tsx
git commit -m "feat: add map resume and surface navigation"
```

### Task 5: Stable One-Image Zoom Stage

**Files:**
- Modify: `src/components/Stage.tsx`
- Create: `src/components/Stage.module.css`
- Modify: `src/components/__tests__/Stage.test.tsx`
- Modify: `src/lib/geometry.ts`
- Modify: `src/lib/__tests__/geometry.test.ts`

- [ ] **Step 1: Write failing geometry and Stage tests**

Add a `cropCanvasStyle(rect, naturalWidth, naturalHeight)` helper returning a natural crop aspect ratio and image crop positioning. Tests assert that full, section, and tall region crops preserve the master image ratio mathematically and never request a second image.

Stage tests assert:

```tsx
expect(screen.getByTestId('stage')).toHaveAttribute('data-stable-stage', 'true');
expect(screen.getByTestId('stage-canvas')).toHaveStyle({aspectRatio: expected});
expect(screen.getAllByRole('img')).toHaveLength(1);
```

Re-rendering with a different rect must leave the outer stage’s style/class unchanged while changing only the inner canvas/image crop. There must be no `aspect-ratio` transition on the outer stage and no initial FULL-image requestAnimationFrame state.

- [ ] **Step 2: Run tests and verify RED**

Run: `pnpm exec vitest run src/components/__tests__/Stage.test.tsx src/lib/__tests__/geometry.test.ts --pool=threads --maxWorkers=1`

Expected: FAIL because Stage currently changes its outer aspect ratio on every crop.

- [ ] **Step 3: Implement the stable stage**

Use a fixed viewport-budgeted outer frame and a centered inner crop canvas:

```css
.stage { min-block-size: clamp(20rem, 56dvh, 46rem); display:grid; place-items:center; overflow:hidden; }
.canvas { position:relative; inline-size:100%; max-block-size:100%; overflow:hidden; }
@media (max-width:767px) { .stage { min-block-size:clamp(16rem, 44dvh, 28rem); } }
@media (prefers-reduced-motion:reduce) { .image, .hotspot { transition:none; } }
```

The canvas uses its crop aspect ratio with `max-inline-size`/`max-block-size` containment; the master image keeps intrinsic proportions. Children/hotspots render inside the canvas so `toViewport` remains correct. Use only CSS transitions with Astryx duration/easing tokens.

- [ ] **Step 4: Verify GREEN and commit**

Run:

```bash
pnpm exec vitest run src/components/__tests__/Stage.test.tsx src/lib/__tests__/geometry.test.ts --pool=threads --maxWorkers=1
pnpm typecheck
git add src/components/Stage.tsx src/components/Stage.module.css src/components/__tests__/Stage.test.tsx src/lib/geometry.ts src/lib/__tests__/geometry.test.ts
git commit -m "feat: stabilize controller zoom stage"
```

### Task 6: Controlled Hotspots, Dialogs, and Discoverable Control Index

**Files:**
- Modify: `src/components/Hotspot.tsx`
- Modify: `src/components/__tests__/Hotspot.test.tsx`
- Create: `src/components/ControlIndex.tsx`
- Create: `src/components/__tests__/ControlIndex.test.tsx`
- Modify: `src/components/SurfaceView.tsx`
- Modify: `src/components/SurfaceView.module.css`
- Modify: `src/components/__tests__/SurfaceView.test.tsx`

- [ ] **Step 1: Write failing Hotspot and ControlIndex tests**

Make Hotspot fully controlled:

```ts
interface HotspotProps {
  control: Control;
  rect: Rect;
  isShiftActive: boolean;
  isSelected: boolean;
  isPreviewOpen: boolean;
  onPreviewOpenChange: (isOpen: boolean) => void;
  onReadLesson: () => void;
  markerOffset?: Point;
}
```

Assert it renders `ControlPreview`, never the complete lesson, exposes selected state, and delegates focus restoration to its controlling parent.

`ControlIndex` receives controls/selection and `onSelect(controlId, trigger)`; assert every control is visible at mobile/tablet/desktop DOM widths and selection passes the actual initiating button for focus return.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `pnpm exec vitest run src/components/__tests__/Hotspot.test.tsx src/components/__tests__/ControlIndex.test.tsx --pool=threads --maxWorkers=1`

Expected: FAIL because Hotspot still owns open state and embeds the full lesson; `ControlIndex` does not exist.

- [ ] **Step 3: Implement Hotspot and ControlIndex**

Keep Astryx Popover’s automatic flip/slide behavior. Remove the hard-coded `placement="below"`; set a bounded width and preview-only content. Retain 44px targets, printed hardware labels, leader lines, and token motion. Keep the index rendered below the stage at every breakpoint; CSS may make it compact but must never `display:none` at 768px or wider.

- [ ] **Step 4: Replace SurfaceView state tests with the approved state machine**

Test `selectedControlId` plus `overlayMode: 'none' | 'preview' | 'lesson'` through public behavior:

- hotspot click writes matching hash and opens preview on desktop/tablet;
- Read full lesson keeps hash and opens exactly one Dialog;
- index selection writes hash and opens Dialog directly;
- direct valid hash resolves owning region and opens Dialog after hydration;
- mobile control selection and valid hash open Dialog directly, never preview;
- viewport change while preview is open preserves control and changes to mobile Dialog;
- Escape/Close clear only the matching hash and return focus to hotspot, falling back to matching index trigger if the hotspot disappears;
- opening another control replaces lesson without stacking;
- region change closes overlay, clears matching hash, and focuses the new region trigger;
- malformed/unknown hashes remain safe;
- View map saves resume state before navigation.

- [ ] **Step 5: Refactor SurfaceView around centralized transitions**

Use one selected control ID, one overlay mode, and one stored trigger ref. Render `SurfaceNavigator`, stable `Stage`, controlled hotspots, `ControlLessonDialog`, and `ControlIndex`. Initialize the crop directly from the resolved section/region instead of FULL + requestAnimationFrame. Preserve existing section-specific signal-flow, FX, browser, connections, Shift, and counterpart behavior.

Hash updates remain `replaceState`, so browser Back continues to mean route history rather than stepping through every hotspot. Listen to both `hashchange` and route-driven initial hydration; do not introduce phantom history entries.

- [ ] **Step 6: Verify GREEN and commit**

Run:

```bash
pnpm exec vitest run src/components/__tests__/Hotspot.test.tsx src/components/__tests__/ControlIndex.test.tsx src/components/__tests__/SurfaceView.test.tsx --pool=threads --maxWorkers=1
pnpm typecheck
git add src/components/Hotspot.tsx src/components/__tests__/Hotspot.test.tsx src/components/ControlIndex.tsx src/components/__tests__/ControlIndex.test.tsx src/components/SurfaceView.tsx src/components/SurfaceView.module.css src/components/__tests__/SurfaceView.test.tsx
git commit -m "feat: coordinate viewport-safe surface lessons"
```

### Task 7: Route Composition and Responsive UX Polish

**Files:**
- Modify: `src/app/controller/page.tsx`
- Modify: `src/app/controller/[section]/page.tsx`
- Modify: `src/app/rekordbox/page.tsx`
- Modify: `src/app/rekordbox/[section]/page.tsx`
- Modify: `src/app/__tests__/routes.test.tsx`
- Modify: `src/components/PageBreadcrumbs.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write failing route composition tests**

For controller and rekordbox map/section routes, assert one page heading, one local orientation trail, View map on section routes, Resume on maps after a valid stored target, exact existing URLs, and no duplicate breadcrumbs. Assert rear/front connection routes retain their current content and do not receive irrelevant hotspot navigation.

- [ ] **Step 2: Run and verify RED**

Run: `pnpm exec vitest run src/app/__tests__/routes.test.tsx src/app/__tests__/reference-routes.test.tsx --pool=threads --maxWorkers=1`

Expected: FAIL because route pages currently own breadcrumbs that duplicate the new workspace navigator.

- [ ] **Step 3: Implement route composition**

Keep route headings/intros in `PageFrame`; let `SurfaceView` own local map/section/region/control orientation. Map pages read and display validated resume targets through `SurfaceNavigator`. Do not change route slugs, static generation, metadata, factual content, or connection/reference page structure.

Global CSS changes are limited to focus visibility, viewport containment, and token-backed base behavior. Do not add raw colors, magic shadows/radii, animation libraries, or broad Astryx selector overrides.

- [ ] **Step 4: Run the complete automated suite and commit**

Run:

```bash
pnpm exec vitest run --pool=threads --maxWorkers=1
pnpm typecheck
pnpm build
git add src/app/controller/page.tsx 'src/app/controller/[section]/page.tsx' src/app/rekordbox/page.tsx 'src/app/rekordbox/[section]/page.tsx' src/app/__tests__/routes.test.tsx src/components/PageBreadcrumbs.tsx src/app/globals.css
git commit -m "refactor: clarify learning route hierarchy"
```

Expected: all tests, typecheck, and the 21-route production build pass.

### Task 8: Browser Usability, Accessibility, and Production Readiness Loop

**Files:**
- Modify only files implicated by a reproduced defect.
- Add a focused regression test before every fix.

- [ ] **Step 1: Start the production server and verify the real flows**

Run `pnpm build`, then `pnpm start --hostname 127.0.0.1 --port 3101`. Use agent-browser at 375, 768, 1024, and 1440px for Home, controller map, left deck, mixer, rekordbox map, and rekordbox player deck.

At each width verify no clipping or horizontal document overflow; stage height stability across all regions; preview/Dialog behavior; every lesson field reachable; map/resume; browser Back; keyboard focus return; Shift state; mixer TabMenu; light/dark themes; and reduced motion.

- [ ] **Step 2: Capture and critique screenshots**

Capture Home, controller map, a hotspot preview, a long lesson Dialog, mixer overflow, and the mobile lesson. Compare against the approved spec and Astryx rules. Remove one nonessential visual treatment if the page has redundant decoration. Any defect must first receive a focused failing unit test or an agent-browser reproduction note, then the smallest fix.

- [ ] **Step 3: Run two unchanged-code release rounds**

Each round runs:

```bash
pnpm exec vitest run --pool=threads --maxWorkers=1
pnpm typecheck
pnpm build
git diff --check
```

Also verify `rg` scans for competitor software in shipped content, accidental second base images, hardcoded color literals in changed UI files, and forbidden path dependencies on `astryx-main`. Both rounds must pass without code changes between them.

- [ ] **Step 4: Run security and final reviews**

Run `pnpm audit --prod`, then dispatch one full spec-compliance review and one full code-quality/content/accessibility review over the entire implementation range. Fix every Critical or Important finding with RED→GREEN regression coverage and re-run both reviewers until approved.

The known stable-Next PostCSS/Sharp audit findings block promotion of this revised build. Do not add semver-violating overrides, upgrade to Next canary, or deploy without explicit architecture approval. Local implementation and verification may complete; report the clean code state and the dependency release blocker separately.

- [ ] **Step 5: Commit final fixes and record completion**

If verification produced fixes, commit them as `fix: complete usability release review`. If no fixes were needed, do not create an empty commit. Confirm `git status --short` is clean and record exact test/build/browser/audit results in the handoff.
