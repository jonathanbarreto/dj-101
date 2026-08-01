import {describe, expect, it} from 'vitest';

import {cropAspectRatio, toViewport} from '@/lib/geometry';
import {rbDeckControls} from '../rekordbox/deck';
import {
  RB_DECK_REGIONS,
  getRbDeckVisualRect,
  getRbDeckRegionForControl,
  getRbDeckMarkerOffset,
} from '../rekordbox/deckRegions';

describe('rekordbox deck responsive regions', () => {
  it('assigns every control to exactly one explicit region', () => {
    const ids = RB_DECK_REGIONS.flatMap((region) => region.controlIds);
    expect(ids).toHaveLength(rbDeckControls.length);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(ids)).toEqual(new Set(rbDeckControls.map((control) => control.id)));

    for (const control of rbDeckControls) {
      const region = getRbDeckRegionForControl(control.id);
      expect(region, control.id).toBeDefined();
      expect(control.at.x).toBeGreaterThanOrEqual(region!.rect.x);
      expect(control.at.x).toBeLessThanOrEqual(region!.rect.x + region!.rect.w);
      expect(control.at.y).toBeGreaterThanOrEqual(region!.rect.y);
      expect(control.at.y).toBeLessThanOrEqual(region!.rect.y + region!.rect.h);
    }
  });

  it.each([375, 768, 1280])(
    'keeps 44px marker targets from overlapping at a %ipx viewport',
    (width) => {
      for (const region of RB_DECK_REGIONS) {
        const visualRect = getRbDeckVisualRect(region.id, width < 768);
        const height = width / cropAspectRatio(visualRect, 1200, 634);
        const centers = region.controlIds.map((id) => {
          const control = rbDeckControls.find((candidate) => candidate.id === id)!;
          const point = toViewport(control.at, visualRect);
          const offset = getRbDeckMarkerOffset(id, width < 768);
          return {id, x: point.x * width + offset.x, y: point.y * height + offset.y};
        });

        for (let left = 0; left < centers.length; left += 1) {
          for (let right = left + 1; right < centers.length; right += 1) {
            const a = centers[left];
            const b = centers[right];
            const overlaps = Math.abs(a.x - b.x) < 44 && Math.abs(a.y - b.y) < 44;
            expect(overlaps, `${region.id}: ${a.id} overlaps ${b.id} at ${width}px`).toBe(false);
          }
        }
      }
    },
  );

  it('uses the full player-deck crop on desktop and caps narrow enlargement', () => {
    const fullDeck = {x: 0, y: 0.268, w: 0.48, h: 0.265};

    for (const region of RB_DECK_REGIONS) {
      expect(getRbDeckVisualRect(region.id, false)).toEqual(fullDeck);
      expect(375 / (getRbDeckVisualRect(region.id, true).w * 1200)).toBeLessThanOrEqual(2);
    }
  });
});
