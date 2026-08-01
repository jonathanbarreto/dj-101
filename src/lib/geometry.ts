import type {Point, Rect} from '@/content/types';

/** Maps a master-image point into the crop's fractional viewport space. */
export function toViewport(point: Point, rect: Rect): Point {
  return {
    x: (point.x - rect.x) / rect.w,
    y: (point.y - rect.y) / rect.h,
  };
}

/** Points outside the crop retain outside-0..1 mapping and are not visible. */
export function isVisible(point: Point, rect: Rect): boolean {
  const v = toViewport(point, rect);
  return v.x >= 0 && v.x <= 1 && v.y >= 0 && v.y <= 1;
}

/** Positions the master image so this crop fills the viewport. */
export function cropStyle(rect: Rect): {
  width: string; height: string; left: string; top: string;
} {
  const left = (-rect.x * 100) / rect.w;

  return {
    width: `${100 / rect.w}%`,
    height: `${100 / rect.h}%`,
    left: `${Object.is(left, -0) ? '-0' : left}%`,
    top: `${(-rect.y * 100) / rect.h}%`,
  };
}

/** Returns the crop's pixel aspect ratio in its master image. */
export function cropAspectRatio(
  rect: Rect,
  naturalWidth: number,
  naturalHeight: number,
): number {
  return (rect.w * naturalWidth) / (rect.h * naturalHeight);
}
