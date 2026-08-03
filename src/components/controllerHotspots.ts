import {controlsInSection} from '@/content';
import type {Control, Point, SectionId} from '@/content/types';

export type ControllerTerminalView = 'deck-left' | 'mixer';

interface ControllerHotspotSpec {
  controlId: string;
  sourceSection: SectionId;
  at?: Point;
}

const TERMINAL_HOTSPOTS: Record<ControllerTerminalView, ControllerHotspotSpec[]> = {
  'deck-left': [
    {controlId: 'deck-left-loop-in', sourceSection: 'deck-left'},
    {controlId: 'deck-left-quantize', sourceSection: 'deck-left'},
    {controlId: 'browser-rotary-selector', sourceSection: 'browser'},
    {controlId: 'deck-left-deck-select', sourceSection: 'deck-left'},
    {controlId: 'deck-left-jog-dial', sourceSection: 'deck-left', at: {x: 0.17, y: 0.43}},
    {controlId: 'deck-left-beat-sync', sourceSection: 'deck-left'},
    {controlId: 'deck-left-memory', sourceSection: 'deck-left'},
    {controlId: 'deck-left-tempo-slider', sourceSection: 'deck-left'},
    {controlId: 'deck-left-hot-cue', sourceSection: 'deck-left'},
    {controlId: 'deck-left-pad-fx-1', sourceSection: 'deck-left'},
    {controlId: 'deck-left-beat-jump', sourceSection: 'deck-left'},
    {controlId: 'deck-left-sampler', sourceSection: 'deck-left'},
    {controlId: 'deck-left-cue', sourceSection: 'deck-left'},
    {controlId: 'deck-left-pad-grid', sourceSection: 'deck-left', at: {x: 0.18, y: 0.86}},
    {controlId: 'deck-left-play-pause', sourceSection: 'deck-left'},
    {controlId: 'deck-left-key-sync', sourceSection: 'deck-left'},
  ],
  mixer: [
    {controlId: 'mixer-master-level', sourceSection: 'mixer', at: {x: 0.63, y: 0.09}},
    {controlId: 'mixer-ch1-input', sourceSection: 'mixer', at: {x: 0.4645, y: 0.0751}},
    {controlId: 'mixer-ch1-trim', sourceSection: 'mixer', at: {x: 0.4645, y: 0.1513}},
    {controlId: 'mixer-ch1-high', sourceSection: 'mixer', at: {x: 0.4645, y: 0.2318}},
    {controlId: 'mixer-ch1-mid', sourceSection: 'mixer', at: {x: 0.4645, y: 0.3136}},
    {controlId: 'mixer-ch1-low', sourceSection: 'mixer', at: {x: 0.4645, y: 0.4047}},
    {controlId: 'mixer-sound-color-fx-select', sourceSection: 'mixer', at: {x: 0.37, y: 0.486}},
    {controlId: 'mixer-ch1-color', sourceSection: 'mixer', at: {x: 0.4645, y: 0.4938}},
    {controlId: 'mixer-headphones-mixing', sourceSection: 'mixer', at: {x: 0.35, y: 0.67}},
    // Beat FX source coordinates are authored for the full-controller frame.
    // These terminal-view positions are calibrated to the focused Mixer crop.
    {controlId: 'fx-selector', sourceSection: 'fx', at: {x: 0.601, y: 0.64}},
    {controlId: 'mixer-ch1-fader', sourceSection: 'mixer', at: {x: 0.48, y: 0.71}},
    {controlId: 'fx-channel-selector', sourceSection: 'fx', at: {x: 0.601, y: 0.71}},
    {controlId: 'fx-level-depth', sourceSection: 'fx', at: {x: 0.601, y: 0.79}},
    {controlId: 'fx-on-off', sourceSection: 'fx', at: {x: 0.601, y: 0.895}},
    {controlId: 'mixer-crossfader', sourceSection: 'mixer', at: {x: 0.48, y: 0.94}},
  ],
};

export function controlsForControllerView(view: ControllerTerminalView): Control[] {
  return TERMINAL_HOTSPOTS[view].flatMap((spec) => {
    const control = controlsInSection(spec.sourceSection)
      .find((candidate) => candidate.id === spec.controlId);
    return control ? [{...control, at: spec.at ?? control.at}] : [];
  });
}
