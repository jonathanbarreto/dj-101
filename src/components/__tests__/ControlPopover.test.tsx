import {render, screen} from '@testing-library/react';
import {beforeAll, describe, expect, it} from 'vitest';
import type {Control} from '@/content/types';
import {ControlPopover} from '../ControlPopover';

const control: Control = {
  id: 'fx-selector',
  ref: 28,
  surface: 'hardware',
  section: 'fx',
  label: 'BEAT FX SELECT',
  kind: 'knob',
  at: {x: 0.62, y: 0.659},
  primary: {
    summary: 'Chooses one of fourteen Beat FX',
    detail: '# Mechanics\nTurn the selector to choose the effect printed around the control.',
    why: 'Choose the musical job before setting timing, target, and intensity.',
    source: 'manual',
  },
  referenceLinks: [
    {href: '/reference/beat-fx', label: 'Compare all 14 Beat FX'},
  ],
};

describe('ControlPopover reference links', () => {
  beforeAll(() => {
    window.matchMedia = () => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  });

  it('renders typed learn-more routes with Astryx Link', () => {
    render(<ControlPopover control={control} isShiftActive={false} />);

    expect(screen.getByText('Learn more')).toBeDefined();
    expect(screen.getByRole('link', {name: /Compare all 14 Beat FX/}).getAttribute('href'))
      .toBe('/reference/beat-fx');
  });

  it('continues the page heading hierarchy inside the popover', () => {
    render(<ControlPopover control={control} isShiftActive={false} />);

    expect(screen.getByRole('heading', {level: 2, name: 'BEAT FX SELECT'})).toBeDefined();
    expect(screen.getByRole('heading', {level: 3, name: 'Mechanics'})).toBeDefined();
    expect(screen.queryByRole('heading', {level: 5})).toBeNull();
    expect(screen.queryByRole('heading', {level: 6})).toBeNull();
  });
});
