import type {Point, Rect} from '@/content/types';

/** Maps a master-image point into the crop's fractional viewport space. */
export function toViewport(point: Point, rect: Rect): Point {
  return {
    x: (point.x - rect.x) / rect.w,
    y: (point.y - rect.y) / rect.h,
  };
}

/**
 * Compares in master space so decimal crop boundaries do not drift past 1
 * during normalization; this matches the content integrity predicate.
 */
export function isVisible(point: Point, rect: Rect): boolean {
  return point.x >= rect.x
    && point.x <= rect.x + rect.w
    && point.y >= rect.y
    && point.y <= rect.y + rect.h;
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

/** Styles a crop canvas at its undistorted master-image aspect ratio. */
export function cropCanvasStyle(
  rect: Rect,
  naturalWidth: number,
  naturalHeight: number,
): {aspectRatio: number; '--crop-aspect-ratio': string} {
  const aspectRatio = cropAspectRatio(rect, naturalWidth, naturalHeight);

  return {
    aspectRatio,
    '--crop-aspect-ratio': String(aspectRatio),
  };
}
