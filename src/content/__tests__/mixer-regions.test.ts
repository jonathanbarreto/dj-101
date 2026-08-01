import {describe, expect, it} from 'vitest';

import {mixerControls} from '../hardware/mixer';
import {
  getMixerRegionForControl,
  getMixerVisualRect,
  MIXER_REGIONS,
} from '../hardware/mixerRegions';

describe('mixer teaching regions', () => {
  it('uses the eight binding lesson tabs in signal-flow order', () => {
    expect(MIXER_REGIONS.map(({id, label}) => [id, label])).toEqual([
      ['signal', 'Signal path'],
      ['channel-3', 'CH3'],
      ['channel-1', 'CH1'],
      ['channel-2', 'CH2'],
      ['channel-4', 'CH4'],
      ['outputs', 'Outputs'],
      ['monitoring', 'Headphones + sampler'],
      ['mic', 'Mic'],
    ]);
  });

  it('assigns every control to exactly one non-signal region', () => {
    const assigned = MIXER_REGIONS.flatMap((region) => region.controlIds);
    expect(assigned).toHaveLength(mixerControls.length);
    expect(new Set(assigned).size).toBe(mixerControls.length);
    expect(new Set(assigned)).toEqual(new Set(mixerControls.map(({id}) => id)));
    for (const control of mixerControls) expect(getMixerRegionForControl(control.id)).toBeDefined();
  });

  it('keeps every region crop inside the one hardware master and contains its controls', () => {
    for (const region of MIXER_REGIONS) {
      for (const narrow of [false, true]) {
        const rect = getMixerVisualRect(region.id, narrow);
        expect(rect.x).toBeGreaterThanOrEqual(0);
        expect(rect.y).toBeGreaterThanOrEqual(0);
        expect(rect.x + rect.w).toBeLessThanOrEqual(1);
        expect(rect.y + rect.h).toBeLessThanOrEqual(1);
        for (const id of region.controlIds) {
          const control = mixerControls.find((item) => item.id === id)!;
          expect(control.at.x, `${region.id}/${id} x`).toBeGreaterThanOrEqual(rect.x);
          expect(control.at.x, `${region.id}/${id} x`).toBeLessThanOrEqual(rect.x + rect.w);
          expect(control.at.y, `${region.id}/${id} y`).toBeGreaterThanOrEqual(rect.y);
          expect(control.at.y, `${region.id}/${id} y`).toBeLessThanOrEqual(rect.y + rect.h);
        }
      }
    }
  });
});
