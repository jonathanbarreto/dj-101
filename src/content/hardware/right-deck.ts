import type {Behavior, Control, Point} from '../types';
import {deckControls} from './deck';

/** Direct picks from /dev/coords against the one hardware master image. */
const RIGHT_DECK_POINTS: Record<string, Point> = {
  'jog-dial': {x: 0.7352, y: 0.4391},
  quantize: {x: 0.8443, y: 0.0723},
  slip: {x: 0.8724, y: 0.0723},
  'jog-feeling-adjust': {x: 0.9342, y: 0.2169},
  'beat-sync': {x: 0.9374, y: 0.5381},
  'master-tempo': {x: 0.8949, y: 0.6963},
  'tempo-slider': {x: 0.9262, y: 0.7998},
  'hot-cue': {x: 0.7199, y: 0.6963},
  'pad-fx-1': {x: 0.7488, y: 0.6963},
  'beat-jump': {x: 0.7817, y: 0.6963},
  sampler: {x: 0.8162, y: 0.6963},
  page: {x: 0.8596, y: 0.6963},
  'key-sync': {x: 0.8949, y: 0.7877},
  'key-reset': {x: 0.8949, y: 0.8394},
  'play-pause': {x: 0.6653, y: 0.8486},
  cue: {x: 0.6653, y: 0.7298},
  search: {x: 0.6677, y: 0.6355},
  memory: {x: 0.6557, y: 0.5837},
  'deck-select': {x: 0.6477, y: 0.2169},
  'slip-reverse': {x: 0.6565, y: 0.1423},
  'loop-in': {x: 0.6477, y: 0.0723},
  'loop-out': {x: 0.6830, y: 0.0723},
  'loop-exit': {x: 0.7287, y: 0.0738},
  'pad-grid': {x: 0.7913, y: 0.8135},
};

const rightDeckSelect: Behavior = {
  summary: 'Chooses whether this side controls deck 2 or deck 4',
  detail:
    'DECK SELECT switches this physical right deck between rekordbox decks 2 and 4. The jog display and every control on this side follow the selected software deck. The mixer keeps its club-standard 3 · 1 · 2 · 4 strip order, so deck 2 is the inner-right channel and deck 4 is the outer-right channel.',
  why:
    'Check the jog display, then switch to deck 4 when you need a third or fourth layer without giving up the track already playing on deck 2. Confirm the matching channel fader and headphone cue before pressing PLAY so a quiet preparation deck does not become an on-air mistake.',
  gotcha:
    'The physical controls do not move when the layer changes; read the jog display deck number before touching transport, tempo, or the platter.',
  source: 'manual',
};

/**
 * The hardware is a translated duplicate, not a mirrored UI. Reusing the
 * Behavior objects keeps the two lessons identical unless the mechanism
 * genuinely differs: only DECK SELECT changes from the 3/1 to the 2/4 layer.
 */
export const rightDeckControls: Control[] = deckControls.map((left): Control => {
  const isDeckSelect = left.ref === 36;
  const slug = left.id.replace('deck-left-', '');
  const point = RIGHT_DECK_POINTS[slug];

  if (!point) throw new Error(`Missing measured right-deck point for ${slug}`);

  return {
    ...left,
    id: `deck-right-${slug}`,
    section: 'deck-right',
    label: isDeckSelect ? 'DECK SELECT 2/4' : left.label,
    at: point,
    primary: isDeckSelect ? rightDeckSelect : left.primary,
  };
});
