import {describe, expect, it} from 'vitest';
import {isVisible, cropAspectRatio} from '@/lib/geometry';
import {SURFACES} from '../surfaces';
import {deckControls} from '../hardware/deck';
import {rightDeckControls} from '../hardware/right-deck';
import {
  controlsForDeckRegion,
  DECK_REGIONS,
} from '../hardware/deckRegions';

const controls = [...deckControls, ...rightDeckControls];

describe('hardware deck lesson regions', () => {
  it('keeps every assigned control visible in its same-master crop on both decks', () => {
    for (const region of DECK_REGIONS) {
      for (const side of ['deck-left', 'deck-right'] as const) {
        const rect = region.rect[side];
        for (const id of controlsForDeckRegion(region, side)) {
          const control = controls.find((candidate) => candidate.id === id);
          expect(control, `${region.id}/${side} missing ${id}`).toBeDefined();
          expect(isVisible(control!.at, rect), `${id} outside ${region.id} crop`).toBe(true);
        }
      }
    }
  });

  it('limits every region to at most 2x horizontal magnification and two desktop viewports', () => {
    const surface = SURFACES.hardware;
    for (const region of DECK_REGIONS) {
      for (const side of ['deck-left', 'deck-right'] as const) {
        const rect = region.rect[side];
        expect(1 / rect.w, `${region.id}/${side} magnification`).toBeLessThanOrEqual(2);
        const aspect = cropAspectRatio(rect, surface.naturalWidth, surface.naturalHeight);
        expect(1440 / aspect, `${region.id}/${side} stage height`).toBeLessThan(1800);
      }
    }
  });
});
