import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {Control, Rect} from '@/content/types';
import {Hotspot} from '../Hotspot';

const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
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
});

afterAll(() => {
  if (originalMatchMedia) {
    Object.defineProperty(window, 'matchMedia', originalMatchMedia);
  } else {
    delete (window as unknown as {matchMedia?: typeof window.matchMedia}).matchMedia;
  }
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
    expect(trigger.parentElement?.style.transition).toBe(
      'left var(--duration-medium) var(--ease-standard), top var(--duration-medium) var(--ease-standard)',
    );
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

    const trigger = screen.getByRole('button', {name: 'SLIP'});
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(await screen.findByText(control.primary.summary)).toBeDefined();
  });

  it('opens the shift behavior from the shift trigger', async () => {
    const user = userEvent.setup();
    render(<Hotspot control={control} rect={FULL} isShiftActive />);

    const trigger = screen.getByRole('button', {name: 'VINYL'});
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(await screen.findByText(control.shift!.summary)).toBeDefined();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Hotspot control={control} rect={FULL} isShiftActive={false} />);
    const trigger = screen.getByRole('button', {name: 'SLIP'});

    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    await user.keyboard('{Escape}');

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('resets an open popover after the hotspot leaves and re-enters the crop', async () => {
    const user = userEvent.setup();
    const {container, rerender} = render(
      <Hotspot control={control} rect={FULL} isShiftActive={false} />,
    );
    const trigger = screen.getByRole('button', {name: 'SLIP'});

    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    rerender(
      <Hotspot
        control={control}
        rect={{x: 0.5, y: 0, w: 0.5, h: 1}}
        isShiftActive={false}
      />,
    );
    expect(container.firstChild).toBeNull();

    rerender(<Hotspot control={control} rect={FULL} isShiftActive={false} />);
    expect(screen.getByRole('button', {name: 'SLIP'}).getAttribute('aria-expanded'))
      .toBe('false');
  });

  it('does not preserve open state when the control identity changes', async () => {
    const user = userEvent.setup();
    const {rerender} = render(
      <Hotspot control={control} rect={FULL} isShiftActive={false} />,
    );
    const trigger = screen.getByRole('button', {name: 'SLIP'});

    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const nextControl: Control = {
      ...control,
      id: 'deck-left-play',
      label: 'PLAY',
    };
    rerender(<Hotspot control={nextControl} rect={FULL} isShiftActive={false} />);

    expect(screen.getByRole('button', {name: 'PLAY'}).getAttribute('aria-expanded'))
      .toBe('false');
  });
});
