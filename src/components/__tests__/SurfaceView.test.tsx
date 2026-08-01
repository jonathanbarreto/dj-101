import {render, screen} from '@testing-library/react';
import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
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

  it('uses the section crop and renders that section controls', () => {
    const controlsSpy = vi.spyOn(content, 'controlsInSection').mockReturnValue([testControl]);

    render(<SurfaceView surface="hardware" sectionId="deck-left" />);

    expect(controlsSpy).toHaveBeenCalledWith('deck-left');
    expect(screen.getByRole('img', {name: /DDJ-1000/i}).getAttribute('sizes')).toBe('309vw');
    expect(screen.getByRole('button', {name: 'Test control'})).toBeDefined();
    expect(screen.queryByRole('link', {name: 'Mixer'})).toBeNull();
  });
});
