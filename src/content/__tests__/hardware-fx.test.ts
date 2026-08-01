import {describe, expect, it} from 'vitest';

import {hardwareFxControls} from '../hardware/fx';
import {beatFx} from '../reference/beat-fx';
import {SECTIONS} from '../surfaces';

const byRef = (ref: number) => hardwareFxControls.find((control) => control.ref === ref)!;

describe('DDJ-1000 hardware effects controls', () => {
  it('defines exactly the seven grouped controls with canonical refs and sections', () => {
    expect(hardwareFxControls.map(({ref}) => ref)).toEqual([20, 26, 27, 28, 29, 30, 31]);
    expect(hardwareFxControls).toHaveLength(7);
    expect(byRef(20).section).toBe('mixer');
    expect(hardwareFxControls.filter(({ref}) => ref !== 20).every(({section}) => section === 'fx'))
      .toBe(true);
    expect(byRef(27).shiftLegend).toBe('AUTO / TAP');
    expect(byRef(31).shiftLegend).toBe('RELEASE FX');
  });

  it('teaches global Sound Color selection and per-channel COLOR application', () => {
    const copy = `${byRef(20).primary.detail} ${byRef(20).primary.why} ${byRef(20).primary.gotcha}`;

    expect(copy).toMatch(/DUB ECHO.*PITCH.*NOISE.*FILTER/i);
    expect(copy).toMatch(/one effect.*all (four )?channels|global/i);
    expect(copy).toMatch(/press.*selected.*again.*cancel|cancel.*press/i);
    expect(copy).toMatch(/flash/i);
    expect(copy).toMatch(/each channel.*COLOR|per-channel COLOR/i);
    expect(copy).toMatch(/centre.*off/i);
    expect(copy).toMatch(/external (input|source)/i);
    expect(copy).toMatch(/onboard.*external input/i);
    expect(copy).toMatch(/rekordbox functions.*cannot.*external input/i);
    expect(byRef(20).referenceLinks).toEqual([
      {href: '/reference/sound-color-fx', label: 'Compare the four Sound Color FX directions'},
    ]);
  });

  it('names and explains all five Beat FX display fields', () => {
    const copy = `${byRef(26).primary.detail} ${byRef(26).primary.gotcha}`;

    expect(copy).toMatch(/effect name/i);
    expect(copy).toMatch(/AUTO.*TAP/i);
    expect(copy).toMatch(/BPM.*flash/i);
    expect(copy).toMatch(/beat fraction|beat value/i);
    expect(copy).toMatch(/parameter/i);
    expect(copy).toMatch(/SP.*MIC.*CH1.*CH2.*CH3.*CH4.*MST/i);
  });

  it('teaches beat timing, AUTO/TAP entry, and the detection fallback precisely', () => {
    const control = byRef(27);
    const primary = `${control.primary.detail} ${control.primary.why}`;
    const shift = `${control.shift?.detail} ${control.shift?.why} ${control.shift?.gotcha}`;

    expect(primary).toMatch(/left.*short|short.*left/i);
    expect(primary).toMatch(/right.*long|long.*right/i);
    expect(primary).toMatch(/timing.*parameter|parameter.*effect/i);
    expect(shift).toMatch(/SHIFT.*left.*AUTO/i);
    expect(shift).toMatch(/SHIFT.*right.*TAP/i);
    expect(shift).toMatch(/quarter-note.*more than two.*average|more than two.*average.*quarter-note/i);
    expect(shift).toMatch(/70.*180.*BPM/i);
    expect(shift).toMatch(/flash.*TAP|TAP.*flash/i);
  });

  it('teaches selector order by linking the canonical table without duplicating it', () => {
    const control = byRef(28);
    const copy = `${control.primary.summary} ${control.primary.detail} ${control.primary.why}`;

    expect(copy).toMatch(/14/i);
    expect(copy).not.toContain(beatFx.map(({name}) => name).join(', '));
    expect(control.referenceLinks).toEqual([
      {href: '/reference/beat-fx', label: 'Compare all 14 Beat FX and LEVEL/DEPTH roles'},
    ]);
  });

  it('distinguishes Beat FX routing, target choices, and the master bus', () => {
    const copy = `${byRef(29).primary.detail} ${byRef(29).primary.why} ${byRef(29).primary.gotcha}`;

    expect(copy).toMatch(/CH1.*CH2.*CH3.*CH4/i);
    expect(copy).toMatch(/MIC.*SP.*sampler/i);
    expect(copy).toMatch(/MST.*whole (master )?mix|MST.*summed/i);
    expect(copy).toMatch(/routes|target/i);
  });

  it('never mislabels LEVEL/DEPTH as a generic wet/dry control', () => {
    const control = byRef(30);
    const copy = `${control.primary.detail} ${control.primary.why} ${control.primary.gotcha}`;

    expect(copy).toMatch(/differs|effect-specific/i);
    expect(copy).toMatch(/intensity|feedback|pitch|duty ratio|balance/i);
    expect(copy).not.toMatch(/always (a )?wet.dry|sets (the )?wet.dry/i);
    expect(control.referenceLinks?.map(({href}) => href)).toContain('/reference/beat-fx');
  });

  it('teaches ON/OFF, a safe setup order, and configurable Release FX without inventing gestures', () => {
    const control = byRef(31);
    const primary = `${control.primary.detail} ${control.primary.why} ${control.primary.gotcha}`;
    const shift = `${control.shift?.detail} ${control.shift?.why} ${control.shift?.gotcha}`;

    expect(primary).toMatch(/press.*on.*press.*off/i);
    expect(primary).toMatch(/flash/i);
    expect(primary).toMatch(/effect.*target.*beat.*LEVEL.DEPTH.*ON.OFF/i);
    expect(shift).toMatch(/configur.*rekordbox 7/i);
    expect(shift).toMatch(/exit|release/i);
    expect(shift).toMatch(/cancel.*Beat FX/i);
    expect(shift).toMatch(/Sound Color FX.*preference|preference.*Sound Color FX/i);
    expect(control.shift?.source).toBe('rekordbox7');
    expect(shift).toMatch(/USB|software source/i);
    expect(shift).toMatch(/cannot.*analogue external input|analogue external input.*cannot/i);
    expect(shift).not.toMatch(/always hold|is momentary|is latched|has a fixed tail/i);
  });

  it('keeps the measured points inside useful one-master crops', () => {
    expect(byRef(20).at).toEqual({x: 0.37, y: 0.486});
    expect(hardwareFxControls.slice(1).map(({at}) => at)).toEqual([
      {x: 0.62, y: 0.52},
      {x: 0.62, y: 0.585},
      {x: 0.62, y: 0.659},
      {x: 0.62, y: 0.739},
      {x: 0.62, y: 0.825},
      {x: 0.62, y: 0.933},
    ]);
    expect(SECTIONS.fx.rect.w).toBeGreaterThanOrEqual(0.4);
    expect(1 / SECTIONS.fx.rect.w).toBeLessThanOrEqual(2.5);
    for (const control of hardwareFxControls.filter(({section}) => section === 'fx')) {
      const rect = SECTIONS.fx.rect;
      expect(control.at.x).toBeGreaterThanOrEqual(rect.x);
      expect(control.at.x).toBeLessThanOrEqual(rect.x + rect.w);
      expect(control.at.y).toBeGreaterThanOrEqual(rect.y);
      expect(control.at.y).toBeLessThanOrEqual(rect.y + rect.h);
    }
  });

  it('uses substantial manual-sourced teaching and valid reference routes', () => {
    const validRoutes = new Set(['/reference/beat-fx', '/reference/sound-color-fx']);

    for (const control of hardwareFxControls) {
      for (const behavior of [control.primary, control.shift].filter(Boolean)) {
        if (control.ref === 31 && behavior === control.shift) {
          expect(behavior!.source, control.id).toBe('rekordbox7');
        } else {
          expect(behavior!.source, control.id).toBe('manual');
        }
        expect(behavior!.detail.length, `${control.id} detail`).toBeGreaterThan(100);
        expect(behavior!.why.length, `${control.id} why`).toBeGreaterThan(100);
        expect(['manual', 'rekordbox7']).toContain(behavior!.source);
      }
      for (const link of control.referenceLinks ?? []) {
        expect(validRoutes.has(link.href), `${control.id} ${link.href}`).toBe(true);
      }
    }
  });
});
