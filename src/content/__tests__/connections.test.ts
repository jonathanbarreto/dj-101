import {describe, expect, it} from 'vitest';

import {ALL_CONTROLS} from '../index';
import {
  connectionLessons,
  dualUsbChangeoverSteps,
  dualUsbSignalFlow,
  setupRecipes,
  shutdownOrder,
} from '../hardware/connections';

describe('DDJ-1000 connection lessons', () => {
  it('owns the exact structural inventory without inventing reference 85', () => {
    expect(connectionLessons.map(({id, ref}) => [id, ref])).toEqual([
      ['front-phones', 70],
      ['rear-master-1', 71],
      ['rear-master-2', 72],
      ['rear-booth', 73],
      ['rear-signal-gnd', 74],
      ['rear-ch4-line-phono', 75],
      ['rear-ch2-line', 76],
      ['rear-ch1-line', 77],
      ['rear-ch3-line-phono', 78],
      ['rear-usb-b', 79],
      ['rear-usb-a', 80],
      ['rear-mic-2', 81],
      ['rear-mic-1', 82],
      ['rear-power', 83],
      ['rear-dc-in', 84],
      ['rear-kensington', undefined],
      ['rear-cord-hook', undefined],
    ]);
    expect(connectionLessons).toHaveLength(17);
    expect(connectionLessons.some(({ref}) => ref === 85)).toBe(false);
  });

  it('teaches every connection as a real setup decision sourced to the manual', () => {
    for (const lesson of connectionLessons) {
      expect(lesson.source, lesson.id).toBe('manual');
      expect(lesson.connector.trim().length, `${lesson.id} connector`).toBeGreaterThan(2);
      expect(lesson.balance.trim().length, `${lesson.id} balance`).toBeGreaterThan(2);
      expect(lesson.governedBy.trim().length, `${lesson.id} governing control`).toBeGreaterThan(2);
      expect(lesson.why.split(/\s+/).length, `${lesson.id} why`).toBeGreaterThan(8);
      expect(lesson.setup.split(/\s+/).length, `${lesson.id} setup`).toBeGreaterThan(8);
      expect(lesson.failure.split(/\s+/).length, `${lesson.id} failure`).toBeGreaterThan(8);
      expect(lesson.safety.split(/\s+/).length, `${lesson.id} safety`).toBeGreaterThan(5);
    }
  });

  it('calls out the safety-critical electrical and source-matching rules', () => {
    const byId = Object.fromEntries(connectionLessons.map((lesson) => [lesson.id, lesson]));

    expect(byId['rear-master-1'].safety).toMatch(/phantom power/i);
    expect(byId['rear-master-2'].connector).toMatch(/RCA/i);
    expect(byId['rear-master-2'].balance).toMatch(/unbalanced/i);
    expect(byId['rear-booth'].governedBy).toMatch(/BOOTH MONITOR LEVEL/i);
    expect(byId['rear-booth'].why).toMatch(/independent/i);
    expect(byId['rear-signal-gnd'].setup).toMatch(/turntable.*ground/i);
    expect(byId['rear-ch4-line-phono'].failure).toMatch(/mismatch|wrong/i);
    expect(byId['rear-ch4-line-phono'].setup).toMatch(/moving-magnet|MM/i);
    expect(byId['rear-ch3-line-phono'].setup).toMatch(/moving-magnet|MM/i);
    expect(byId['rear-ch1-line'].failure).toMatch(/not.*phono|phono.*preamp/i);
    expect(byId['rear-ch2-line'].failure).toMatch(/not.*phono|phono.*preamp/i);
    expect(byId['rear-usb-a'].connector).toMatch(/USB Type-B/i);
    expect(byId['rear-usb-b'].connector).toMatch(/USB Type-B/i);
    expect(`${byId['rear-usb-a'].setup} ${byId['rear-usb-b'].setup}`).toMatch(/direct.*computer|computer.*direct/i);
    expect(`${byId['rear-usb-a'].safety} ${byId['rear-usb-b'].safety}`).toMatch(/hub/i);
    expect(byId['rear-mic-1'].connector).toMatch(/XLR.*1\/4-inch|combo/i);
    expect(byId['rear-mic-2'].connector).toMatch(/1\/4-inch.*TRS/i);
    expect(byId['rear-dc-in'].setup).toMatch(/supplied.*adapter/i);
    expect(byId['rear-cord-hook'].why).toMatch(/unplug|pull/i);
    expect(byId['front-phones'].why).toMatch(/same.*cue|same.*headphone/i);
  });

  it('models dual USB as per-channel routing and a safe seven-step handoff', () => {
    expect(dualUsbSignalFlow.map((step) => step.label)).toEqual([
      'Laptop A or B',
      'Matching rear USB terminal',
      'Per-channel input selector',
      'Channel signal path',
      'Master and booth outputs',
    ]);
    expect(dualUsbChangeoverSteps).toHaveLength(7);
    expect(dualUsbChangeoverSteps.join(' ')).toMatch(/one channel at a time/i);
    expect(dualUsbChangeoverSteps.join(' ')).toMatch(/master.*booth/i);
    expect(dualUsbChangeoverSteps.join(' ')).not.toMatch(/transfer.*track|transfer.*state|sync.*laptop/i);
  });

  it('includes six beginner setups and a speaker-safe shutdown order', () => {
    expect(setupRecipes).toHaveLength(6);
    expect(setupRecipes.map(({name}) => name)).toEqual([
      'Laptop and powered speakers',
      'Laptop, PA and booth monitor',
      'Two-laptop changeover',
      'Turntable on channel 3',
      'Line player on channel 1',
      'Microphone and headphones',
    ]);
    expect(shutdownOrder).toHaveLength(5);
    expect(shutdownOrder[0]).toMatch(/levels.*down|faders.*down/i);
    expect(shutdownOrder.at(-1)).toMatch(/controller|adapter/i);
  });

  it('keeps text-only panel lessons out of the image hotspot registry', () => {
    expect(ALL_CONTROLS.some(({section}) => section === 'rear' || section === 'front')).toBe(false);
  });
});
