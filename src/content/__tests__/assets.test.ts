import {describe, expect, it} from 'vitest';
import {DETAIL_ASSETS, detailAssetsForLesson} from '../assets';

describe('supplemental hardware detail assets', () => {
  it('keeps a single canonical master per surface', () => {
    expect(Object.keys(DETAIL_ASSETS)).not.toContain('hardware');
    expect(Object.keys(DETAIL_ASSETS)).not.toContain('software');
  });

  it('provides useful accessible metadata for the taught hardware areas', () => {
    for (const lesson of ['deck-left', 'deck-right', 'mixer', 'fx', 'rear', 'front', 'rb-deck']) {
      const assets = detailAssetsForLesson(lesson);
      expect(assets.length, lesson).toBeGreaterThan(0);
      for (const asset of assets) {
        expect(asset.src).toMatch(/^\/images\/details\//);
        expect(asset.alt.length, `${lesson}/${asset.id} alt`).toBeGreaterThan(30);
        expect(asset.caption.length, `${lesson}/${asset.id} caption`).toBeGreaterThan(20);
        expect(asset.width).toBeGreaterThan(0);
        expect(asset.height).toBeGreaterThan(0);
      }
    }
  });

});
