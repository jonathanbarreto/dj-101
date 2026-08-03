import {describe, expect, it} from 'vitest';

import {controlsInSection} from '@/content';

import {controlsForControllerView} from '../controllerHotspots';

const BEAT_FX_TARGETS = {
  'fx-selector': {x: 0.601, y: 0.64},
  'fx-channel-selector': {x: 0.601, y: 0.71},
  'fx-level-depth': {x: 0.601, y: 0.79},
  'fx-on-off': {x: 0.601, y: 0.895},
} as const;

const DECK_HOTSPOT_IDS = [
  'deck-left-loop-in',
  'deck-left-quantize',
  'browser-rotary-selector',
  'deck-left-deck-select',
  'deck-left-jog-dial',
  'deck-left-beat-sync',
  'deck-left-memory',
  'deck-left-master-tempo',
  'deck-left-tempo-slider',
  'deck-left-hot-cue',
  'deck-left-pad-fx-1',
  'deck-left-beat-jump',
  'deck-left-sampler',
  'deck-left-cue',
  'deck-left-pad-grid',
  'deck-left-play-pause',
  'deck-left-key-sync',
] as const;

const DECK_CALIBRATED_TARGETS = {
  'deck-left-jog-dial': {x: 0.17, y: 0.43},
  'deck-left-pad-grid': {x: 0.18, y: 0.86},
  'deck-left-tempo-slider': {x: 0.3027, y: 0.7341},
} as const;

describe('controlsForControllerView', () => {
  it('uses crop-calibrated positions for Beat FX hotspots', () => {
    const mixerControls = controlsForControllerView('mixer');

    for (const [controlId, target] of Object.entries(BEAT_FX_TARGETS)) {
      const terminalControl = mixerControls.find((control) => control.id === controlId);

      expect(terminalControl?.at).toEqual(target);
    }
  });

  it('uses canonical source positions for Deck hotspots', () => {
    const terminalControls = controlsForControllerView('deck-left');

    expect(terminalControls.map((control) => control.id)).toEqual(DECK_HOTSPOT_IDS);

    for (const terminalControl of terminalControls) {
      const canonicalControl = controlsInSection(terminalControl.section)
        .find((control) => control.id === terminalControl.id);

      expect(terminalControl.at).toEqual(
        DECK_CALIBRATED_TARGETS[terminalControl.id as keyof typeof DECK_CALIBRATED_TARGETS]
        ?? canonicalControl?.at,
      );
    }
  });
});
