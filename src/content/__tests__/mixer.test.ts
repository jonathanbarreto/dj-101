import {describe, expect, it} from 'vitest';

import {mixerControls, MIXER_CHANNEL_ORDER} from '../hardware/mixer';

const channelControls = mixerControls.filter((control) => control.id.startsWith('mixer-ch'));
const globalControls = mixerControls.filter((control) => !control.id.startsWith('mixer-ch'));

describe('DDJ-1000 four-channel mixer content', () => {
  it('builds ten controls for each strip in physical 3 · 1 · 2 · 4 order', () => {
    expect(MIXER_CHANNEL_ORDER).toEqual([3, 1, 2, 4]);
    expect(channelControls).toHaveLength(40);
    expect(channelControls.map((control) => control.id.match(/^mixer-ch(\d)-/)?.[1]))
      .toEqual([...'3'.repeat(10), ...'1'.repeat(10), ...'2'.repeat(10), ...'4'.repeat(10)]);
    expect(channelControls.map((control) => control.ref)).toEqual(
      MIXER_CHANNEL_ORDER.flatMap(() => [11, 9, 10, 8, 7, 6, 5, 4, 3, 2]),
    );
  });

  it('owns exactly canonical refs 1–19 and 21–25, never Task 14 refs', () => {
    const refs = new Set(mixerControls.map((control) => control.ref));
    expect(mixerControls).toHaveLength(54);
    expect([...refs].sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      21, 22, 23, 24, 25,
    ]);
    expect([...refs]).not.toContain(20);
    for (let ref = 26; ref <= 31; ref += 1) expect([...refs]).not.toContain(ref);
  });

  it('teaches the two input-selector variants precisely', () => {
    for (const channel of [3, 4]) {
      const selector = mixerControls.find((control) => control.id === `mixer-ch${channel}-input`)!;
      expect(selector.primary.detail).toMatch(/USB A.*PHONO.*LINE.*USB B/i);
      expect(selector.primary.detail).toMatch(/rear.*PHONO.LINE/i);
    }
    for (const channel of [1, 2]) {
      const selector = mixerControls.find((control) => control.id === `mixer-ch${channel}-input`)!;
      expect(selector.primary.detail).toMatch(/USB A.*LINE.*USB B/i);
      expect(selector.primary.detail).not.toMatch(/rear.*PHONO.LINE/i);
      expect(selector.primary.gotcha).toMatch(/not.*phono/i);
    }
  });

  it('separates gain staging, EQ roles, CUE, faders, and assign behavior', () => {
    for (const channel of MIXER_CHANNEL_ORDER) {
      const get = (slug: string) => mixerControls.find((control) => control.id === `mixer-ch${channel}-${slug}`)!;
      expect(get('trim').primary.detail).toMatch(/pre-fader/i);
      expect(get('trim').primary.detail).toMatch(/-∞.*\+9 dB/i);
      expect(get('trim').primary.why).toMatch(/loudest passage|orange|headroom/i);
      expect(get('meter').primary.detail).toMatch(/pre-fader/i);
      expect(get('high').primary.why).toMatch(/cymbal|presence|space/i);
      expect(get('mid').primary.why).toMatch(/vocal|synth|collision/i);
      expect(get('low').primary.why).toMatch(/kick|sub|bass/i);
      expect(get('color').primary.detail).toMatch(/selected.*Sound Color FX|centre.*off/i);
      expect(get('cue').primary.detail).toMatch(/pre-fader.*headphone/i);
      expect(get('cue').shift?.detail).toMatch(/TAP.*rekordbox.*USB/i);
      expect(get('fader').primary.gotcha).toMatch(/curve.*rekordbox 7/i);
      expect(get('assign').primary.detail).toMatch(/A.*THRU.*B/i);
      expect(get('assign').primary.detail).toMatch(/THRU.*bypass/i);
    }
  });

  it('limits fader-start teaching to verified USB-deck conditions', () => {
    for (const channel of MIXER_CHANNEL_ORDER) {
      const fader = mixerControls.find((control) => control.id === `mixer-ch${channel}-fader`)!;
      expect(fader.shift?.detail).toMatch(/cue point/i);
      expect(fader.shift?.detail).toMatch(/raise.*closed.*start/i);
      expect(fader.shift?.detail).toMatch(/return.*closed.*back-cue|return.*closed.*cue/i);
      expect(fader.shift?.detail).toMatch(/Preferences.*Controller.*Mixer.*Fader Start/i);
      expect(fader.shift?.detail).toMatch(/enabled by default/i);
      expect(`${fader.shift?.why} ${fader.shift?.gotcha}`).toMatch(/if.*does not start|troubleshoot|check.*setting/i);
      expect(fader.shift?.gotcha).toMatch(/USB|analogue/i);
    }
    const crossfader = mixerControls.find((control) => control.ref === 1)!;
    expect(crossfader.shift?.detail).toMatch(/A.*B.*cue/i);
    expect(crossfader.shift?.detail).toMatch(/closed side.*starts/i);
    expect(crossfader.shift?.detail).toMatch(/Preferences.*Controller.*Mixer.*Fader Start/i);
    expect(crossfader.shift?.detail).toMatch(/enabled by default/i);
    expect(`${crossfader.shift?.why} ${crossfader.shift?.gotcha}`)
      .toMatch(/if.*does not start|troubleshoot|check.*setting/i);
  });

  it('teaches master, booth, monitoring, sampler, mic, and talkover accurately', () => {
    const byRef = (ref: number) => mixerControls.find((control) => control.ref === ref)!;
    expect(byRef(12).primary.detail).toMatch(/MASTER 1.*MASTER 2/i);
    expect(byRef(12).primary.gotcha).toMatch(/BOOTH/i);
    expect(byRef(13).primary.detail).toMatch(/-24.*\+15.*stereo/i);
    expect(byRef(13).primary.detail).toMatch(/CLIP.*slow.*near.*fast.*distort/i);
    expect(byRef(14).primary.detail).toMatch(/independent.*MASTER/i);
    expect(byRef(15).primary.detail).toMatch(/MIXING.*MASTER/i);
    expect(byRef(17).primary.detail).toMatch(/CUE.*MASTER/i);
    expect(byRef(16).primary.why).toMatch(/hearing|safe|ears/i);
    expect(byRef(18).primary.detail).toMatch(/overall.*sampler/i);
    expect(byRef(19).primary.detail).toMatch(/sampler.*headphones/i);
    expect(byRef(24).primary.detail).toMatch(/MIC 1.*combo/i);
    expect(byRef(23).primary.detail).toMatch(/MIC 2.*TRS/i);
    expect(byRef(22).primary.detail).toMatch(/\+12.*-12.*10 kHz/i);
    expect(byRef(21).primary.detail).toMatch(/\+12.*-12.*100 Hz/i);
    expect(byRef(25).primary.detail).toMatch(/ON.*solid.*TALK OVER.*flash/i);
    expect(byRef(25).primary.detail).toMatch(/-10 dB.*-18 dB/i);
    expect(byRef(25).primary.detail).toMatch(/Normal.*Advanced.*mid/i);
  });

  it('uses direct, non-grid coordinates inside the measured mixer crop', () => {
    const points = mixerControls.map(({at}) => `${at.x.toFixed(4)},${at.y.toFixed(4)}`);
    expect(new Set(points).size).toBe(mixerControls.length);
    for (const control of mixerControls) {
      expect(control.at.x, control.id).toBeGreaterThanOrEqual(0.332);
      expect(control.at.x, control.id).toBeLessThanOrEqual(0.628);
      expect(control.at.y, control.id).toBeGreaterThanOrEqual(0.022);
      expect(control.at.y, control.id).toBeLessThanOrEqual(0.978);
    }
  });

  it('keeps every lesson substantial, specific, and free of forbidden sources', () => {
    for (const control of mixerControls) {
      for (const behavior of [control.primary, control.shift].filter(Boolean)) {
        expect(behavior!.source, control.id).toBe('manual');
        expect(behavior!.detail.length, `${control.id} detail`).toBeGreaterThan(100);
        expect(behavior!.why.length, `${control.id} why`).toBeGreaterThan(100);
        expect(`${behavior!.summary} ${behavior!.detail} ${behavior!.why}`)
          .not.toMatch(/VirtualDJ|Serato/i);
      }
    }
  });
});
