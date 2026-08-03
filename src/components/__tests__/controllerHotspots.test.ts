import {describe, expect, it} from 'vitest';

import {controlsInSection} from '@/content';

import {controlsForControllerView} from '../controllerHotspots';

const BEAT_FX_TARGETS = {
  'fx-selector': {x: 0.601, y: 0.64},
  'fx-channel-selector': {x: 0.601, y: 0.71},
  'fx-level-depth': {x: 0.601, y: 0.79},
  'fx-on-off': {x: 0.601, y: 0.895},
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

    for (const terminalControl of terminalControls) {
      const canonicalControl = controlsInSection(terminalControl.section)
        .find((control) => control.id === terminalControl.id);

      expect(terminalControl.at).toEqual(canonicalControl?.at);
    }
  });
});
