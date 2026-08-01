import {describe, expect, it} from 'vitest';

import {cropAspectRatio, cropStyle, isVisible} from '@/lib/geometry';
import {browserControls} from '../hardware/browser';
import {BROWSER_WIDE_RECT, getBrowserVisualRect} from '../hardware/browserVisual';
import {SECTIONS, SURFACES} from '../surfaces';

describe('Browser visual crop', () => {
  it('uses the canonical tight section crop on narrow screens', () => {
    expect(getBrowserVisualRect(true)).toBe(SECTIONS.browser.rect);
  });

  it('uses a wider contextual crop on medium and wide screens', () => {
    expect(getBrowserVisualRect(false)).toBe(BROWSER_WIDE_RECT);
    expect(Number.parseFloat(cropStyle(BROWSER_WIDE_RECT).width)).toBeLessThanOrEqual(800);
    expect(cropAspectRatio(
      BROWSER_WIDE_RECT,
      SURFACES.hardware.naturalWidth,
      SURFACES.hardware.naturalHeight,
    )).toBeGreaterThan(1.6);
  });

  it('keeps all three Browser controls comfortably inside the wide crop', () => {
    for (const control of browserControls) {
      expect(isVisible(control.at, BROWSER_WIDE_RECT), control.id).toBe(true);
      expect(control.at.y - BROWSER_WIDE_RECT.y, `${control.id} top clearance`)
        .toBeGreaterThan(0.04);
      expect(BROWSER_WIDE_RECT.y + BROWSER_WIDE_RECT.h - control.at.y, `${control.id} bottom clearance`)
        .toBeGreaterThan(0.02);
    }
  });
});
