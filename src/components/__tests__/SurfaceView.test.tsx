import {cleanup, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {readFileSync} from 'node:fs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {SurfaceView} from '../SurfaceView';
import {controlsForControllerView, type ControllerTerminalView} from '../controllerHotspots';

const originalMatchMedia = window.matchMedia;

function media(narrow = false) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: narrow && query === '(max-width: 767px)', media: query, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(),
    removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  }));
}

describe('SurfaceView lesson coordination', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/controller/deck-left');
    window.sessionStorage.clear();
    media();
  });
  afterEach(() => {
    cleanup();
    document.querySelectorAll('[popover]').forEach((element) => element.remove());
    vi.restoreAllMocks();
  });

  it('opens a desktop hotspot with its full lesson in one popover', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);
    const hotspot = screen.getByRole('button', {name: 'LOOP IN · 1/2X'});
    const image = screen.getByRole('img', {name: 'Pioneer DJ DDJ-1000'});
    const cropBeforeOpen = image.getAttribute('style');
    await user.click(hotspot);
    expect(window.location.hash).toBe('#deck-left-loop-in');
    expect(image.getAttribute('style')).toBe(cropBeforeOpen);
    expect(hotspot.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('dialog', {name: 'LOOP IN · 1/2X'}).getAttribute('hidden')).toBeNull();
    expect(screen.getAllByText('When to use it').length).toBeGreaterThan(0);
    expect(document.querySelector('dialog[open]')).toBeNull();
  });

  it('opens a valid direct hash in its owning region as a dialog', () => {
    window.history.replaceState(null, '', '/controller/mixer#mixer-ch1-trim');
    render(<SurfaceView surface="hardware" sectionId="mixer" />);
    expect(document.querySelectorAll('dialog')).toHaveLength(1);
    expect(screen.getAllByRole('heading', {name: 'CH 1 TRIM'})).toHaveLength(2);
  });

  it('keeps malformed hashes safe and clears only the matching hash when closing', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/controller/deck-left#%E0%A4%A');
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);
    expect(document.querySelectorAll('dialog')).toHaveLength(0);

    await user.click(screen.getByRole('button', {name: 'LOOP IN · 1/2X'}));
    await user.click(within(screen.getByRole('dialog', {name: 'LOOP IN · 1/2X'}))
      .getByRole('button', {name: 'Close'}));
    expect(window.location.hash).toBe('');
  });

  it('uses a dialog directly on mobile and supports indexed lessons', async () => {
    const user = userEvent.setup();
    media(true);
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);
    await user.click(screen.getByRole('button', {name: /LOOP IN/}));
    expect(document.querySelectorAll('dialog')).toHaveLength(1);
  });

  it('keeps hardware guidance inside beacons and popovers', () => {
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);

    expect(screen.getByRole('button', {name: 'LOOP IN · 1/2X'})).toBeDefined();
    expect(document.querySelector('[data-hotspot-label]')).toBeNull();
    expect(screen.queryByRole('switch', {name: /shift/i})).toBeNull();
    expect(screen.queryByText('Learning focus')).toBeNull();
    expect(screen.queryByText(/Controls in/)).toBeNull();
  });

  it('routes both overview deck beacons to the same terminal deck view', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="hardware" />);

    const deckEntries = screen.getAllByRole('button', {name: 'Explore Decks'});
    expect(deckEntries).toHaveLength(2);
    await user.click(deckEntries[0]);
    const firstCrop = screen.getByRole('img', {name: 'Pioneer DJ DDJ-1000'}).getAttribute('style');
    expect(screen.getByRole('button', {name: 'LOOP IN · 1/2X'})).toBeDefined();

    await user.click(screen.getByRole('button', {name: 'Back'}));
    await user.click(screen.getAllByRole('button', {name: 'Explore Decks'})[1]);
    expect(screen.getByRole('img', {name: 'Pioneer DJ DDJ-1000'}).getAttribute('style')).toBe(firstCrop);
    expect(screen.getByRole('button', {name: 'LOOP IN · 1/2X'})).toBeDefined();
  });

  it('uses three progressive rekordbox entry points and no focused-view labels or tabs', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="software" />);

    expect(screen.getByRole('button', {name: 'Explore Player Deck'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Explore Performance & Mix'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Explore Browser & Library'})).toBeDefined();
    expect(screen.queryByText(/Muted zone names/)).toBeNull();

    await user.click(screen.getByRole('button', {name: 'Explore Browser & Library'}));
    expect(screen.getByRole('button', {name: 'COLLECTION & SOURCES'})).toBeDefined();
    expect(screen.queryByRole('navigation', {name: 'Surface orientation'})).toBeNull();
    expect(document.querySelector('[data-hotspot-label]')).toBeNull();
    expect(screen.queryByText(/Controls in/)).toBeNull();
  });

  it('opens a complete rekordbox workspace lesson from its first hotspot', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="software" sectionId="rb-mixer" />);

    const hotspot = screen.getByRole('button', {name: 'STACKED WAVEFORMS'});
    await user.click(hotspot);
    expect(hotspot.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getAllByText('When to use it').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/anticipate changes, then confirm the blend by ear/i).length)
      .toBeGreaterThan(0);
  });

  for (const terminalView of ['deck-left', 'mixer'] as ControllerTerminalView[]) {
    for (const control of controlsForControllerView(terminalView)) {
      it(`opens ${terminalView} hotspot ${control.label} with its full lesson`, async () => {
        const user = userEvent.setup();
        render(<SurfaceView surface="hardware" sectionId={terminalView} />);

        const hotspot = screen.getByRole('button', {name: control.label});
        await user.click(hotspot);
        expect(hotspot.getAttribute('aria-expanded')).toBe('true');
        expect(screen.getByRole('heading', {name: control.label})).toBeDefined();

        expect(screen.getAllByText(control.primary.summary).length).toBeGreaterThan(0);
        expect(screen.getAllByText(control.primary.why).length).toBeGreaterThan(0);
        await user.click(screen.getAllByRole('button', {name: 'Close'}).at(-1)!);
        expect(hotspot.getAttribute('aria-expanded')).toBe('false');
      });
    }
  }

  it('has no initial full-stage animation frame', () => {
    const frame = vi.spyOn(window, 'requestAnimationFrame');
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);
    expect(frame).not.toHaveBeenCalled();
  });

  it('keeps the control index visible at tablet and desktop widths', () => {
    const css = readFileSync(`${process.cwd()}/src/components/SurfaceView.module.css`, 'utf8');
    const desktopRules = css.match(/@media \(min-width: 768px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

    expect(desktopRules).not.toMatch(/\.controlIndex\s*\{[^}]*display:\s*none/);
  });
});
