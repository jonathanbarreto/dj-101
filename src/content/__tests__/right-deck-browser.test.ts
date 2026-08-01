import {describe, expect, it} from 'vitest';

import {ALL_CONTROLS} from '../index';

const leftDeck = ALL_CONTROLS.filter((control) => control.section === 'deck-left');
const rightDeck = ALL_CONTROLS.filter((control) => control.section === 'deck-right');
const browser = ALL_CONTROLS.filter((control) => control.section === 'browser');

describe('DDJ-1000 right deck content', () => {
  it('derives one right-side lesson for every canonical left-deck control', () => {
    expect(rightDeck).toHaveLength(24);
    expect(rightDeck.map((control) => control.ref).sort((a, b) => (a ?? 0) - (b ?? 0)))
      .toEqual(leftDeck.map((control) => control.ref).sort((a, b) => (a ?? 0) - (b ?? 0)));

    for (const left of leftDeck) {
      const rightId = left.id.replace('deck-left-', 'deck-right-');
      const right = rightDeck.find((control) => control.id === rightId);
      expect(right, rightId).toBeDefined();
      expect(right?.at.x, `${rightId} measured x`).toBeGreaterThanOrEqual(0.629);
      expect(right?.at.x, `${rightId} measured x`).toBeLessThanOrEqual(0.999);

      if (left.ref !== 36) {
        expect(right?.primary, `${rightId} shares canonical teaching copy`).toBe(left.primary);
        expect(right?.shift, `${rightId} shares canonical SHIFT copy`).toBe(left.shift);
      }
    }
  });

  it('keeps both JOG ADJUST anchors separate from the Browser rotary', () => {
    const leftJog = leftDeck.find((control) => control.ref === 44)!;
    const rightJog = rightDeck.find((control) => control.ref === 44)!;
    const rotary = browser.find((control) => control.ref === 53)!;

    expect(leftJog.at).toEqual({x: 0.3098, y: 0.2169});
    expect(rightJog.at).toEqual({x: 0.9342, y: 0.2169});
    expect(Math.hypot(leftJog.at.x - rotary.at.x, leftJog.at.y - rotary.at.y))
      .toBeGreaterThan(0.1);
    expect(Math.hypot(rightJog.at.x - rotary.at.x, rightJog.at.y - rotary.at.y))
      .toBeGreaterThan(0.6);
  });

  it('pins directly measured right-deck anchors to the master image', () => {
    const anchors = {
      'deck-right-loop-in': {x: 0.6477, y: 0.0723},
      'deck-right-jog-dial': {x: 0.7352, y: 0.4391},
      'deck-right-hot-cue': {x: 0.7199, y: 0.6963},
      'deck-right-master-tempo': {x: 0.8949, y: 0.6963},
      'deck-right-pad-grid': {x: 0.7913, y: 0.8135},
      'deck-right-tempo-slider': {x: 0.9262, y: 0.7998},
    } as const;

    for (const [id, point] of Object.entries(anchors)) {
      expect(rightDeck.find((control) => control.id === id)?.at, id).toEqual(point);
    }
  });

  it('teaches the right DECK SELECT 2/4 layer and its display warning precisely', () => {
    const selector = rightDeck.find((control) => control.id === 'deck-right-deck-select');

    expect(selector?.label).toBe('DECK SELECT 2/4');
    expect(selector?.primary.detail).toMatch(/decks? 2 and 4/i);
    expect(selector?.primary.detail).toMatch(/3.*1.*2.*4/i);
    expect(selector?.primary.gotcha).toMatch(/jog display.*deck number/i);
  });

  it('keeps every rekordbox counterpart reciprocal for both physical decks', () => {
    for (const hardware of [...leftDeck, ...rightDeck]) {
      for (const softwareId of hardware.counterpart ?? []) {
        const software = ALL_CONTROLS.find((control) => control.id === softwareId);
        expect(software?.counterpart, `${softwareId} must return to ${hardware.id}`)
          .toContain(hardware.id);
      }
    }
  });
});

describe('DDJ-1000 Browser content', () => {
  it('contains only the three canonical Browser controls', () => {
    expect(browser.map(({id, ref}) => [id, ref])).toEqual([
      ['browser-rotary-selector', 53],
      ['browser-back', 54],
      ['browser-view', 55],
    ]);
  });

  it('teaches every rotary gesture without inventing a SHIFT legend', () => {
    const rotary = browser.find((control) => control.ref === 53)!;

    expect(rotary.shiftLegend).toBeUndefined();
    expect(rotary.primary.detail).toMatch(/turn.*cursor/i);
    expect(rotary.primary.detail).toMatch(/press.*load/i);
    expect(rotary.primary.detail).toMatch(/folder|playlist/i);
    expect(rotary.primary.detail).toMatch(/double-press.*Instant Doubles/i);
    expect(rotary.primary.detail).toMatch(/playback position/i);
    expect(rotary.shift?.detail).toMatch(/right.*enlarge.*waveform/i);
    expect(rotary.shift?.detail).toMatch(/left.*reduce/i);
    expect(rotary.primary.gotcha).toMatch(/deck/i);
  });

  it('distinguishes BACK navigation from browser history or unloading', () => {
    const back = browser.find((control) => control.ref === 54)!;

    expect(back.primary.detail).toMatch(/tree.*track list/i);
    expect(back.primary.detail).toMatch(/close.*folder/i);
    expect(back.shift?.detail).toMatch(/show.*hide.*Playlist Palette/i);
    expect(back.primary.gotcha).toMatch(/browser history|unload/i);
  });

  it('distinguishes VIEW press, hold, and Related Tracks behavior', () => {
    const view = browser.find((control) => control.ref === 55)!;

    expect(view.primary.detail).toMatch(/short press.*expands? the browser/i);
    expect(view.primary.detail).toMatch(/hold.*Tag List/i);
    expect(view.shift?.detail).toMatch(/Related Tracks/i);
    expect(view.shift?.gotcha).toMatch(/does not.*automatically load|not.*guarantee/i);
  });
});
