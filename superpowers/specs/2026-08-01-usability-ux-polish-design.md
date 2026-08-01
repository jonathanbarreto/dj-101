# dj-101 usability and UX polish design

Date: 2026-08-01
Status: Approved direction; implementation planning pending written-spec review

## Purpose

Make dj-101 feel like a focused learning product rather than a collection of routes and hotspots. The redesign must improve orientation, lesson readability, viewport safety, zoom control, and visual hierarchy without weakening the existing DDJ-1000 or rekordbox 7 content.

The work remains bound by the original architecture:

- rekordbox 7 only.
- Astryx `@astryxdesign/core` and `@astryxdesign/theme-neutral` remain the component and token source.
- `/Users/jonathanbarreto/Desktop/Projects/astryx-main` is read-only reference material, never a path dependency.
- Each surface keeps one master image; every view is a CSS crop of that image.
- Motion uses Astryx duration/easing tokens and CSS only.
- Existing lesson copy and source-backed behavior remain authoritative unless a separate content review changes them.

## Confirmed decisions

1. Hotspot selection keeps an anchored preview, but the complete lesson moves to an Astryx Dialog.
2. Zoom out returns to the full controller map and preserves an easy path back to the learner's last section or control.
3. The home page becomes a visual learning dashboard using the existing controller and rekordbox master images.
4. The design follows Astryx composition guidance rather than recreating primitives with ad hoc CSS.

## Usability principles

The implementation will be evaluated against these heuristics:

- **Visibility of system status:** always show the current surface, section, region, selected control, Shift state, and zoom level.
- **Match with the instrument:** preserve the physical controller image and use the printed hardware names as primary labels.
- **User control and freedom:** provide explicit View map, Close, Back, and Resume actions; Escape must always dismiss the topmost layer.
- **Consistency and standards:** use Astryx navigation, layout, card, dialog, tabs, list, badge, and typography patterns.
- **Recognition over recall:** keep a visible control index and clear region navigation; do not require learners to remember where a hotspot was.
- **Error prevention:** destructive or mode-dependent actions retain their warnings and Shift scope.
- **Responsive continuity:** the information hierarchy stays the same across mobile, tablet, and desktop even when its presentation changes.
- **Accessibility:** preserve semantic headings, keyboard access, focus return, reduced motion, sufficient target sizes, and non-color-only selection states.

## Page composition

### Application shell

Keep the Astryx `AppShell` and `TopNav` as the single application shell. Page content uses one Astryx `Layout` composition with `height="auto"`, a bounded content width, and `LayoutContent`; simple internal grouping uses `Stack`/`VStack`, not nested `Layout` shells.

`PageFrame` becomes the shared adapter for this composition so route pages do not repeat width, padding, or content-zone CSS. Custom CSS remains limited to product-specific image staging, responsive grids, and state transitions.

### Home page

The home page becomes a learning dashboard with three levels of emphasis:

1. A concise hero establishes the promise: learn the physical controller and connect it to rekordbox 7.
2. Two primary Astryx card actions present Controller and rekordbox 7. Each uses a crop of its existing master image, a clear outcome, lesson coverage, and a single start/resume action.
3. A quieter Reference section presents Beat FX, Sound Color FX, and specifications as scannable list or card links.

The page uses `Section`, `Grid`, `Card` or `ClickableCard`, `Heading`, `Text`, `Badge`, and `Stack`. It must avoid the current full-width list rows and excessive empty space. The controller path remains visually primary; rekordbox is a connected second path; reference material is supportive rather than equal-weight navigation.

## Learning workspace

### Stable hierarchy

Every interactive surface page shows a local orientation row beneath the page heading:

`Full controller map / Left deck / Jog & tempo / Jog dial`

The exact labels adapt to mixer, effects, browser, connections, and rekordbox. The row combines existing breadcrumbs with local state rather than adding a second competing navigation system.

Actions adjacent to this hierarchy:

- **View map** returns to `/controller` or `/rekordbox`.
- **Resume** appears on the map when a previous section/control is available.
- Region controls change the crop without pretending to be route-level navigation.

The map return stores a compact resume state: surface, section, and selected control when present. Session storage is the progressive enhancement; browser history and normal route links remain the fallback. Returning to a selected control restores its region and opens its full lesson.

### Zoom and stage behavior

The image interaction has three explicit levels:

1. Surface map.
2. Section crop.
3. Region crop with a selected control.

The stage sits in a viewport-budgeted frame so changing region crops does not cause a large page-height jump. The same master image animates its crop within that frame. The selected hotspot remains visibly selected while its preview or lesson is open.

Transitions animate only image position/scale and selection emphasis. They use Astryx duration/easing tokens, and `prefers-reduced-motion` changes them to immediate state updates. The UI never animates to a blank or full-image intermediate state after hydration.

### Region navigation

Deck, rekordbox, and mixer region tabs remain Astryx `TabList` patterns where all choices fit. The mixer consolidates the four repetitive CH3/CH1/CH2/CH4 lessons into one **Four channels** region: it explains that the mixer has four simultaneously available physical strips, that DECK SELECT switches the left deck between layers 1/3 and the right deck between 2/4, and that one representative strip teaches the shared TRIM, meter, EQ, COLOR, CUE, fader, and crossfader-assignment controls. The region also preserves the two materially different input-selector cases: LINE-only on channels 1/2 and PHONO/LINE on channels 3/4. Signal path, Color FX, outputs, monitoring/sampler, and mic remain separate regions. This reduced set fits without horizontal scrolling or an overflow menu.

The control index remains available on desktop and tablet as a discoverable alternative to image hotspots. Selecting an index item opens the complete lesson directly.

## Lesson interaction

### Anchored preview

Clicking a hotspot opens a short Astryx `Popover` that is guaranteed to fit the viewport. It contains only:

- control name and Shift badge when applicable;
- one-sentence summary;
- one short description of the physical action;
- `Read full lesson` and `Close` actions.

The preview contains no long Markdown, tips list, gotcha, reference chain, or nested scrolling. Placement may flip or slide using Astryx layer behavior, but content height is bounded by design rather than by clipping.

### Full lesson dialog

`Read full lesson`, control-index selection, and direct control hashes open an Astryx `Dialog` with a visible `DialogHeader`. The body contains the complete current lesson: behavior, when to use it, warning, tips, hardware/software counterpart, and sources.

Dialog requirements:

- Fit within `100dvh` with one intentional scroll container.
- Keep the title and close action visible.
- Preserve the selected hotspot behind the dialog.
- Close on Escape and explicit Close; return focus to the initiating hotspot or index item.
- Clear only the matching control hash on close.
- Opening another control replaces the lesson without stacking dialogs.
- Use a fullscreen dialog only at the smallest viewport if Astryx's standard responsive dialog cannot preserve comfortable margins.

The reusable lesson renderer is renamed from `ControlPopover` to `ControlLesson` because it no longer belongs to one overlay primitive.

### Responsive contract

- **Mobile (up to 767px):** image plus control list; selecting a control opens the full responsive Dialog. The anchored preview is omitted because precision hotspots and two-step disclosure add friction on touch screens.
- **Tablet (768–1023px):** image hotspots may open the concise preview; full content always uses Dialog. The control index remains visible below the stage.
- **Desktop (1024px and wider):** image hotspots open concise previews; full content uses Dialog; the control index remains available in a compact scannable section below the stage.

This removes the current 768px cliff where the accessible list disappears exactly as long popovers become unsafe.

## State and URLs

The selected control ID remains the canonical hash. UI state follows these rules:

- Hotspot preview selection writes the control hash.
- `Read full lesson` keeps that hash and changes only overlay mode.
- A direct hash opens the correct region and full Dialog after hydration.
- Closing a preview or Dialog clears the matching hash and restores focus.
- Region changes close the current lesson, clear its matching hash, and move focus to the selected region control.
- View map records resume state before route navigation.
- Malformed or unknown hashes remain ignored safely.

State transitions are centralized in `SurfaceView`; individual hotspot, preview, dialog, and list components receive explicit state and callbacks rather than maintaining competing selections.

## Component boundaries

- `SiteShell`: Astryx application navigation only.
- `PageFrame`: Astryx page `Layout` adapter and content width/padding.
- `LearningDashboard`: home hero, learning-path cards, and references.
- `SurfaceView`: surface/section/region/control state coordinator.
- `SurfaceNavigator`: hierarchy, View map, Resume, and region navigation.
- `Stage`: stable one-master-image viewport and crop transition.
- `Hotspot`: marker and concise preview trigger only.
- `ControlPreview`: bounded popover content.
- `ControlLessonDialog`: Astryx Dialog ownership, focus return, and responsive sizing.
- `ControlLesson`: reusable complete lesson content.
- `ControlIndex`: discoverable text alternative at every viewport.

Each component has one purpose and can be tested without understanding the full surface implementation.

## Error and edge handling

- If a stored resume target no longer exists, discard it and show the normal map.
- If a control is not in the active crop, resolve its owning region before opening its dialog.
- If the viewport changes while a preview is open, preserve the selected control and move safely to the presentation appropriate for the new breakpoint.
- If Dialog or TabList API names differ in installed Astryx 0.2.0, use the installed package declarations as authoritative; local 0.1.6 source remains behavioral reference only.
- No loading spinner is required because content and images are local/static; failed images retain meaningful alt text and the control index remains usable.

## Testing and acceptance

### Unit and integration

- Preview contains only bounded summary content and exposes full-lesson/close actions.
- Full lesson Dialog contains every existing lesson field and uses one scroll container.
- Hotspot, list, direct hash, Escape, explicit close, region change, and responsive change preserve the state/focus contract.
- View map stores resume state; Resume restores the correct section, region, control, and hash.
- Mixer exposes all six consolidated regions by keyboard without horizontal overflow.
- Home cards use existing master images only and preserve exact public routes.
- Reduced motion removes crop animation.

### Browser matrix

At 375, 768, 1024, and 1440 pixels, verify:

- no dialog, popover, close action, table, or control is clipped by the viewport;
- no document-level horizontal overflow;
- stage height remains stable across region changes;
- all lesson content is reachable with keyboard and touch;
- focus returns to the correct trigger;
- map/resume and browser Back behavior are coherent;
- light/dark themes and reduced motion remain correct;
- home hierarchy is visually clear and primary actions are obvious.

### Release gates

Run full tests, typecheck, two clean builds, asset/route/content/security scans, and two unchanged-code browser rounds before deployment.

The current production dependency audit remains an explicit release blocker for promoting this UX revision: stable Next 15.5.22 and stable Next 16.2.12 both declare vulnerable PostCSS and Sharp ranges, while the first patched Next package is a 16.3 canary. This UX phase will not silently add semver-violating overrides or move to a prerelease framework. Promotion of the revised build waits for either a supported stable Next release or explicit approval of a documented architecture deviation.

## Out of scope

- Changing controller or rekordbox factual content.
- Adding new controller surfaces or rekordbox zones.
- Adding animation libraries, gesture libraries, user accounts, progress tracking, or analytics.
- Replacing the two master images or introducing per-section base images.
- Modifying or path-linking the Astryx reference repository.
