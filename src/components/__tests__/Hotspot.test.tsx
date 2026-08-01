import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {Control, Rect} from '@/content/types';
import {Hotspot} from '../Hotspot';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

const control: Control = {
  id: 'deck-left-slip',
  surface: 'hardware',
  section: 'deck-left',
  label: 'SLIP',
  shiftLegend: 'VINYL',
  kind: 'button',
  at: {x: 0.1, y: 0.2},
  primary: {
    summary: 'Keeps the track playing underneath your performance',
    detail: 'Slip mode detail text long enough to pass validation.',
    why: 'Reach for it when you want to go wild and land back on the grid.',
    source: 'manual',
  },
  shift: {
    summary: 'Toggles vinyl mode on and off',
    detail: 'Vinyl mode detail text long enough to pass validation.',
    why: 'Turn it on when you want the jog top to scratch rather than bend.',
    source: 'manual',
  },
};

const FULL: Rect = {x: 0, y: 0, w: 1, h: 1};

describe('Hotspot', () => {
  it('renders the primary trigger with the control label', () => {
    render(<Hotspot control={control} rect={FULL} isShiftActive={false} />);

    expect(screen.getByRole('button', {name: 'SLIP'})).toBeDefined();
  });

  it('maps a point into a half-width crop', () => {
    render(
      <Hotspot
        control={control}
        rect={{x: 0, y: 0, w: 0.5, h: 1}}
        isShiftActive={false}
      />,
    );

    const trigger = screen.getByRole('button', {name: 'SLIP'});
    expect(trigger.parentElement?.style.left).toBe('20%');
  });

  it('does not render a marker outside the crop', () => {
    const {container} = render(
      <Hotspot
        control={control}
        rect={{x: 0.5, y: 0, w: 0.5, h: 1}}
        isShiftActive={false}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders the shift trigger with the shift legend', () => {
    render(<Hotspot control={control} rect={FULL} isShiftActive />);

    expect(screen.getByRole('button', {name: 'VINYL'})).toBeDefined();
  });

  it('opens the primary behavior from the primary trigger', async () => {
    const user = userEvent.setup();
    render(<Hotspot control={control} rect={FULL} isShiftActive={false} />);

    await user.click(screen.getByRole('button', {name: 'SLIP'}));

    expect(await screen.findByText(control.primary.summary)).toBeDefined();
  });

  it('opens the shift behavior from the shift trigger', async () => {
    const user = userEvent.setup();
    render(<Hotspot control={control} rect={FULL} isShiftActive />);

    await user.click(screen.getByRole('button', {name: 'VINYL'}));

    expect(await screen.findByText(control.shift!.summary)).toBeDefined();
  });
});
