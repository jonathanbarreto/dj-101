import {describe, expect, it} from 'vitest';

import {mixerControls} from '../hardware/mixer';
import {hardwareFxControls} from '../hardware/fx';
import {SURFACES} from '../surfaces';
import {cropAspectRatio} from '../../lib/geometry';
import {
  getMixerRegionForControl,
  getMixerVisualRect,
  MIXER_REGIONS,
} from '../hardware/mixerRegions';

describe('mixer teaching regions', () => {
  it('uses six consolidated lesson tabs in signal-flow order', () => {
    expect(MIXER_REGIONS.map(({id, label}) => [id, label])).toEqual([
      ['signal', 'Signal path'],
      ['channels', 'Four channels'],
      ['color-fx', 'Color FX'],
      ['outputs', 'Outputs'],
      ['monitoring', 'Headphones + sampler'],
      ['mic', 'Mic'],
    ]);
  });

  it('orders the microphone lesson from operating mode through tone shaping', () => {
    expect(MIXER_REGIONS.find((region) => region.id === 'mic')?.controlIds).toEqual([
      'mixer-mic-mode',
      'mixer-mic1-level',
      'mixer-mic2-level',
      'mixer-mic-high',
      'mixer-mic-low',
    ]);
  });

  it('shows representative channel controls while resolving every legacy channel hash', () => {
    const assigned = MIXER_REGIONS.flatMap((region) => region.controlIds);
    const mixerLessonControls = [
      ...mixerControls,
      ...hardwareFxControls.filter(({section}) => section === 'mixer'),
    ];
    expect(assigned).toHaveLength(26);
    expect(new Set(assigned).size).toBe(26);
    expect(assigned).toContain('mixer-ch2-trim');
    expect(assigned).toContain('mixer-ch3-input');
    expect(assigned).not.toContain('mixer-ch1-trim');
    for (const control of mixerControls) expect(getMixerRegionForControl(control.id)).toBeDefined();
    for (const channel of [1, 2, 3, 4]) {
      expect(getMixerRegionForControl(`mixer-ch${channel}-trim`)?.id).toBe('channels');
    }
    expect(getMixerRegionForControl('mixer-sound-color-fx-select')?.id).toBe('color-fx');
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
          const control = [...mixerControls, ...hardwareFxControls].find((item) => item.id === id)!;
          expect(control.at.x, `${region.id}/${id} x`).toBeGreaterThanOrEqual(rect.x);
          expect(control.at.x, `${region.id}/${id} x`).toBeLessThanOrEqual(rect.x + rect.w);
          expect(control.at.y, `${region.id}/${id} y`).toBeGreaterThanOrEqual(rect.y);
          expect(control.at.y, `${region.id}/${id} y`).toBeLessThanOrEqual(rect.y + rect.h);
        }
      }
    }
  });

  it('uses legible contextual crops instead of extreme full-height strip enlargement', () => {
    const hardware = SURFACES.hardware;
    for (const region of MIXER_REGIONS) {
      for (const narrow of [false, true]) {
        const rect = getMixerVisualRect(region.id, narrow);
        const aspect = cropAspectRatio(rect, hardware.naturalWidth, hardware.naturalHeight);
        expect(rect.w, `${region.id} context width`).toBeGreaterThanOrEqual(0.5);
        expect(1 / rect.w, `${region.id} horizontal enlargement`).toBeLessThanOrEqual(2);
        expect(1280 / aspect, `${region.id} 1280px stage height`).toBeLessThanOrEqual(1800);
      }
    }
  });
});
