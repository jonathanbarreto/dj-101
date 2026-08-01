import {describe, expect, it} from 'vitest';

import {ALL_CONTROLS, SECTIONS, SURFACES} from '../index';

const deckControls = ALL_CONTROLS.filter((control) => control.section === 'deck-left');

describe('DDJ-1000 left deck content', () => {
  it('uses the canonical deck numbering and keeps Browser controls out of this lesson', () => {
    const expectedRefs = {
      'deck-left-play-pause': 32,
      'deck-left-cue': 33,
      'deck-left-search': 34,
      'deck-left-memory': 35,
      'deck-left-deck-select': 36,
      'deck-left-slip-reverse': 37,
      'deck-left-loop-in': 38,
      'deck-left-loop-out': 39,
      'deck-left-loop-exit': 40,
      'deck-left-quantize': 41,
      'deck-left-slip': 42,
      'deck-left-jog-dial': 43,
      'deck-left-jog-feeling-adjust': 44,
      'deck-left-beat-sync': 45,
      'deck-left-tempo-slider': 46,
      'deck-left-master-tempo': 47,
      'deck-left-key-sync': 48,
      'deck-left-key-reset': 49,
      'deck-left-hot-cue': 50,
      'deck-left-pad-fx-1': 50,
      'deck-left-beat-jump': 50,
      'deck-left-sampler': 50,
      'deck-left-page': 51,
      'deck-left-pad-grid': 52,
    } as const;

    expect(deckControls).toHaveLength(24);
    expect(Object.fromEntries(deckControls.map((control) => [control.id, control.ref]))).toEqual(expectedRefs);
    expect(deckControls.some((control) => [53, 54, 55].includes(control.ref ?? -1))).toBe(false);
    expect(deckControls.every((control) => control.surface === 'hardware')).toBe(true);
    expect(deckControls.every((control) => control.section === 'deck-left')).toBe(true);
  });

  it('documents every printed second-layer control with its rekordbox behavior', () => {
    const expectedShiftLegends: Record<string, string> = {
      'deck-left-search': 'CUE/LOOP CALL',
      'deck-left-cue': 'JUMP TO TRACK START',
      'deck-left-memory': 'DELETE',
      'deck-left-slip-reverse': 'REVERSE',
      'deck-left-loop-in': 'IN ADJUST',
      'deck-left-loop-out': 'OUT ADJUST/RELOOP',
      'deck-left-loop-exit': 'ACTIVE LOOP',
      'deck-left-slip': 'VINYL',
      'deck-left-jog-dial': 'GRID ADJUST',
      'deck-left-beat-sync': 'MASTER',
      'deck-left-master-tempo': 'TEMPO RANGE',
      'deck-left-hot-cue': 'KEYBOARD',
      'deck-left-pad-fx-1': 'PAD FX2',
      'deck-left-beat-jump': 'BEAT LOOP',
      'deck-left-sampler': 'KEY SHIFT',
      'deck-left-page': 'SAMPLER BANK',
    };

    for (const [id, legend] of Object.entries(expectedShiftLegends)) {
      const control = deckControls.find((candidate) => candidate.id === id);
      expect(control, id).toBeDefined();
      expect(control?.shiftLegend, id).toBe(legend);
      expect(control?.shift, `${id} must explain its grey legend`).toBeDefined();
      expect(['manual', 'rekordbox7', 'community'], `${id} must use a canonical source`)
        .toContain(control?.shift?.source);
    }
  });

  it('models QUANTIZE and left-deck standby wake-up without inventing a SHIFT layer', () => {
    const left = deckControls.find((control) => control.id === 'deck-left-quantize')!;
    const right = ALL_CONTROLS.find((control) => control.id === 'deck-right-quantize')!;

    expect(left.shiftLegend).toBeUndefined();
    expect(left.shift).toBeUndefined();
    expect(left.primary.detail).toMatch(/press.*toggle.*quantize/i);
    expect(left.primary.detail).toMatch(/left deck.*standby.*wake/i);
    expect(left.primary.detail).not.toMatch(/holding SHIFT.*QUANTIZE|SHIFT \+ QUANTIZE/i);
    expect(right.shiftLegend).toBeUndefined();
    expect(right.shift).toBeUndefined();
    expect(`${right.primary.summary} ${right.primary.detail} ${right.primary.why}`).not.toMatch(/wake|standby/i);
  });

  it('teaches the exact CUE state sequence and keeps published copy typo-free', () => {
    const cue = deckControls.find((control) => control.id === 'deck-left-cue')!;
    expect(cue.primary.detail).toMatch(/paused.*sets? (?:the )?cue/i);
    expect(cue.primary.detail).toMatch(/playing.*back-cue.*paus/i);
    expect(cue.primary.detail).toMatch(/at (?:the )?cue.*hold.*Cue Sampler.*release.*returns? to (?:the )?cue/i);
    expect(cue.shiftLegend).toBe('JUMP TO TRACK START');
    expect(cue.shift?.detail).toMatch(/holding SHIFT.*pressing CUE.*(?:beginning|track start)/i);
    expect(cue.shift?.detail).not.toMatch(/play|pause|stop/i);
    const rightCue = ALL_CONTROLS.find((control) => control.id === 'deck-right-cue')!;
    expect(rightCue.shiftLegend).toBe(cue.shiftLegend);
    expect(rightCue.shift).toEqual(cue.shift);
    expect(deckControls.map((control) => Object.values(control.primary).join(' ')).join(' '))
      .not.toMatch(/quantified/i);
  });

  it('limits SHIFT plus PAGE sampler-bank changes to Sampler mode', () => {
    const page = deckControls.find((control) => control.id === 'deck-left-page')!;
    expect(page.shift?.detail).toMatch(/only.*Sampler mode|Sampler mode only/i);
    expect(page.shift?.gotcha).toMatch(/(?:outside|other).*Sampler mode|Sampler mode.*(?:outside|other)/i);
  });

  it('keeps deck explanations specific enough to teach a live decision', () => {
    for (const control of deckControls) {
      for (const behavior of [control.primary, control.shift].filter(Boolean)) {
        expect(behavior!.summary).not.toMatch(/\.$/);
        expect(behavior!.why.split(/\s+/).length, `${control.id} why needs a concrete scenario`).toBeGreaterThan(12);
      }
    }
  });
});

describe('content integrity', () => {
  it('has no duplicate control ids', () => {
    expect(new Set(ALL_CONTROLS.map((control) => control.id)).size).toBe(ALL_CONTROLS.length);
  });

  it('keeps every control point within normalized image bounds', () => {
    for (const control of ALL_CONTROLS) {
      expect(control.at.x, `${control.id} x position`).toBeGreaterThanOrEqual(0);
      expect(control.at.x, `${control.id} x position`).toBeLessThanOrEqual(1);
      expect(control.at.y, `${control.id} y position`).toBeGreaterThanOrEqual(0);
      expect(control.at.y, `${control.id} y position`).toBeLessThanOrEqual(1);
    }
  });

  it('assigns every control to a section on the same surface', () => {
    for (const control of ALL_CONTROLS) {
      const section = SECTIONS[control.section];
      expect(section, `${control.id} section ${control.section}`).toBeDefined();
      expect(section.surface, `${control.id} section surface`).toBe(control.surface);
    }
  });

  it('places every control point inside its section rect', () => {
    for (const control of ALL_CONTROLS) {
      const {rect} = SECTIONS[control.section];
      expect(control.at.x, `${control.id} x inside ${control.section}`).toBeGreaterThanOrEqual(rect.x);
      expect(control.at.x, `${control.id} x inside ${control.section}`).toBeLessThanOrEqual(rect.x + rect.w);
      expect(control.at.y, `${control.id} y inside ${control.section}`).toBeGreaterThanOrEqual(rect.y);
      expect(control.at.y, `${control.id} y inside ${control.section}`).toBeLessThanOrEqual(rect.y + rect.h);
    }
  });

  it('resolves every related and counterpart id', () => {
    for (const control of ALL_CONTROLS) {
      for (const id of [...(control.related ?? []), ...(control.counterpart ?? [])]) {
        expect(ALL_CONTROLS.some((candidate) => candidate.id === id), `${control.id} link ${id}`).toBe(true);
      }
    }
  });

  it('links counterparts across surfaces only', () => {
    for (const control of ALL_CONTROLS) {
      for (const id of control.counterpart ?? []) {
        const counterpart = ALL_CONTROLS.find((candidate) => candidate.id === id);
        expect(counterpart, `${control.id} counterpart ${id}`).toBeDefined();
        expect(counterpart?.surface, `${control.id} counterpart ${id} surface`).not.toBe(control.surface);
      }
    }
  });

  it('uses only canonical behavior sources', () => {
    for (const control of ALL_CONTROLS) {
      expect(['manual', 'rekordbox7', 'community'], `${control.id} primary source`)
        .toContain(control.primary.source);
      if (control.shift) {
        expect(['manual', 'rekordbox7', 'community'], `${control.id} shift source`)
          .toContain(control.shift.source);
      }
    }
  });

  it('gives every behavior useful mechanics and rationale', () => {
    for (const control of ALL_CONTROLS) {
      for (const [name, behavior] of [['primary', control.primary], ['shift', control.shift]] as const) {
        if (!behavior) continue;
        expect(behavior.summary.trim(), `${control.id} ${name} summary`).not.toHaveLength(0);
        expect(behavior.detail.trim().length, `${control.id} ${name} detail`).toBeGreaterThan(20);
        expect(behavior.why.trim().length, `${control.id} ${name} why`).toBeGreaterThan(20);
      }
    }
  });

  it('defines shift behavior for every shift legend', () => {
    for (const control of ALL_CONTROLS) {
      if (control.shiftLegend) {
        expect(control.shift, `${control.id} shift legend`).toBeDefined();
      }
    }
  });

  it('keeps every section rect on an existing surface and inside image bounds', () => {
    for (const [id, section] of Object.entries(SECTIONS)) {
      expect(section.id, `${id} section id`).toBe(id);
      expect(SURFACES[section.surface], `${section.id} surface ${section.surface}`).toBeDefined();
      expect(section.rect.x, `${section.id} rect x`).toBeGreaterThanOrEqual(0);
      expect(section.rect.y, `${section.id} rect y`).toBeGreaterThanOrEqual(0);
      expect(section.rect.w, `${section.id} rect width`).toBeGreaterThan(0);
      expect(section.rect.h, `${section.id} rect height`).toBeGreaterThan(0);
      expect(section.rect.x + section.rect.w, `${section.id} rect right`).toBeLessThanOrEqual(1.0001);
      expect(section.rect.y + section.rect.h, `${section.id} rect bottom`).toBeLessThanOrEqual(1.0001);
      expect(section.marker.x, `${section.id} marker x`).toBeGreaterThanOrEqual(0);
      expect(section.marker.x, `${section.id} marker x`).toBeLessThanOrEqual(1);
      expect(section.marker.y, `${section.id} marker y`).toBeGreaterThanOrEqual(0);
      expect(section.marker.y, `${section.id} marker y`).toBeLessThanOrEqual(1);
    }

    for (const [id, surface] of Object.entries(SURFACES)) {
      expect(surface.id, `${id} surface id`).toBe(id);
    }
  });
});
