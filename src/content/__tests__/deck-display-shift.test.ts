import {describe, expect, it} from 'vitest';
import {deckControls} from '../hardware/deck';
import {rightDeckControls} from '../hardware/right-deck';

describe('deck display and pad SHIFT lessons', () => {
  it('teaches every documented on-jog display indicator and customization', () => {
    const jog = deckControls.find(({id}) => id === 'deck-left-jog-dial')!;
    const lesson = `${jog.primary.detail} ${jog.primary.why} ${(jog.primary.tips ?? []).join(' ')}`;

    for (const expected of [
      /deck number/i,
      /artwork/i,
      /current key/i,
      /key variation/i,
      /CUE SCOPE/i,
      /4 bars behind.*16 bars ahead/is,
      /white.*blue.*red/is,
      /on-air.*off-air/is,
      /cue point/i,
      /BPM/i,
      /playback speed/i,
      /tempo range/i,
      /waveform/i,
      /cue.*loop.*Hot Cue/is,
      /playback-position needle/i,
      /elapsed.*remaining/is,
      /MASTER.*SYNC/is,
      /waveform colo(?:u)?r/i,
      /hiding artwork.*BPM/is,
    ]) expect(lesson).toMatch(expected);
  });

  it('scopes SHIFT plus a pad to the active mode and warns before Hot Cue deletion', () => {
    const pads = deckControls.find(({id}) => id === 'deck-left-pad-grid')!;
    const shifted = `${pads.shift?.summary} ${pads.shift?.detail} ${pads.shift?.why} ${pads.shift?.gotcha}`;

    expect(pads.shiftLegend).toBeUndefined();
    expect(shifted).toMatch(/only.*Hot Cue mode|Hot Cue mode only/i);
    expect(shifted).toMatch(/SHIFT.*assigned.*pad.*deletes.*Hot Cue/is);
    expect(shifted).toMatch(/not.*every pad mode|not.*global/i);
    expect(shifted).toMatch(/confirm.*deck.*pad/is);
  });

  it('carries both lessons to the derived right deck without duplicating prose', () => {
    const leftJog = deckControls.find(({id}) => id === 'deck-left-jog-dial')!;
    const rightJog = rightDeckControls.find(({id}) => id === 'deck-right-jog-dial')!;
    const leftPads = deckControls.find(({id}) => id === 'deck-left-pad-grid')!;
    const rightPads = rightDeckControls.find(({id}) => id === 'deck-right-pad-grid')!;

    expect(rightJog.primary).toBe(leftJog.primary);
    expect(rightPads.shift).toBe(leftPads.shift);
  });
});
