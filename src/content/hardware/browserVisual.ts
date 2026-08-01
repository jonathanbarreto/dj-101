import type {Rect} from '../types';
import {SECTIONS} from '../surfaces';

/**
 * Desktop context crop: both left-deck Browser controls and their surrounding
 * labels stay readable without scaling the master image to an extreme size.
 */
export const BROWSER_WIDE_RECT: Rect = {
  x: 0.215,
  y: 0.02,
  w: 0.145,
  h: 0.16,
};

export function getBrowserVisualRect(isNarrow: boolean): Rect {
  return isNarrow ? SECTIONS.browser.rect : BROWSER_WIDE_RECT;
}
