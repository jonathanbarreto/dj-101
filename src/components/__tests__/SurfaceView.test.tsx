import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {readFileSync} from 'node:fs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {SurfaceView} from '../SurfaceView';

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
    vi.restoreAllMocks();
  });

  it('opens a desktop hotspot as a preview, then promotes it to the one full dialog', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);
    await user.click(screen.getByRole('button', {name: 'Explore Loop & transport'}));
    const hotspot = screen.getByRole('button', {name: 'LOOP IN · 1/2X'});
    await user.click(hotspot);
    expect(window.location.hash).toBe('#deck-left-loop-in');
    expect(hotspot.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('dialog', {name: 'LOOP IN · 1/2X'}).getAttribute('hidden')).toBeNull();
    expect(screen.getAllByRole('button', {name: 'Read full lesson'}).length).toBeGreaterThan(0);
    expect(document.querySelector('dialog[open]')).toBeNull();

    await user.click(screen.getAllByRole('button', {name: 'Read full lesson'})[0]);
    expect(document.querySelectorAll('dialog')).toHaveLength(1);
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

    await user.click(screen.getByRole('button', {name: 'Explore Loop & transport'}));
    await user.click(screen.getByRole('button', {name: 'LOOP IN · 1/2X'}));
    await user.click(screen.getAllByRole('button', {name: 'Read full lesson'})[0]);
    await user.click(screen.getAllByRole('button', {name: 'Close'}).at(-1)!);
    expect(window.location.hash).toBe('');
  });

  it('uses a dialog directly on mobile and supports indexed lessons', async () => {
    const user = userEvent.setup();
    media(true);
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);
    await user.click(screen.getByRole('button', {name: 'Explore Loop & transport'}));
    await user.click(screen.getByRole('button', {name: /LOOP IN/}));
    expect(document.querySelectorAll('dialog')).toHaveLength(1);
  });

  it('keeps hardware guidance inside beacons and popovers', () => {
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);

    expect(screen.getByRole('button', {name: 'Explore Loop & transport'})).toBeDefined();
    expect(screen.queryByRole('switch', {name: /shift/i})).toBeNull();
    expect(screen.queryByText('Learning focus')).toBeNull();
    expect(screen.queryByText(/Controls in/)).toBeNull();
  });

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
