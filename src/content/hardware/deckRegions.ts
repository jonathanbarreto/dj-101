import type {Rect, SectionId} from '../types';

export type DeckRegionId = 'transport' | 'jog' | 'pads';

export interface DeckRegion {
  id: DeckRegionId;
  label: string;
  leftControlIds: readonly string[];
  rect: Record<'deck-left' | 'deck-right', Rect>;
}

const ids = (...slugs: string[]) => slugs.map((slug) => `deck-left-${slug}`);

export const DECK_REGIONS: readonly DeckRegion[] = [
  {
    id: 'transport',
    label: 'Loop / transport',
    leftControlIds: ids(
      'loop-in', 'loop-out', 'loop-exit', 'deck-select', 'slip-reverse',
    ),
    rect: {
      'deck-left': {x: 0, y: 0.01, w: 0.5, h: 0.3},
      'deck-right': {x: 0.5, y: 0.01, w: 0.5, h: 0.3},
    },
  },
  {
    id: 'jog',
    label: 'Jog / tempo',
    leftControlIds: ids(
      'jog-dial', 'jog-feeling-adjust', 'beat-sync', 'master-tempo',
      'tempo-slider', 'quantize', 'slip',
    ),
    rect: {
      'deck-left': {x: 0, y: 0.08, w: 0.5, h: 0.67},
      'deck-right': {x: 0.5, y: 0.08, w: 0.5, h: 0.67},
    },
  },
  {
    id: 'pads',
    label: 'Pads / key',
    leftControlIds: ids(
      'hot-cue', 'pad-fx-1', 'beat-jump', 'sampler', 'page',
      'key-sync', 'key-reset', 'pad-grid', 'memory', 'search',
      'play-pause', 'cue',
    ),
    rect: {
      'deck-left': {x: 0, y: 0.56, w: 0.5, h: 0.43},
      'deck-right': {x: 0.5, y: 0.56, w: 0.5, h: 0.43},
    },
  },
];

function normalizeLeftId(controlId: string): string {
  return controlId.replace(/^deck-right-/, 'deck-left-');
}

export function isDeckSection(sectionId?: SectionId): sectionId is 'deck-left' | 'deck-right' {
  return sectionId === 'deck-left' || sectionId === 'deck-right';
}

export function getDeckRegion(id: DeckRegionId): DeckRegion {
  return DECK_REGIONS.find((region) => region.id === id) ?? DECK_REGIONS[0];
}

export function getDeckRegionForControl(controlId: string): DeckRegion | undefined {
  const leftId = normalizeLeftId(controlId);
  return DECK_REGIONS.find((region) => region.leftControlIds.includes(leftId));
}

export function controlsForDeckRegion(region: DeckRegion, sectionId: 'deck-left' | 'deck-right'): string[] {
  return region.leftControlIds.map((id) => (
    sectionId === 'deck-left' ? id : id.replace(/^deck-left-/, 'deck-right-')
  ));
}

export function getDeckVisualRect(regionId: DeckRegionId, sectionId: 'deck-left' | 'deck-right'): Rect {
  return getDeckRegion(regionId).rect[sectionId];
}
