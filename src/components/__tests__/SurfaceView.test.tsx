import {act, render, screen} from '@testing-library/react';
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import * as content from '@/content';
import type {Control} from '@/content/types';
import {SurfaceView} from '../SurfaceView';

const testControl: Control = {
  id: 'deck-left-test-control',
  surface: 'hardware',
  section: 'deck-left',
  label: 'Test control',
  kind: 'button',
  at: {x: 0.1, y: 0.5},
  primary: {
    summary: 'Test behavior',
    detail: 'Test detail',
    why: 'Test reason',
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
});
