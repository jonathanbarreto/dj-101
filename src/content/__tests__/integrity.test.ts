import {describe, expect, it} from 'vitest';

import {ALL_CONTROLS, SECTIONS, SURFACES} from '../index';

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

  it('does not ship VirtualDJ behavior data', () => {
    for (const control of ALL_CONTROLS) {
      expect(control.primary.source, `${control.id} primary source`).not.toBe('virtualdj');
      expect(control.shift?.source, `${control.id} shift source`).not.toBe('virtualdj');
    }
  });

  it('gives every behavior useful mechanics and rationale', () => {
    for (const control of ALL_CONTROLS) {
      for (const [name, behavior] of [['primary', control.primary], ['shift', control.shift]] as const) {
        if (!behavior) continue;
        expect(behavior.summary, `${control.id} ${name} summary`).not.toHaveLength(0);
        expect(behavior.detail.length, `${control.id} ${name} detail`).toBeGreaterThan(20);
        expect(behavior.why.length, `${control.id} ${name} why`).toBeGreaterThan(20);
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
    for (const section of Object.values(SECTIONS)) {
      expect(SURFACES[section.surface], `${section.id} surface ${section.surface}`).toBeDefined();
      expect(section.rect.x + section.rect.w, `${section.id} rect right`).toBeLessThanOrEqual(1.0001);
      expect(section.rect.y + section.rect.h, `${section.id} rect bottom`).toBeLessThanOrEqual(1.0001);
    }
  });
});
