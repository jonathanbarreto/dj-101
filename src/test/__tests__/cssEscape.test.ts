import {describe, expect, it, vi} from 'vitest';
import {cssEscape, installCssEscape} from '../cssEscape';

describe('CSS.escape test shim', () => {
  it.each([
    ['leading digit', '1deck', '\\31 deck'],
    ['control character', `a${String.fromCharCode(1)}b`, 'a\\1 b'],
    ['null character', `a${String.fromCharCode(0)}b`, 'a�b'],
    ['non-ASCII text', 'déjà', 'déjà'],
    ['lone hyphen', '-', '\\-'],
  ])('escapes %s according to CSSOM serialization', (_name, value, expected) => {
    expect(cssEscape(value)).toBe(expected);
  });

  it('adds a missing escape method without discarding existing CSS members', () => {
    const supports = vi.fn();
    const target = {CSS: {supports}};

    installCssEscape(target);

    expect(target.CSS.supports).toBe(supports);
    expect(target.CSS.escape('1deck')).toBe('\\31 deck');
  });

  it('preserves an existing escape implementation', () => {
    const escape = vi.fn(() => 'existing');
    const target = {CSS: {escape}};

    installCssEscape(target);

    expect(target.CSS.escape).toBe(escape);
  });
});
