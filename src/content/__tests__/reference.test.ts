import {describe, expect, it} from 'vitest';
import {beatFx} from '../reference/beat-fx';
import {soundColorFx} from '../reference/sound-color-fx';
import {specifications} from '../reference/specs';

describe('Beat FX reference', () => {
  it('follows the selector order exactly', () => {
    expect(beatFx.map((effect) => effect.name)).toEqual([
      'ENIGMA JET',
      'TRANS',
      'REVERB',
      'SPIRAL',
      'MT DELAY',
      'ECHO',
      'LOW CUT ECHO',
      'FLANGER',
      'PHASER',
      'PITCH',
      'SLIP ROLL',
      'ROLL',
      'MOBIUS (SAW)',
      'MOBIUS (TRI)',
    ]);
  });

  it('marks only the four DDJ-1000-exclusive effects', () => {
    expect(beatFx.filter((effect) => effect.isExclusive).map((effect) => effect.name))
      .toEqual(['ENIGMA JET', 'LOW CUT ECHO', 'MOBIUS (SAW)', 'MOBIUS (TRI)']);
  });

  it('explains every effect and its exact LEVEL/DEPTH behavior', () => {
    for (const effect of beatFx) {
      expect(effect.description.trim().length, effect.name).toBeGreaterThan(80);
      expect(effect.levelDepth.trim().length, effect.name).toBeGreaterThan(24);
    }

    expect(beatFx.find((effect) => effect.name === 'MT DELAY')?.levelDepth)
      .toMatch(/odd.+center.+even/i);
    expect(beatFx.find((effect) => effect.name === 'TRANS')?.levelDepth)
      .toMatch(/duty ratio.+balance/i);
    expect(beatFx.find((effect) => effect.name === 'SLIP ROLL')?.description)
      .toMatch(/continues underneath.+timeline/i);
    expect(beatFx.find((effect) => effect.name === 'ROLL')?.description)
      .toMatch(/does not continue underneath/i);
    for (const name of ['MOBIUS (SAW)', 'MOBIUS (TRI)']) {
      expect(beatFx.find((effect) => effect.name === name)?.description)
        .toMatch(/track stopped.+Shepard/i);
    }
  });
});

describe('Sound Color FX reference', () => {
  it('documents exactly the four panel effects in order', () => {
    expect(soundColorFx.map((effect) => effect.name)).toEqual([
      'DUB ECHO',
      'PITCH',
      'NOISE',
      'FILTER',
    ]);
  });

  it('states that COLOR is off at center and explains both directions', () => {
    for (const effect of soundColorFx) {
      expect(effect.center).toMatch(/off/i);
      expect(effect.turnLeft.trim().length, effect.name).toBeGreaterThan(24);
      expect(effect.turnRight.trim().length, effect.name).toBeGreaterThan(24);
    }
    expect(soundColorFx.find((effect) => effect.name === 'DUB ECHO')?.turnLeft)
      .toMatch(/mid/i);
    expect(soundColorFx.find((effect) => effect.name === 'DUB ECHO')?.turnRight)
      .toMatch(/high/i);
    expect(soundColorFx.find((effect) => effect.name === 'FILTER')?.turnLeft)
      .toMatch(/low-pass/i);
    expect(soundColorFx.find((effect) => effect.name === 'FILTER')?.turnRight)
      .toMatch(/high-pass/i);
  });
});

describe('DDJ-1000 specifications', () => {
  it('records the verified physical and digital-audio facts', () => {
    expect(specifications.dimensionsMm).toEqual({width: 708, height: 73.4, depth: 361.4});
    expect(specifications.weightKg).toBe(6);
    expect(specifications.audio.samplingRateKhz).toBe(44.1);
    expect(specifications.audio.daConverterBits).toBe(32);
    expect(specifications.audio.adConverterBits).toBe(24);
    expect(specifications.audio.usbSignalToNoiseDb).toBe(112);
    expect(specifications.audio.usbTotalHarmonicDistortionPercent).toBe(0.002);
  });

  it('corrects the common 32-bit misconception explicitly', () => {
    expect(specifications.bitDepthCorrection).toMatch(/32-bit.+D\/A converter/i);
    expect(specifications.bitDepthCorrection).toMatch(/not.+streaming.+file.+processing bit depth/i);
    expect(specifications.bitDepthCorrection).toMatch(/44\.1 kHz only/i);
  });

  it('documents full-kill channel EQ, mic EQ, power, and the complete I/O list', () => {
    expect(specifications.channelEq).toEqual({minDb: -26, maxDb: 6, isFullKill: true});
    expect(specifications.microphoneEq).toEqual({minDb: -12, maxDb: 12});
    expect(specifications.power).toMatchObject({dcVolts: 12, currentMa: 2000});
    expect(specifications.io.map((port) => `${port.name}:${port.count}`)).toEqual([
      'LINE input (RCA):2',
      'LINE/PHONO input (RCA):2',
      'MIC 1 input (XLR / 1/4-inch TRS combo):1',
      'MIC 2 input (1/4-inch TRS):1',
      'MASTER 1 output (XLR):1',
      'MASTER 2 output (RCA):1',
      'BOOTH output (1/4-inch TRS):1',
      'PHONES output (1/4-inch stereo):1',
      'PHONES output (3.5 mm stereo mini):1',
      'USB-B terminal:2',
    ]);
  });
});
