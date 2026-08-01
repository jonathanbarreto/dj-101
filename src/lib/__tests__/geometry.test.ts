import {describe, it, expect} from 'vitest';
import {toViewport, isVisible, cropStyle} from '../geometry';

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
});
