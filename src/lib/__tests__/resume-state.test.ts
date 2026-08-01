import {afterEach, describe, expect, it} from 'vitest';
import {
  readResumeTarget,
  resumeHref,
  saveResumeTarget,
  type ResumeTarget,
} from '../resume-state';

const storageKey = 'dj101:resume:v1';
const validTarget: ResumeTarget = {
  surface: 'hardware',
  sectionId: 'mixer',
  controlId: 'mixer-headphones-mixing',
};

afterEach(() => {
  window.sessionStorage.clear();
});

describe('resume state', () => {
  it('saves and reads a valid target for its surface', () => {
    saveResumeTarget(validTarget);

    expect(readResumeTarget('hardware')).toEqual(validTarget);
  });

  it('uses one versioned session storage key', () => {
    saveResumeTarget(validTarget);

    expect(window.sessionStorage.length).toBe(1);
    expect(window.sessionStorage.getItem(storageKey)).toBe(JSON.stringify(validTarget));
  });

  it('does not return a target from the other surface', () => {
    saveResumeTarget(validTarget);

    expect(readResumeTarget('software')).toBeNull();
  });

  it.each([
    ['malformed JSON', '{'],
    ['a missing section', JSON.stringify({surface: 'hardware'})],
    ['a stale section', JSON.stringify({surface: 'hardware', sectionId: 'nope'})],
    ['an unknown control', JSON.stringify({...validTarget, controlId: 'missing-control'})],
    ['a control from another section', JSON.stringify({...validTarget, controlId: 'deck-left-jog-dial'})],
    ['a control from another surface', JSON.stringify({
      surface: 'software', sectionId: 'rb-deck', controlId: 'deck-left-jog-dial',
    })],
  ])('removes %s', (_reason, value) => {
    window.sessionStorage.setItem(storageKey, value);

    expect(readResumeTarget('hardware')).toBeNull();
    expect(window.sessionStorage.getItem(storageKey)).toBeNull();
  });

  it('removes a valid target when requested from the wrong surface', () => {
    saveResumeTarget(validTarget);

    expect(readResumeTarget('software')).toBeNull();
    expect(window.sessionStorage.getItem(storageKey)).toBeNull();
  });

  it('removes a section whose surface no longer matches', () => {
    window.sessionStorage.setItem(storageKey, JSON.stringify({surface: 'hardware', sectionId: 'rb-deck'}));

    expect(readResumeTarget('hardware')).toBeNull();
    expect(window.sessionStorage.getItem(storageKey)).toBeNull();
  });

  it('is a safe no-op when session storage is unavailable', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'sessionStorage');
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get: () => { throw new DOMException('Blocked', 'SecurityError'); },
    });

    try {
      expect(() => saveResumeTarget(validTarget)).not.toThrow();
      expect(readResumeTarget('hardware')).toBeNull();
    } finally {
      if (descriptor) Object.defineProperty(window, 'sessionStorage', descriptor);
      else delete (window as Partial<Window>).sessionStorage;
    }
  });

  it('is a safe no-op during server rendering', () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
    Object.defineProperty(globalThis, 'window', {configurable: true, value: undefined});

    try {
      expect(() => saveResumeTarget(validTarget)).not.toThrow();
      expect(readResumeTarget('hardware')).toBeNull();
    } finally {
      if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    }
  });

  it('builds a controller href with an encoded control fragment', () => {
    expect(resumeHref({...validTarget, controlId: 'control / # one'})).toBe(
      '/controller/mixer#control%20%2F%20%23%20one',
    );
  });

  it('builds a rekordbox href without a control fragment', () => {
    expect(resumeHref({surface: 'software', sectionId: 'rb-deck'})).toBe('/rekordbox/rb-deck');
  });
});
