import {access} from 'node:fs/promises';
import {resolve} from 'node:path';

import sharp from 'sharp';
import {describe, expect, it} from 'vitest';

import {deckControls} from '../hardware/deck';
import {rightDeckControls} from '../hardware/right-deck';
import {rbDeckControls} from '../rekordbox/deck';
import {SURFACES} from '../surfaces';

const expectedIds = [
  'rb-deck-artwork',
  'rb-deck-title',
  'rb-deck-artist',
  'rb-deck-original-bpm',
  'rb-deck-original-key',
  'rb-deck-remaining-time',
  'rb-deck-elapsed-time',
  'rb-deck-key-sync',
  'rb-deck-key-shift',
  'rb-deck-beat-sync',
  'rb-deck-master',
  'rb-deck-hot-cue-marker',
  'rb-deck-cue-point-marker',
  'rb-deck-lighting-scenes',
  'rb-deck-stems',
  'rb-deck-performance-pad-toggle',
  'rb-deck-grid-edit-toggle',
  'rb-deck-performance-pads',
  'rb-deck-auto-loop',
  'rb-deck-loop-length',
  'rb-deck-loop-mode',
  'rb-deck-dvs-mode',
  'rb-deck-cue',
  'rb-deck-play-pause',
  'rb-deck-jog-tempo',
  'rb-deck-slip',
  'rb-deck-quantize',
  'rb-deck-master-tempo',
] as const;

describe('rekordbox 7 player deck content', () => {
  it('models the complete 28-element player-deck key without invented controls', () => {
    expect(rbDeckControls.map((control) => control.id)).toEqual(expectedIds);
    expect(rbDeckControls).toHaveLength(28);
    expect(rbDeckControls.every((control) => control.surface === 'software')).toBe(true);
    expect(rbDeckControls.every((control) => control.section === 'rb-deck')).toBe(true);
  });

  it('marks DVS as subscription content while keeping stems available', () => {
    expect(rbDeckControls.filter((control) => control.primary.tier === 'subscription').map((control) => control.id))
      .toEqual(['rb-deck-dvs-mode']);
    const stems = rbDeckControls.find((control) => control.id === 'rb-deck-stems');
    expect(stems?.primary.gotcha).toMatch(/DDJ-1000.*without a paid plan/i);
    expect(stems?.primary.gotcha).toContain('Preferences → Extensions → STEMS');
  });

  it('describes ACTIVE STEM controls without treating MUTE as a stem button', () => {
    const stems = rbDeckControls.find((control) => control.id === 'rb-deck-stems');
    expect(stems?.primary.detail).toMatch(/MUTE or SOLO/);
    expect(stems?.primary.detail).toMatch(/each (?:part|Stem) button/i);
  });

  it('teaches screen-specific information rather than repeating hardware copy', () => {
    for (const control of rbDeckControls) {
      expect(control.primary.summary, `${control.id} summary`).not.toMatch(/\.$/);
      expect(control.primary.why.split(/\s+/).length, `${control.id} why`).toBeGreaterThan(15);
      expect(control.primary.source, `${control.id} source`).toBe('rekordbox7');
    }
  });

  it('keeps every declared cross-surface link reciprocal, including one-to-many links', () => {
    const all = [...deckControls, ...rightDeckControls, ...rbDeckControls];

    for (const control of all) {
      for (const targetId of control.counterpart ?? []) {
        const target = all.find((candidate) => candidate.id === targetId);
        expect(target, `${control.id} -> ${targetId}`).toBeDefined();
        expect(target?.counterpart, `${targetId} must return to ${control.id}`).toContain(control.id);
      }
    }

    expect(rbDeckControls.find((control) => control.id === 'rb-deck-performance-pads')?.counterpart)
      .toEqual([
        'deck-left-hot-cue',
        'deck-right-hot-cue',
        'deck-left-pad-fx-1',
        'deck-right-pad-fx-1',
        'deck-left-beat-jump',
        'deck-right-beat-jump',
        'deck-left-sampler',
        'deck-right-sampler',
        'deck-left-pad-grid',
        'deck-right-pad-grid',
      ]);
  });

  it('does not claim AU/MA remaps the controller loop buttons', () => {
    const loopMode = rbDeckControls.find((control) => control.id === 'rb-deck-loop-mode');
    expect(loopMode?.counterpart).toBeUndefined();
    expect(loopMode?.primary.detail).toMatch(/on-screen JOG panel/i);
    expect(loopMode?.primary.why).not.toMatch(/hardware loop buttons/i);
  });

  it('makes dynamic MASTER and KEY RESET hardware paths explicit', () => {
    const master = rbDeckControls.find((control) => control.id === 'rb-deck-master');
    const masterTempo = rbDeckControls.find((control) => control.id === 'rb-deck-master-tempo');
    const keyReset = deckControls.find((control) => control.id === 'deck-left-key-reset');

    expect(master?.primary.detail).toMatch(/hold SHIFT.*BEAT SYNC/i);
    expect(masterTempo?.counterpart).toContain('deck-left-key-reset');
    expect(keyReset?.counterpart).toContain('rb-deck-master-tempo');
  });
});

describe('rekordbox software master', () => {
  it('uses one verified 1200x634 master image for the software surface', async () => {
    const imagePath = resolve(process.cwd(), 'public/images/rekordbox-master.avif');
    await access(imagePath);
    const metadata = await sharp(imagePath).metadata();

    expect(metadata.width).toBe(1200);
    expect(metadata.height).toBe(634);
    expect(SURFACES.software).toMatchObject({
      image: '/images/rekordbox-master.avif',
      naturalWidth: 1200,
      naturalHeight: 634,
    });
  });
});
