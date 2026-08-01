import type {Point, Rect} from '../types';

export type RbDeckRegionId = 'info' | 'sync' | 'wave' | 'pads' | 'loop' | 'jog';

export interface RbDeckRegion {
  id: RbDeckRegionId;
  label: string;
  rect: Rect;
  controlIds: readonly string[];
}

export const RB_DECK_DESKTOP_RECT: Rect = {x: 0, y: 0.268, w: 0.48, h: 0.265};

const narrowVisualRects: Readonly<Record<RbDeckRegionId, Rect>> = {
  info: {x: 0, y: 0.255, w: 0.24, h: 0.143},
  sync: {x: 0.24, y: 0.255, w: 0.24, h: 0.143},
  wave: RB_DECK_DESKTOP_RECT,
  pads: {x: 0, y: 0.38, w: 0.48, h: 0.17},
  loop: {x: 0.3, y: 0.395, w: 0.18, h: 0.138},
  jog: {x: 0.3, y: 0.395, w: 0.18, h: 0.138},
};

/** Same-master crops measured from the 1200x634 software master via /dev/coords. */
export const RB_DECK_REGIONS: readonly RbDeckRegion[] = [
  {
    id: 'info', label: 'Info', rect: {x: 0.014, y: 0.268, w: 0.14, h: 0.11},
    controlIds: [
      'rb-deck-artwork', 'rb-deck-title', 'rb-deck-artist',
      'rb-deck-original-bpm', 'rb-deck-original-key',
    ],
  },
  {
    id: 'sync', label: 'Sync', rect: {x: 0.315, y: 0.268, w: 0.16, h: 0.11},
    controlIds: [
      'rb-deck-remaining-time', 'rb-deck-elapsed-time', 'rb-deck-key-sync',
      'rb-deck-key-shift', 'rb-deck-beat-sync', 'rb-deck-master',
    ],
  },
  {
    id: 'wave', label: 'Wave', rect: {x: 0.17, y: 0.31, w: 0.285, h: 0.1},
    controlIds: [
      'rb-deck-hot-cue-marker', 'rb-deck-cue-point-marker',
      'rb-deck-lighting-scenes', 'rb-deck-stems',
    ],
  },
  {
    id: 'pads', label: 'Pads', rect: {x: 0, y: 0.405, w: 0.31, h: 0.12},
    controlIds: [
      'rb-deck-performance-pad-toggle', 'rb-deck-grid-edit-toggle',
      'rb-deck-performance-pads',
    ],
  },
  {
    id: 'loop', label: 'Loop', rect: {x: 0.325, y: 0.405, w: 0.065, h: 0.115},
    controlIds: [
      'rb-deck-auto-loop', 'rb-deck-loop-length', 'rb-deck-loop-mode',
      'rb-deck-dvs-mode',
    ],
  },
  {
    id: 'jog', label: 'Jog', rect: {x: 0.36, y: 0.405, w: 0.11, h: 0.12},
    controlIds: [
      'rb-deck-cue', 'rb-deck-play-pause', 'rb-deck-jog-tempo',
      'rb-deck-slip', 'rb-deck-quantize', 'rb-deck-master-tempo',
    ],
  },
];

const markerOffsets: Readonly<Record<string, Point>> = {
  'rb-deck-artwork': {x: 3, y: 0},
  'rb-deck-original-bpm': {x: 0, y: 36},
  'rb-deck-original-key': {x: 11, y: 0},
  'rb-deck-key-shift': {x: 0, y: 27},
  'rb-deck-master': {x: 0, y: 27},
  'rb-deck-hot-cue-marker': {x: -10, y: 0},
  'rb-deck-cue-point-marker': {x: 22, y: 0},
  'rb-deck-lighting-scenes': {x: 55, y: 0},
  'rb-deck-performance-pad-toggle': {x: 17, y: 0},
  'rb-deck-grid-edit-toggle': {x: 62, y: -2},
  'rb-deck-auto-loop': {x: -20, y: 0},
  'rb-deck-loop-length': {x: 25, y: 0},
  'rb-deck-loop-mode': {x: -20, y: 0},
  'rb-deck-slip': {x: -48, y: 0},
};

const desktopMarkerOffsets: Readonly<Record<string, Point>> = {
  ...markerOffsets,
  'rb-deck-title': {x: 0, y: 9},
  'rb-deck-key-sync': {x: 0, y: 9},
  'rb-deck-key-shift': {x: 0, y: 36},
  'rb-deck-beat-sync': {x: 0, y: 9},
  'rb-deck-master': {x: 0, y: 37},
  'rb-deck-loop-length': {x: -67, y: 0},
  'rb-deck-cue': {x: -23, y: 0},
  'rb-deck-play-pause': {x: 23, y: -3},
  'rb-deck-slip': {x: -48, y: -8},
  'rb-deck-master-tempo': {x: 0, y: -4},
};

export function getRbDeckRegion(id: RbDeckRegionId): RbDeckRegion {
  return RB_DECK_REGIONS.find((region) => region.id === id) ?? RB_DECK_REGIONS[0];
}

export function getRbDeckRegionForControl(controlId: string): RbDeckRegion | undefined {
  return RB_DECK_REGIONS.find((region) => region.controlIds.includes(controlId));
}

export function getRbDeckMarkerOffset(controlId: string, isNarrow = true): Point {
  const offsets = isNarrow ? markerOffsets : desktopMarkerOffsets;
  return offsets[controlId] ?? {x: 0, y: 0};
}

export function getRbDeckVisualRect(regionId: RbDeckRegionId, isNarrow: boolean): Rect {
  return isNarrow ? narrowVisualRects[regionId] : RB_DECK_DESKTOP_RECT;
}
