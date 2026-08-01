import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import {CounterpartLink} from '../CounterpartLink';

describe('CounterpartLink', () => {
  it('uses the Astryx link primitive with explicit word boundaries', () => {
    render(<CounterpartLink ids={['rb-deck-slip']} />);

    const link = screen.getByRole('link', {name: 'See SLIP on screen →'});
    expect(link.getAttribute('href')).toBe('/rekordbox/rb-deck#rb-deck-slip');
    expect(link.className).toContain('astryx-link');
  });
});
