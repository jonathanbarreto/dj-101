import {act, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderToString} from 'react-dom/server';
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import * as content from '@/content';
import type {Control} from '@/content/types';
import {SurfaceView} from '../SurfaceView';

const testControl: Control = {
  id: 'deck-left-test-control',
  surface: 'hardware',
  section: 'deck-left',
  label: 'Test control',
  shiftLegend: 'Test shift',
  kind: 'button',
  at: {x: 0.1, y: 0.5},
  primary: {
    summary: 'Test behavior',
    detail: 'Test detail',
    why: 'Test reason',
    source: 'manual',
  },
  shift: {
    summary: 'Shift test behavior',
    detail: 'Shift test detail',
    why: 'Shift test reason',
    source: 'manual',
  },
};

const originalMatchMedia = window.matchMedia;
const originalRequestAnimationFrame = window.requestAnimationFrame;
const originalCancelAnimationFrame = window.cancelAnimationFrame;
let animationFrames: FrameRequestCallback[];

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterAll(() => {
  window.matchMedia = originalMatchMedia;
});

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  animationFrames = [];
  window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    animationFrames.push(callback);
    return animationFrames.length;
  });
  window.cancelAnimationFrame = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
  window.requestAnimationFrame = originalRequestAnimationFrame;
  window.cancelAnimationFrame = originalCancelAnimationFrame;
});

describe('SurfaceView', () => {
  it('organizes the mixer into an accessible signal-flow-first lesson', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="hardware" sectionId="mixer" />);

    expect(screen.getByRole('navigation', {name: 'Mixer lesson region'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Signal path'}).getAttribute('aria-current'))
      .toBe('page');
    expect(screen.getByText('Choose the source')).toBeDefined();
    expect(screen.getByText('HEADPHONES LEVEL')).toBeDefined();
    expect(screen.queryByRole('button', {name: 'CH 3 TRIM'})).toBeNull();

    await user.click(screen.getByRole('button', {name: 'CH3'}));
    act(() => {
      while (animationFrames.length > 0) animationFrames.shift()!(0);
    });
    expect(screen.getByRole('button', {name: 'CH 3 TRIM'})).toBeDefined();
    expect(screen.queryByRole('button', {name: 'CH 1 TRIM'})).toBeNull();
  });

  it('selects and opens a mixer hash destination in its owning region', () => {
    window.history.replaceState(null, '', '/controller/mixer#mixer-headphones-mixing');
    render(<SurfaceView surface="hardware" sectionId="mixer" />);

    act(() => {
      while (animationFrames.length > 0) animationFrames.shift()!(0);
    });

    expect(screen.getByRole('button', {name: 'Headphones + sampler'}).getAttribute('aria-current'))
      .toBe('page');
    expect(screen.getByRole('button', {name: 'HEADPHONES MIXING'}).getAttribute('aria-expanded'))
      .toBe('true');
  });

  it('makes the Sound Color selection lesson and both effects references discoverable', () => {
    window.history.replaceState(null, '', '/controller/mixer#mixer-sound-color-fx-select');
    const {unmount} = render(<SurfaceView surface="hardware" sectionId="mixer" />);
    act(() => {
      while (animationFrames.length > 0) animationFrames.shift()!(0);
    });

    expect(screen.getByRole('button', {name: 'Color FX'}).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', {name: 'SOUND COLOR FX SELECT'}).getAttribute('aria-expanded'))
      .toBe('true');
    unmount();

    window.history.replaceState(null, '', '/controller/fx');
    render(<SurfaceView surface="hardware" sectionId="fx" />);
    expect(screen.getByText(/Prepare Beat FX in signal order/i)).toBeDefined();
    expect(screen.getAllByRole('link', {name: /Compare all 14 Beat FX/})
      .some((link) => link.getAttribute('href') === '/reference/beat-fx')).toBe(true);
    expect(screen.getByRole('link', {name: /Sound Color FX directions/}).getAttribute('href'))
      .toBe('/reference/sound-color-fx');
  });

  it('server-renders the deterministic Info region even when the URL has a valid hash', () => {
    window.history.replaceState(null, '', '/rekordbox/rb-deck#rb-deck-slip');

    const html = renderToString(<SurfaceView surface="software" sectionId="rb-deck" />);

    expect(html).toContain('data-tab-value="info"');
    expect(html).toMatch(/data-tab-value="info"[^>]*data-selected="selected"/);
    expect(html).not.toMatch(/data-tab-value="jog"[^>]*data-selected="selected"/);
  });

  it('shows only hardware section links with controller hrefs on the hardware overview', () => {
    render(<SurfaceView surface="hardware" />);

    expect(screen.getByRole('link', {name: 'Left deck'}).getAttribute('href'))
      .toBe('/controller/deck-left');
    expect(screen.queryByRole('link', {name: 'Player deck'})).toBeNull();
    expect(screen.getByRole('switch', {name: /shift/i})).toBeDefined();
  });

  it('shows only software section links with rekordbox hrefs and no SHIFT control', () => {
    render(<SurfaceView surface="software" />);

    expect(screen.getByRole('link', {name: 'Player deck'}).getAttribute('href'))
      .toBe('/rekordbox/rb-deck');
    expect(screen.queryByRole('link', {name: 'Left deck'})).toBeNull();
    expect(screen.queryByRole('switch', {name: /shift/i})).toBeNull();
  });

  it('starts a section at the full image, then transitions to its crop', () => {
    const controlsSpy = vi.spyOn(content, 'controlsInSection').mockReturnValue([testControl]);

    render(<SurfaceView surface="hardware" sectionId="deck-left" />);

    expect(controlsSpy).toHaveBeenCalledWith('deck-left');
    expect(screen.getByRole('img', {name: /DDJ-1000/i}).getAttribute('sizes')).toBe('100vw');
    expect(parseFloat(
      screen.getByRole('button', {name: 'Test control'}).parentElement?.style.left ?? '',
    )).toBeCloseTo(10);
    expect(animationFrames).toHaveLength(1);

    act(() => animationFrames[0](0));

    expect(screen.getByRole('img', {name: /DDJ-1000/i}).getAttribute('sizes')).toBe('309vw');
    expect(screen.getByRole('button', {name: 'Test control'})).toBeDefined();
    expect(parseFloat(
      screen.getByRole('button', {name: 'Test control'}).parentElement?.style.left ?? '',
    )).toBeCloseTo(28.7037);
    expect(screen.queryByRole('link', {name: 'Mixer'})).toBeNull();
  });

  it('cancels a pending section crop when it unmounts', () => {
    const {unmount} = render(<SurfaceView surface="hardware" sectionId="deck-left" />);

    expect(animationFrames).toHaveLength(1);
    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  it('uses an accessible Astryx region selector and filters software markers', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="software" sectionId="rb-deck" />);

    expect(screen.getByRole('navigation', {name: 'Player deck region'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'ARTWORK'})).toBeDefined();
    expect(screen.queryByRole('button', {name: 'SLIP'})).toBeNull();

    await user.click(screen.getByRole('button', {name: 'Jog'}));
    act(() => {
      while (animationFrames.length > 0) animationFrames.shift()!(0);
    });

    expect(screen.getByRole('button', {name: 'SLIP'})).toBeDefined();
    expect(screen.getByText('Controls in Jog')).toBeDefined();
    expect(screen.getByRole('button', {name: /^SLIP /})).toBeDefined();
    expect(screen.queryByText('Open SLIP lesson')).toBeNull();
  });

  it('keeps the full player-deck visual crop while filtering desktop markers', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="software" sectionId="rb-deck" />);

    act(() => animationFrames.shift()!(0));
    expect(screen.getByRole('img', {name: /rekordbox 7/i}).getAttribute('sizes')).toBe('209vw');

    await user.click(screen.getByRole('button', {name: 'Jog'}));
    act(() => {
      while (animationFrames.length > 0) animationFrames.shift()!(0);
    });

    expect(screen.getByRole('img', {name: /rekordbox 7/i}).getAttribute('sizes')).toBe('209vw');
    expect(screen.getByRole('button', {name: 'SLIP'})).toBeDefined();
  });

  it('selects, focuses, and opens a valid hash destination', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/rekordbox/rb-deck#rb-deck-slip');
    render(<SurfaceView surface="software" sectionId="rb-deck" />);

    act(() => {
      while (animationFrames.length > 0) animationFrames.shift()!(0);
    });

    const trigger = screen.getByRole('button', {name: 'SLIP'});
    expect(screen.getByRole('button', {name: 'Jog'}).getAttribute('aria-current')).toBe('page');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const dialog = screen.getByRole('dialog', {name: 'SLIP'});
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    await user.keyboard('{Escape}');
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'));
    expect(document.activeElement).toBe(trigger);
  });

  it('opens an indexed control and writes a stable hash without navigation loops', async () => {
    const user = userEvent.setup();
    render(<SurfaceView surface="software" sectionId="rb-deck" />);

    await user.click(screen.getByRole('button', {name: /^ARTWORK /}));
    act(() => {
      while (animationFrames.length > 0) animationFrames.shift()!(0);
    });

    expect(window.location.hash).toBe('#rb-deck-artwork');
    expect(screen.getByRole('button', {name: 'ARTWORK'}).getAttribute('aria-expanded')).toBe('true');
  });

  it('ignores an invalid hash and leaves the default region usable', () => {
    window.history.replaceState(null, '', '/rekordbox/rb-deck#not-a-control');
    render(<SurfaceView surface="software" sectionId="rb-deck" />);

    expect(screen.getByRole('button', {name: 'Info'}).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', {name: 'ARTWORK'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'ARTWORK'}).getAttribute('aria-expanded')).toBe('false');
  });

  it('replaces overlapping hardware markers with an operable narrow lesson index', async () => {
    const user = userEvent.setup();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.spyOn(content, 'controlsInSection').mockReturnValue([testControl]);

    render(<SurfaceView surface="hardware" sectionId="deck-left" />);

    expect(screen.getByText('Controls in Left deck')).toBeDefined();
    expect(screen.queryByRole('button', {name: 'Test control'})).toBeNull();
    const indexButton = screen.getByRole('button', {name: /^Test control /});
    expect(indexButton).toBeDefined();

    await user.click(screen.getByRole('switch', {name: /shift/i}));
    const shiftIndexButton = screen.getByRole('button', {name: /Test shift Shift test behavior/});
    expect(shiftIndexButton).toBeDefined();

    await user.click(shiftIndexButton);
    const lesson = screen.getByRole('region', {name: 'Test control lesson'});
    expect(lesson.textContent).toContain('Shift test behavior');
    act(() => {
      while (animationFrames.length > 0) animationFrames.shift()!(0);
    });
    expect(document.activeElement).toBe(lesson);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('region', {name: 'Test control lesson'})).toBeNull();
    expect(document.activeElement).toBe(shiftIndexButton);
  });

  it('presents signal flow and gain roles as scannable lists without a nested image scroller', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<SurfaceView surface="hardware" sectionId="mixer" />);

    expect(screen.getAllByRole('list')).toHaveLength(2);
    expect(screen.getByText('Choose the source')).toBeDefined();
    expect(screen.getByText('TRIM')).toBeDefined();
    expect(screen.queryByRole('region', {name: 'Scrollable mixer control image'})).toBeNull();
  });

  it('scrolls a deep-linked mobile tab into view and clears the hash on explicit close', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const originalScrollTo = HTMLElement.prototype.scrollTo;
    const scrollTo = vi.fn();
    HTMLElement.prototype.scrollTo = scrollTo;
    window.history.replaceState(null, '', '/controller/mixer#mixer-mic-low');

    render(<SurfaceView surface="hardware" sectionId="mixer" />);
    act(() => {
      while (animationFrames.length > 0) animationFrames.shift()!(0);
    });

    expect(screen.getByRole('button', {name: 'Mic'}).getAttribute('aria-current')).toBe('page');
    expect(scrollTo).toHaveBeenCalled();
    expect(screen.getByRole('region', {name: 'MIC EQ LOW lesson'})).toBeDefined();

    await userEvent.setup().click(screen.getByRole('button', {name: 'Close lesson'}));
    expect(window.location.hash).toBe('');
    expect(screen.queryByRole('region', {name: 'MIC EQ LOW lesson'})).toBeNull();

    HTMLElement.prototype.scrollTo = originalScrollTo;
  });
});
