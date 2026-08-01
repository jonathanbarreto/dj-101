import {describe, it, expect} from 'vitest';
import {toViewport, isVisible, cropAspectRatio, cropStyle} from '../geometry';

const FULL = {x: 0, y: 0, w: 1, h: 1};
const RIGHT_HALF = {x: 0.5, y: 0, w: 0.5, h: 1};

describe('toViewport', () => {
  it('is the identity for a full-image crop', () => {
    expect(toViewport({x: 0.25, y: 0.75}, FULL)).toEqual({x: 0.25, y: 0.75});
  });
  it('maps a crop-relative point into viewport space', () => {
    expect(toViewport({x: 0.75, y: 0.5}, RIGHT_HALF)).toEqual({x: 0.5, y: 0.5});
  });
  it('maps the crop origin to the viewport origin', () => {
    expect(toViewport({x: 0.5, y: 0}, RIGHT_HALF)).toEqual({x: 0, y: 0});
  });
  it('returns values outside 0..1 for points outside the crop', () => {
    expect(toViewport({x: 0.25, y: 0.5}, RIGHT_HALF).x).toBeLessThan(0);
  });
});

describe('isVisible', () => {
  it('accepts a point inside the crop', () => {
    expect(isVisible({x: 0.75, y: 0.5}, RIGHT_HALF)).toBe(true);
  });
  it('rejects a point outside the crop', () => {
    expect(isVisible({x: 0.25, y: 0.5}, RIGHT_HALF)).toBe(false);
  });
  it('accepts a point exactly on the boundary', () => {
    expect(isVisible({x: 0.5, y: 0}, RIGHT_HALF)).toBe(true);
  });
  it('accepts the exact right edge of a decimal crop', () => {
    expect(isVisible({x: 1, y: 0.5}, {x: 0.7, y: 0, w: 0.3, h: 1})).toBe(true);
  });
  it('accepts the exact bottom edge of a decimal crop', () => {
    expect(isVisible({x: 0.5, y: 1}, {x: 0, y: 0.7, w: 1, h: 0.3})).toBe(true);
  });
});

describe('cropStyle', () => {
  it('scales the image so the crop fills the viewport', () => {
    expect(cropStyle(RIGHT_HALF).width).toBe('200%');
    expect(cropStyle(RIGHT_HALF).height).toBe('100%');
  });
  it('offsets the image so the crop origin sits at the viewport origin', () => {
    expect(cropStyle(RIGHT_HALF).left).toBe('-100%');
    expect(cropStyle(RIGHT_HALF).top).toBe('0%');
  });
  it('is a no-op for a full crop', () => {
    const s = cropStyle(FULL);
    expect(s.width).toBe('100%');
    expect(s.left).toBe('-0%');
  });
  it('scales and offsets vertically for a partial-height crop', () => {
    const s = cropStyle({x: 0, y: 0.25, w: 1, h: 0.5});
    expect(s.height).toBe('200%');
    expect(s.top).toBe('-50%');
  });
});

describe('cropAspectRatio', () => {
  it('returns the cropped image pixel aspect ratio', () => {
    expect(cropAspectRatio({x: 0, y: 0, w: 0.5, h: 0.25}, 1920, 1080)).toBe(32 / 9);
  });
});
