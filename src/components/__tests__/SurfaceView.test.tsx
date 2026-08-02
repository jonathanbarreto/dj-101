import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderToString} from 'react-dom/server';
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
    expect(screen.getByRole('heading', {name: 'CH 1 TRIM'})).toBeDefined();
  });

  it('keeps malformed hashes safe and clears only the matching hash when closing', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/controller/deck-left#%E0%A4%A');
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);
    expect(document.querySelectorAll('dialog')).toHaveLength(0);

    await user.click(screen.getByRole('button', {name: 'LOOP IN · 1/2X'}));
    await user.click(screen.getAllByRole('button', {name: 'Read full lesson'})[0]);
    await user.click(screen.getAllByRole('button', {name: 'Close'}).at(-1)!);
    expect(window.location.hash).toBe('');
  });

  it('uses a dialog directly on mobile and supports indexed lessons', async () => {
    const user = userEvent.setup();
    media(true);
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);
    await user.click(screen.getByRole('button', {name: /LOOP IN/}));
    expect(document.querySelectorAll('dialog')).toHaveLength(1);
    expect(screen.queryByRole('button', {name: 'Read full lesson'})).toBeNull();
  });

  it('updates the control index for the active Shift state', async () => {
    const user = userEvent.setup();
    media(true);
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);

    const loopIn = document.querySelector('[data-control-id="deck-left-loop-in"]');
    expect(loopIn?.textContent).toContain('Sets the loop start or halves an active loop');

    await user.click(screen.getByRole('switch', {name: /shift/i}));

    expect(loopIn?.textContent).toContain('Fine-adjusts the loop-in point with the jog');
  });

  it('saves a control resume target and exposes it through the navigator', async () => {
    const user = userEvent.setup();
    const first = render(<SurfaceView surface="hardware" sectionId="deck-left" />);
    await user.click(screen.getByRole('button', {name: 'LOOP IN · 1/2X'}));
    first.unmount();
    render(<SurfaceView surface="hardware" sectionId="mixer" />);
    expect(screen.getByRole('link', {name: 'Resume'}).getAttribute('href')).toContain('deck-left');
  });

  it('saves a section resume target before View map navigation', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="hardware" sectionId="deck-left" />);

    const map = screen.getByRole('link', {name: 'View map'});
    map.addEventListener('click', (event) => event.preventDefault());
    await user.click(map);
    expect(window.sessionStorage.getItem('dj101:resume:v1')).toBe(JSON.stringify({
      surface: 'hardware', sectionId: 'deck-left',
    }));

    cleanup();
    render(<SurfaceView surface="hardware" />);
    expect(screen.getByRole('link', {name: 'Resume'}).getAttribute('href')).toBe('/controller/deck-left');
  });

  it('omits Resume from the initial map markup, then exposes a valid stored target after hydration', () => {
    window.sessionStorage.setItem('dj101:resume:v1', JSON.stringify({
      surface: 'hardware', sectionId: 'deck-left', controlId: 'deck-left-play-pause',
    }));

    expect(renderToString(<SurfaceView surface="hardware" />)).not.toContain('Resume');

    render(<SurfaceView surface="hardware" />);
    expect(screen.getByRole('link', {name: 'Resume'}).getAttribute('href'))
      .toBe('/controller/deck-left#deck-left-play-pause');
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
